//Implement some errorhandling if e.g. city isn't found or server isn't available
async function getWeaterDataFromServer(city) {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=24005874af3f6ec79ecc6fe8800f3104`,
    { mode: 'cors' }
  )
  return response.json()
}

async function getWeatherData(cityInput) {
  const weatherData = await getWeaterDataFromServer(cityInput)
  // return object with all the available/needed weather data for app
  const appWeatherObject = {
    weatherDesc: getWeatherDesc(weatherData),
    temperatureKelvin: getTemperatureKelvin(weatherData),
    cloudinessPercentage: getCloudinessPercentage(weatherData),
    humidityPercentage: getHumidityPercentage(weatherData),
    // Implement error handling for the 3 below
    // windspeed: getWindSpeed(weatherData),
    // rainVolumeLastHour: getRainVolumeOneHour(weatherData),
    // snowVolumeLastHour: getSnowVolumeOneHour(weatherData),
  }
  return appWeatherObject
}

function getWeatherDesc(weatherObject) {
  return weatherObject.weather[0].description
}

function getTemperatureKelvin(weatherObject) {
  return weatherObject.main.temp
}

function getCloudinessPercentage(weatherObject) {
  return weatherObject.clouds.all
}

function getHumidityPercentage(weatherObject) {
  return weatherObject.main.humidity
}

function getWindSpeed(weatherObject) {
  return weatherObject.wind.speed
  // return false or 0 if there is no such parameter
}

function getRainVolumeOneHour(weatherObject) {
  return weatherObject.rain['1h']
  // return false or 0 if there is no such parameter
}

function getSnowVolumeOneHour(weatherObject) {
  return weatherObject.wind['1h']
  // return false or 0 if there is no such parameter
}
