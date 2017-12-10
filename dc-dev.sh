#!/usr/bin/env bash

# auto export env vars
set -a

# load extra env vars (optional)
source .compose-extras 2> /dev/null

docker-compose -f docker-compose.yml $DEV_COMPOSE_OPTIONS "$@"
