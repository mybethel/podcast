const express = require('express');
const JTS = require('jts');
const fetch = require('node-fetch');

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
    fetch('https://api.bethel.io/performance/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BethelPodcast/0.1 (+https://podcast.bethel.io)',
      },
      body: JSON.stringify({
        collection: 'podcast',
        podcast: payload.podcast._id,
        ministry: payload.ministry._id,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      }),
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
  return fetch(`https://api.bethel.io/${endpoint}`, {
    headers: {
      'User-Agent': 'BethelPodcast/0.1 (+https://podcast.bethel.io)',
    },
  }).then(res => res.json());
}
