# Discord Bot - QR Code Generator

```
  /psi https://kevin-taufer.com
```

![slackpsi](https://user-images.githubusercontent.com/102754713/168777981-c9d754bd-990f-4667-a1ca-4df60b64b9dc.png)



# Installation

### First

check out first the official slack documentation to understand how you can create and integrate a app
https://api.slack.com/authentication/basics
Also make sure you understand how the permissions in Slack work!

create a .dotenv file
````dotenv
SLACK_TOKEN = YOUR_BOT_TOKEN
API_KEY = PSI_API_KEY
PSI_URL = PSI_URL
````

Clone this repo and install all packages
```javascript
npm install
````

start endpoint for the slash command
```javascript
node .
```

# Usage

use slash command in discord chat
```
/psi <url>(NOTE! it needs to be with http or https prefix)
```
