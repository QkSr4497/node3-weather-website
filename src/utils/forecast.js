const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/0ed06272515068e887c994e1ff14c60a/'+ latitude +','+ longitude +'?units=si';
    request({url, json: true}, (error, {body}) => {    // using new Object destructuring syntax and Object property shorthand
        if (error) {    // if error is not null or not undefined =>> lower level os problem like a complete lack of network connection
            callback('Unable to connect to weather service!', undefined);
        }
        else if (body.error) { // something wrong with the input like the coordinates
            callback('Unable to find location!', undefined);
        }
        else {
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degrees out. There is a ' + body.currently.precipProbability + '% chance of rain.');
        }
    });
};;

module.exports = forecast;