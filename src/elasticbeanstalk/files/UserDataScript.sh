#!/bin/bash
set -e

exec > >(tee -a /var/log/eb-cfn-init.log|logger -t [eb-cfn-init] -s 2>/dev/console) 2>&1


function log
{
  NANOSEC=`date +%N`
  echo -e [`date -u +"%Y-%m-%dT%H:%M:%S"`.${NANOSEC:0:3}Z] "$@"
}

# Emit starting log
log Started EB Bootstrapping Script.

# Update cfn bootstrap to get the latest version of cfn-init etc
#yum update -y system-release
SIGNAL_URL=$1
STACK_ID=$2
HEALTHD_GROUP_ID=$3
HEALTHD_ENDPOINT=$4
HEALTHD_PROXY_LOG_LOCATION=$5
PLATFORM_ASSETS_URL=$6
REGION=$7

PARAM_LIST="Received parameters:\n\
    TARBALLS = $TARBALLS\n\
    EB_GEMS = $EB_GEMS\n\
    SIGNAL_URL = $SIGNAL_URL\n\
    STACK_ID = $STACK_ID\n\
    REGION = $REGION\n\
    GUID = $GUID\n\
    HEALTHD_GROUP_ID = $HEALTHD_GROUP_ID\n
    HEALTHD_ENDPOINT = $HEALTHD_ENDPOINT\n
    PROXY_SERVER = $PROXY_SERVER\n
    HEALTHD_PROXY_LOG_LOCATION = $HEALTHD_PROXY_LOG_LOCATION\n
    PLATFORM_ASSETS_URL = $PLATFORM_ASSETS_URL"
log $PARAM_LIST

# Helper functions
function error_exit
{
  cfn-signal 1 "$1"
  exit 1
}

function tailog
{
  log "Tailing $2"
  echo -e "\n******************* $1 taillog *******************"
  if [ -f "$2" ]; then
    echo -e "$(tail -n 50 $2)"
  else
    echo -e "***$1 is not available yet.***"
  fi
  echo -e "******************* End of taillog *******************\n\n"
}

function tail_logs
{
  tailog eb-commandprocessor /var/log/eb-commandprocessor.log
  tailog eb-activity /var/log/eb-activity.log
  tailog eb-tools /var/log/eb-tools.log
  tailog eb-version-deployment /var/log/eb-version-deployment.log
  tailog cfn-init /var/log/cfn-init.log
  tailog cfn-hup /var/log/cfn-hup.log
}

function log_and_exit
{
  log $1
  # signal success
  cfn-signal 0

  # Output startup logs into the console.
  tail_logs

  log Completed EB Bootstrapping Script.
  exit 0
}

SLEEP_TIME=10
SLEEP_TIME_MAX=86400 # One day
function sleep_delay
{
  if (( $SLEEP_TIME < $SLEEP_TIME_MAX )); then
    log Sleeping $SLEEP_TIME ...
    sleep $SLEEP_TIME
    SLEEP_TIME=$(($SLEEP_TIME * 2))
  else
    log Sleeping $SLEEP_TIME_MAX ...
    sleep $SLEEP_TIME_MAX
  fi
}

function retry_execute
{
  log Started executing $@.

  SLEEP_TIME=10
  while true; do
    FN_OUTPUT=""
    set +e
    "$@"
    RESULT=$?
    set -e
    log Command Returned: "$FN_OUTPUT"
    if (( $RESULT != 0 )); then
      log "Command return code $RESULT".
      tail_logs
      sleep_delay
      log Retrying...
    else
      break
    fi
  done

  log Completed executing $1.
}


function cfn_init
{
  log Running cfn-init ConfigSet: $1.

  if test -f "/opt/elasticbeanstalk/config/ebenvinfo/stackid"; then
    local stackname=$(cat /opt/elasticbeanstalk/config/ebenvinfo/stackid)
    log Using local cached stack name for reboot.
  else
    stackname=$STACK_ID
    log Using stack-id from userdata
  fi
  FN_OUTPUT=$(EB_EVENT_FILE=/var/log/eb-startupevents.log EB_SYSTEM_STARTUP=true /opt/aws/bin/cfn-init -s "$stackname" \
    -r AWSEBAutoScalingGroup --region "$REGION" --configsets $1 > /var/log/eb-cfn-init-call.log 2>&1 )
}

function cfn-signal
{
  if test -f "/opt/elasticbeanstalk/config/ebenvinfo/instancesignalURL"; then
      local signalurl=$(cat /opt/elasticbeanstalk/config/ebenvinfo/instancesignalURL)
  else
    # use default signal url if not specified in metadata
      local signalurl=$SIGNAL_URL
  fi
  if [[ -z $2 ]]; then
    local reason=""
  else
    local reason=" -r $2 "
  fi
  log Sending signal $1 to CFN wait condition $signalurl
  /opt/aws/bin/cfn-signal -e $1 $reason "$signalurl" || log 'Wait Condition Signal expired.'
}



#------------- Start of Execution -----------------

ENGINE_URL=""
ARCH=$(uname -m)
case $ARCH in
x86_64)
  ENGINE_URL="$PLATFORM_ASSETS_URL/lib/platform-engine.zip"
  ;;
aarch64)
  ENGINE_URL="$PLATFORM_ASSETS_URL/lib/platform-engine-arm64.zip"
  ;;
*)
  error_exit "unknown architecture $ARCH"
  ;;
esac
log engine url is set to "$ENGINE_URL"

if test -f "/opt/elasticbeanstalk/.aws-eb-system-bootstrapped"; then
   log reboot of instance.
   retry_execute cfn_init '_OnInstanceReboot'
   log finished _OnInstanceReboot
else
   log first init of instance.
   retry_execute cfn_init '_OnInstanceBoot'
   log finished _OnInstanceBoot

   /bin/wget --waitretry=20 -O /tmp/platform-engine.zip $ENGINE_URL
   mkdir -p /opt/elasticbeanstalk/bin
   /bin/unzip -o /tmp/platform-engine.zip -d /opt/elasticbeanstalk/
fi

# only move engine binary here
# we have a `InstallEngine` instruction to move /tmp/configuration dir to /opt/elasticbeanstalk

/opt/elasticbeanstalk/bin/platform-engine -command=userdata-exec -stack-id=$STACK_ID

log_and_exit 'Successfully bootstrapped instance.'
exit 0

