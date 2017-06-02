const express = require('express');
const JTS = require('jts');
const request = require('request');

const xmlescape = require('xml-escape');

var app = express();
var engine = new JTS();

app.set('views', 'src/views');
app.engine('jts', engine.render);
app.use(express.static('dist'));

// Ensure that visitor IP addresses are not the reverse proxy to ensure we get
// the most accurate data before logging performance data to the API.
app.enable('trust proxy');

app.get('/:id.xml', (req, res) => {
  getPodcast(req.params.id).then(payload => {
    request.post({
      url: 'https://api.bethel.io/performance/track',
      body: {
        collection: 'podcast',
        podcast: payload.podcast._id,
        ministry: payload.ministry._id,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      },
      json: true,
    }, err => {
      if (err) console.error(err);
    });

    res.header('Content-Type', 'text/xml; charset=UTF-8');
    res.render('feed.jts', payload);
  }).catch(err => {
    res.status(404).send();
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log(`Server running on port ${this.address().port}.`)
});

function getPodcast(id) {
  let payload = {
    _s: xmlescape,
  };

  return new Promise((resolve, reject) => {
    Promise.all([
      api(`podcast/${id}`),
      api(`podcast/${id}/media?sort=-date`)
    ]).then(podcast => {
      payload.podcast = podcast[0].data;
      payload.podcastMedia = podcast[1].data;
      return api(`ministry/${payload.podcast.ministry}`);
    }).then(ministry => {
      payload.ministry = ministry.data;
      resolve(payload);
    }).catch(err => {
      reject(err);
    });
  });
}

function api(endpoint) {
  return new Promise((resolve, reject) => {
    request.get(`https://api.bethel.io/${endpoint}`, (err, response, body) => {
      if (err || response.statusCode !== 200) {
        console.error(`API request to /${endpoint} failed:`, err || response.statusCode);
        return reject(err || response.statusCode);
      }

      try {
        body = JSON.parse(body);
        resolve(body);
      } catch(err) {
        console.error(`Failed to parse response from /${endpoint}: `, err.message || err);
        reject(err.message || err);
      }
    })
  });
}
