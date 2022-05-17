require('dotenv').config();

const express = require('express');
const axios = require('axios');
const { WebClient } = require('@slack/web-api');

const URL_REGEX = /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
const web = new WebClient(process.env.SLACK_TOKEN);

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/api/psi', async (req, res) => {

  try{
    // get text and channel fromt he input request.
  const url = req.body.text;
  const channel_id = req.body.channel_id;

  // check if the input url is valid
  if (!url || !URL_REGEX.test(url)) {
    return res.json({ "replace_original": "true", "text": "Error: The url is invalid. Make sure you also added the http and https prefix" })
  }

  // check if a channel is given
  if(!channel_id) {
    return res.json({ "replace_original": "true", "text": "Error: Channel Id is empty" })
  }

  // return success message that slack doesn't run in a timeout
  // slack automatically will cancel the operation with a timeout when there is no response within 3 seconds -> we will later send the full result with a slack post message
  res.json({
    "replace_original": "true",
    "text": "Thanks for your request,\n we'll process it and get back to you."
  })

    // send to PSI
  const api_res = await axios.get(`${process.env.PSI_URL}?url=${url}&key=${process.env.API_KEY}`)
  const { data } = api_res;

  // destruct object and get performance + metrics
  const lighthouse = data.lighthouseResult;
  const lighthouseMetrics = {
        first_contentful_paint: lighthouse.audits['first-contentful-paint'].displayValue,
        speed_index: lighthouse.audits['speed-index'].displayValue,
        first_meaningful_paint: lighthouse.audits['largest-contentful-paint'].displayValue,
                time_to_interactive: lighthouse.audits['interactive'].displayValue,
       total_blocking_time: lighthouse.audits['total-blocking-time'].displayValue,
        cumulative_layout_shift: lighthouse.audits['cumulative-layout-shift'].displayValue
      };
  const performance = Math.trunc((parseFloat(lighthouse.categories.performance.score))*100)
  const response_data = {performance, ...lighthouseMetrics };

  // stringify object and adjust the styling with MARKDOWN
  const response_text = "#PSI for:" + url + "\n```\n" + JSON.stringify(response_data).replaceAll(',', ',\n') + "```"

    // send message to channel
  await web.chat.postMessage({
      channel: channel_id,
      text: response_text,
    });
  } catch(e) {
     return res.json({ "replace_original": "true", "text": `Error: ${e.message}` })
  }  
})

// welcome message
app.get('/', (req, res) => {
  res.send("Welcome to the slack pageSpeedReporter backend.")
})

app.listen(PORT, console.log('Server started on port ' + PORT));