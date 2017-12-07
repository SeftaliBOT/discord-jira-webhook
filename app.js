'use strict'

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const Discord = require("discord.js");

// Create a new instance of express
const app = express()

// create application/json parser
var jsonParser = bodyParser.json()

// Route that receives a POST request to /sms
app.post('/webhook', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400)

        // Easier formatting
        var issue = req.body.issue

        // Pull Jira account name from .env file
        var account_name = process.env.ACCOUNT_NAME
        
        // Extract needed info from Jira Payload
        var description = issue.fields.description
        var issue_title = issue.fields.summary
        var number = issue.key
        var status = issue.fields.status.name
        var link = encodeURI('https://'+account_name+'.atlassian.net/browse/'+number)

        // Create Webhook Client
        const hook = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_SECRET)
        
        // Send update to Discord Channel via Webhook with Slack formatting
        hook.sendSlackMessage({
            'username': 'Jira-Bot',
            'attachments': [{
                'pretext': number,
                'title': issue_title,
                'title_link': link,
                'text': description,
                "fields": [
                    {
                        "title": status,
                    }],
                'color': '#2684FF',
            }]
        }).catch(console.error)
    })


// Tell our app to listen on port 3000
app.listen(3000, function (err) {
    if (err) {
        throw err
    }

    console.log('Server started on port 3000')
})