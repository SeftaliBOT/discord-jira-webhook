#!/bin/sh
set -e
kontena stack rm --force discord-bot-stack
sleep 5
kontena stack install --deploy kontena.yml
kontena stack logs -f --tail 100 discord-bot-stack
