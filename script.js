fetch(
  'http://api.openweathermap.org/data/2.5/weather?q=moscow&appid=24005874af3f6ec79ecc6fe8800f3104',
  { mode: 'cors' }
)
  .then(function (response) {
    return response.json()
  })
  .then(function (data) {
    console.log(data.main.humidity)
  })

function getWeatherDesc(city) {
  // data.weather.?
}

function getTemperatureKelvin(city) {
  // data.main.temp
}

function getCloudinessPercentage(city) {
  // data.clouds.all
}

function getHumidityPercentage(city) {
  // data.main.humidity
}

function getWindSpeed(city) {
  // return false or 0 if there is no such parameter
}

function getRainVolume(city) {
  // return false or 0 if there is no such parameter
}

function getSnowVolume(city) {
  // return false or 0 if there is no such parameter
}
