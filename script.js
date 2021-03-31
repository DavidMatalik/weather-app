let currentWeather = {}
const userLocationInput = document.querySelector('#user-location-input')
const getWeatherButton = document.querySelector('#get-weather-button')
const weatherContainer = document.querySelector('#weather-container')
const body = document.querySelector('body')
const errorMessage = document.querySelector('#error-message')
getWeatherButton.addEventListener('click', displayWeatherData)
userLocationInput.addEventListener('keyup', onEnterDisplayWeatherData)
body.classList.add('sunny')

//Implement some errorhandling if e.g. city isn't found or server isn't available
async function getWeaterDataFromServer(city) {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=24005874af3f6ec79ecc6fe8800f3104`,
    { mode: 'cors' }
  )
  //Put this error related stuff below in extra function?
  return response.ok
    ? response.json()
    : response.status === 404
    ? Promise.reject('error 404')
    : Promise.reject('some other error: ' + response.status)
}

async function getWeatherData(cityInput) {
  const weatherData = await getWeaterDataFromServer(cityInput)
  // return object with all the available/needed weather data for app
  currentWeather = {
    city: getCityName(weatherData),
    weather: getWeatherDesc(weatherData),
    temperature: getTemperatureCelsius(weatherData) + ' ',
    cloudiness: getCloudinessPercentage(weatherData) + ' %',
    humidity: getHumidityPercentage(weatherData) + ' %',
    wind: getWindSpeed(weatherData) + ' m/sec',
    rain: getRainVolumeOneHour(weatherData) + ' mm/hour',
    snow: getSnowVolumeOneHour(weatherData) + ' mm/hour',
  }
  return currentWeather
}

// Many lines of code - Separate in helper funcs? Change to async/await?
function displayWeatherData() {
  const locationInput = userLocationInput.value
  getWeatherData(locationInput)
    .then((data) => {
      errorMessage.innerHTML = ''
      removeOldWeather()
      for (const property in data) {
        // Display weather properties only if available
        if (!data[property].includes('false')) {
          const p = document.createElement('p')
          p.innerHTML = `${makeFirstLetterUpperCase(property)}: ${
            data[property]
          }`
          p.classList.add('weather-info-para')
          p.id = property
          weatherContainer.appendChild(p)
        }
      }
      // Das Zeug hier unten in extra Funktion(en)
      const temperatureElement = weatherContainer.querySelector('#temperature')
      const celsiusButton = document.createElement('button')
      const fahrenheitButton = document.createElement('button')
      celsiusButton.innerHTML = 'C'
      celsiusButton.addEventListener('click', displayInCelsius)
      celsiusButton.dataset.unit = 'celsius'
      celsiusButton.id = 'celsius-button'
      celsiusButton.classList.add('active-temperature-button')
      fahrenheitButton.innerHTML = 'F'
      fahrenheitButton.addEventListener('click', displayInFahrenheit)
      fahrenheitButton.dataset.unit = 'fahrenheit'
      fahrenheitButton.id = 'fahrenheit-button'
      temperatureElement.insertAdjacentElement('afterend', fahrenheitButton)
      temperatureElement.insertAdjacentElement('afterend', celsiusButton)
      displayWeatherIcons(data.weather)
    })
    .catch((e) => {
      errorMessage.innerHTML = 'Something went wrong. Try again.'
    })
}

function displayInCelsius() {
  this.previousSibling.innerHTML = 'Temperature: ' + currentWeather.temperature
  this.classList.add('active-temperature-button')
  this.nextSibling.classList.remove('active-temperature-button')
}

function displayInFahrenheit() {
  const tempInFahrenheit = parseInt(currentWeather.temperature) * 1.8 + 32
  this.previousSibling.previousSibling.innerHTML =
    'Temperature: ' + tempInFahrenheit
  this.classList.add('active-temperature-button')
  this.previousSibling.classList.remove('active-temperature-button')
}

function removeOldWeather() {
  while (weatherContainer.firstChild) {
    weatherContainer.removeChild(weatherContainer.firstChild)
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

function getTemperatureCelsius(weatherObject) {
  const tempKelvin = weatherObject.main.temp
  const tempCelsius = Math.round(tempKelvin - 273)
  return tempCelsius
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
