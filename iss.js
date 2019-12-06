const request = require('request');

const fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) { // handle error
      return callback(error, null);
    }
    if (response.statusCode !== 200) { // handle possible response error
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request('https://ipvigilante.com/8.8.8.8', (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching coordinates: ${body}`), null);
    }
    const lat = JSON.parse(body).data['latitude'];
    const lng = JSON.parse(body).data['longitude'];
    const obj = { lat, lng }
    callback(null, obj);
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, function (error, response, body) {
  if (error) {
    return callback(error, null);
  }
  if (response.statusCode !== 200){
    callback(Error(`Status Code ${response.statusCode} when looking for the upcoming ISS passes: ${body}`), null);
  }
  const passes = JSON.parse(body).response;
    callback(null, passes);
  })
}

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes
};
