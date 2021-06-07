let currentWeather = {}
const userLocationInput = document.querySelector('#user-location-input')
const getWeatherButton = document.querySelector('#get-weather-button')
const weatherContainer = document.querySelector('#weather-container')
const body = document.querySelector('body')
const errorMessage = document.querySelector('#error-message')
getWeatherButton.addEventListener('click', displayWeatherContainer)
userLocationInput.addEventListener('keyup', onEnterDisplayWeatherData)
body.classList.add('sunny')

window.addEventListener('load', () => {
  displayWeatherContainer()
})

async function displayWeatherContainer(startCity = 'stuttgart') {
  try {
    const locationInput = userLocationInput.value || startCity
    const weatherData = await getWeatherData(locationInput)
    clearErrorMessages()
    removeOldWeather()
    displayWeatherInformation(weatherData)
    createTemperatureSwitch()
    displayWeatherIcons(weatherData.weather)
  } catch (e) {
    errorMessage.innerHTML = 'Something went wrong. Try again.'
    console.log(e)
  }
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

async function getWeaterDataFromServer(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=24005874af3f6ec79ecc6fe8800f3104`,
    { mode: 'cors' }
  )
  return response.ok
    ? response.json()
    : response.status === 404
    ? // If error 404 no error is thrown normally
      Promise.reject('error 404')
    : Promise.reject('some other error: ' + response.status)
}

function removeOldWeather() {
  while (weatherContainer.firstChild) {
    weatherContainer.removeChild(weatherContainer.firstChild)
  }
}

function clearErrorMessages() {
  errorMessage.innerHTML = ''
}

function displayWeatherInformation(data) {
  for (const property in data) {
    // Display weather properties only if available
    if (!data[property].includes('false')) {
      const p = document.createElement('p')
      p.innerHTML = `${makeFirstLetterUpperCase(property)}: ${data[property]}`
      p.classList.add('weather-info-para')
      p.id = property
      weatherContainer.appendChild(p)
    }
  }
}

function createTemperatureSwitch() {
  const temperatureElement = weatherContainer.querySelector('#temperature')
  const celsiusButton = createTemperatureButton('celsius')
  const fahrenheitButton = createTemperatureButton('fahrenheit')

  styleActiveTemperatureButton(celsiusButton)
  temperatureElement.insertAdjacentElement('afterend', fahrenheitButton)
  temperatureElement.insertAdjacentElement('afterend', celsiusButton)
}

function createTemperatureButton(unit) {
  const temperatureButton = document.createElement('button')

  temperatureButton.innerHTML = unit[0].toUpperCase()
  temperatureButton.dataset.unit = unit
  temperatureButton.id = `${unit}-button`
  unit === 'celsius'
    ? temperatureButton.addEventListener('click', displayInCelsius)
    : temperatureButton.addEventListener('click', displayInFahrenheit)
  return temperatureButton
}

function styleActiveTemperatureButton(button) {
  button.classList.add('active-temperature-button')
}

function displayInCelsius() {
  this.previousSibling.innerHTML = 'Temperature: ' + currentWeather.temperature
  styleActiveTemperatureButton(this)
  this.nextSibling.classList.remove('active-temperature-button')
}

function displayInFahrenheit() {
  const tempInFahrenheit = parseInt(currentWeather.temperature) * 1.8 + 32
  this.previousSibling.previousSibling.innerHTML =
    'Temperature: ' + tempInFahrenheit
  styleActiveTemperatureButton(this)
  this.previousSibling.classList.remove('active-temperature-button')
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
    displayWeatherContainer()
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
