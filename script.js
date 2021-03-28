const userLocationInput = document.querySelector('#userLocationInput')
const getWeatherButton = document.querySelector('#getWeatherButton')
const weatherInformation = document.querySelector('#weatherContainer')
getWeatherButton.addEventListener('click', displayWeatherData)

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
    cityName: getCityName(weatherData),
    weatherDesc: getWeatherDesc(weatherData),
    temperatureKelvin: getTemperatureKelvin(weatherData),
    cloudinessPercentage: getCloudinessPercentage(weatherData),
    humidityPercentage: getHumidityPercentage(weatherData),
    windSpeed: getWindSpeed(weatherData),
    rainVolumeLastHour: getRainVolumeOneHour(weatherData),
    snowVolumeLastHour: getSnowVolumeOneHour(weatherData),
  }
  return appWeatherObject
}

function displayWeatherData() {
  const locationInput = userLocationInput.value
  // getWeatherData(locationInput).then((data) => console.log(data))
  getWeatherData(locationInput).then((data) => {
    for (const property in data) {
      if (data[property] || data[property] === 0) {
        const p = document.createElement('p')
        p.innerHTML = `${property}: ${data[property]}`
        weatherInformation.appendChild(p)
      }
    }
    // let markup = `
    // <p>City: ${data.cityName}</p>`

    // weatherInformation.innerHTML = markup
  })
}

function getCityName(weatherObject) {
  return weatherObject.name
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
  // First check if wind is given then return appropriately
  return weatherObject.wind ? weatherObject.wind.speed : false
}

function getRainVolumeOneHour(weatherObject) {
  // First check if rain is given then return appropriately
  return weatherObject.rain ? weatherObject.rain['1h'] : false
}

function getSnowVolumeOneHour(weatherObject) {
  // First check if snow is given then return appropriately
  return weatherObject.snow ? weatherObject.snow['1h'] : false
}
