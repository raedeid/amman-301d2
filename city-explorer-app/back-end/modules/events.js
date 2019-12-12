'use strict';

const superagent = require('superagent');

module.exports = getEvents;

function getEvents(location) {
  // Note that this API doesn't return the right header, so Express cannot parse it into data.body
  // For this reason, we need to manually do a JSON.parse() on data.text
  const url = `http://api.eventful.com/json/events/search?location=${location}&date=Future&app_key=${process.env.EVENTFUL_API_KEY}`;
  return superagent.get(url)
    .then( data => parseEventsData( JSON.parse(data.text) ))
    .catch( err => console.error(err) );
}

function parseEventsData(data) {
  try {
    const events = data.events.event.map(eventData => {
      const event = new Event(eventData);
      return event;
    });
    return Promise.resolve(events);
  } catch(e) {
    return Promise.reject(e);
  }
}

function Event(event) {
  this.link = event.url;
  this.name = event.title;
  this.event_date = event.start_time;
  this.summary = event.description;
}
