const request = require('request');

const geocode = (address, callback) => {    // callback is the function that we will call once we get the latitude and longtitude
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ address +'.json?access_token=pk.eyJ1IjoicWtzcjU1OTciLCJhIjoiY2p0NnlrejJkMG1nbzQ0cG12eGJwc2t0diJ9.VhK2QoJjNOr4mU97YFuPtA&limit=1';
    request({url, json: true}, (error, {body}) => {   // using new Object destructuring syntax and Object property shorthand
        if (error) {
            callback('Unable to connect to loacation services!', undefined);
        }
        else if (body.features.length === 0) {
            callback('Unable to find location. Try another search.', undefined)
        }
        else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longtitude: body.features[0].center[0],
                location: body.features[0].place_name
            });
        }
    });

};

module.exports = geocode;