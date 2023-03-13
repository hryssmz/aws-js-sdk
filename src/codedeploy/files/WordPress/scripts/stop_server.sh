#!/bin/bash
if [ -n "$(pgrep httpd)" ]; then
    systemctl stop http.service
fi
if [ -n "$(pgrep mysqld)" ]; then
    systemctl stop mariadb.service
fi
if [ -n "$(pgrep php-fpm)" ]; then
    systemctl stop php-fpm.service
fi
