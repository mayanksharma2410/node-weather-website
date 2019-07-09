const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/7e7e923a4b1fba213bc44c7c81b5dbae/' + latitude + ',' + longitude + '?units=si'

    request({url, json: true}, (error, { body }) => {
        if(error){
            callback('Unable to connect with the internet', undefined)
        }else if(body.error){
            callback('Unable to find location', undefined)
        }else{
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' There is a ' + body.currently.precipProbability + '% chance of rain')
        }
    })
}

module.exports = forecast