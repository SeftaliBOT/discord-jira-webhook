# Discord-Jira-Notifications

## Docker setup
1. `docker-machine create --virtualbox-disk-size 20000 --driver virtualbox discord-jira`
2. `eval "$(docker-machine env discord-jira)"`
3. `./dc-dev.sh up -d`
