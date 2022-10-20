#!/bin/sh
is_local="true"
local_endpoint="http://localstack:4566"
path_prefix="/dummy/"

# ====================================================================

aws="aws"
[ "${is_local}" = "true" ] && aws="${aws} --endpoint ${local_endpoint}"

${aws} --output table iam list-roles \
    --path-prefix ${path_prefix} \
    --max-items 5 \
    --query 'Roles[*].RoleName'
