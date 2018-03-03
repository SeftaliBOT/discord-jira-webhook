'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Discord = require("discord.js");

// Create a new instance of express
const app = express();

// create application/json parser
const jsonParser = bodyParser.json();

function parse_issue_payload(payload) {
  let issue = payload.issue;
  return {
    project_name: issue.fields.project.name,
    description: function() {
      if (issue.fields.description != null) {
        return issue.fields.description;
      }
      else if (issue.fields.description == null && issue.fields.status.name === 'Done') {
        return issue.fields.resolution.description;
      }
      else if (issue.fields.description == null && issue.fields.status.name === 'In Progress') {
        return issue.fields.status.description;
      }
    },
    title: issue.fields.summary,
    number: issue.key,
    status: issue.fields.status.name,
    assignedTo: issue.fields.assignee.displayName,
    link: encodeURI('https://' + process.env.JIRA_ACCOUNT_NAME + '.atlassian.net/browse/' + issue.key),
  };
}

app.get('/', function(req, res) { res.send('Were up and running!'); });

// Route that receives a POST request to /sms
app.post('/webhook', jsonParser, function (req, res) {

  // if there is not request body return a 400 error
  if (!req.body) return res.sendStatus(400);

  let issue = parse_issue_payload(req.body);

  // Create Webhook Client
  const hook = new Discord.WebhookClient(process.env.DISCORD_WEBHOOK_ID, process.env.DISCORD_WEBHOOK_SECRET);

  // the payload we are sending to discord
  let discord_payload = {
      username: 'JIRA',
      iconEmoji: ':robot_face:',
      attachments: [{
          pretext: issue.number,
          title: issue.title,
          title_link: issue.link,
          text: issue.description,
          fields: [
              {
                title: 'Status',
                value: issue.status
              },
              {
                title: 'Assigned To',
                value: issue.assignedTo
              }],
          color: '#2684FF',
      }]
    };

  // Send update to Discord Channel via Webhook with Slack formatting
  hook.sendSlackMessage(discord_payload).catch(console.error);
});


// Tell our app to listen on port 3000
app.listen(3000, function (err) {
    if (err) {
        throw err;
    }
    console.log('Server started on port 3000')
});
