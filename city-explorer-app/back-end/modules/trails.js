'use strict';

const superagent = require('superagent');

module.exports = getTrails;

function getTrails(lat,lon) {
  const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=200&key=${process.env.TRAIL_API_KEY}`;
  return superagent.get(url)
    .then( data => parseTrailsData(data.body) );
}

function parseTrailsData(data) {
  try {
    const trails = data.trails.map(trail => {
      return new Trail(trail);
    });
    return Promise.resolve(trails);
  } catch(e) {
    return Promise.reject(e);
  }
}

function Trail(trail) {
  this.tableName = 'trails';
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.star_votes = trail.starVotes;
  this.summary = trail.summary;
  this.trail_url = trail.url;
  this.conditions = trail.conditionDetails;
  this.condition_date = trail.conditionDate.slice(0, 10);
  this.condition_time = trail.conditionDate.slice(12);
  this.created_at = Date.now();
}
