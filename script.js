const userLocationInput = document.querySelector('#user-location-input')
const getWeatherButton = document.querySelector('#get-weather-button')
const weatherInformation = document.querySelector('#weather-container')
const body = document.querySelector('body')
getWeatherButton.addEventListener('click', displayWeatherData)
userLocationInput.addEventListener('keyup', onEnterDisplayWeatherData)
body.classList.add('sunny')

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
    city: getCityName(weatherData),
    weather: getWeatherDesc(weatherData),
    temperature: getTemperatureKelvin(weatherData) + ' K',
    cloudiness: getCloudinessPercentage(weatherData) + ' %',
    humidity: getHumidityPercentage(weatherData) + ' %',
    wind: getWindSpeed(weatherData) + ' m/sec',
    rain: getRainVolumeOneHour(weatherData) + ' mm/hour',
    snow: getSnowVolumeOneHour(weatherData) + ' mm/hour',
  }
  return appWeatherObject
}

function displayWeatherData() {
  const locationInput = userLocationInput.value
  getWeatherData(locationInput).then((data) => {
    removeOldWeather()
    for (const property in data) {
      // Display weather properties only if available
      if (!data[property].includes('false')) {
        const p = document.createElement('p')
        p.innerHTML = `${makeFirstLetterUpperCase(property)}: ${data[property]}`
        p.classList.add('weather-info-para')
        weatherInformation.appendChild(p)
      }
    }
    displayWeatherIcons(data.weather)
  })
}

function removeOldWeather() {
  while (weatherInformation.firstChild) {
    weatherInformation.removeChild(weatherInformation.firstChild)
  }
}

// display appropriate icons in background
function displayWeatherIcons(weather) {
  iconClass = weather.toLowerCase()
  body.className = ''
  body.classList.add(iconClass)
}

function makeFirstLetterUpperCase(text) {
  return text[0].toUpperCase() + text.slice(1)
}

function onEnterDisplayWeatherData(e) {
  if (e.keyCode === 13) {
    displayWeatherData()
  }
}

function getCityName(weatherObject) {
  return weatherObject.name
}

function getWeatherDesc(weatherObject) {
  return weatherObject.weather[0].main
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
