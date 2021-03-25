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
  const weatherDesc = getWeatherDesc(weatherData)
  console.log(weatherDesc)
}

getWeatherData('paris')

function getWeatherDesc(weatherObject) {
  return weatherObject.weather[0].description
}

function getTemperatureKelvin(weatherObject) {
  // data.main.temp
}

function getCloudinessPercentage(weatherObject) {
  // data.clouds.all
}

function getHumidityPercentage(weatherObject) {
  // data.main.humidity
}

function getWindSpeed(weatherObject) {
  // return false or 0 if there is no such parameter
}

function getRainVolume(weatherObject) {
  // return false or 0 if there is no such parameter
}

function getSnowVolume(weatherObject) {
  // return false or 0 if there is no such parameter
}
