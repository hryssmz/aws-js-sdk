#!/bin/bash
if [ -n "$(pgrep httpd)" ]; then
    systemctl stop http
fi
if [ -n "$(pgrep mysqld)" ]; then
    systemctl stop mariadb
fi
if [ -n "$(pgrep php-fpm)" ]; then
    systemctl stop php-fpm
fi
