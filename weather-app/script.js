// script.js

const apiKey = '1a36d4025ffc0f7aaf49e9db61a4d9ed'; // Replace with your OpenWeatherMap API key
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const unitToggle = document.getElementById('unitToggle');
const weatherInfo = document.getElementById('weatherInfo');

// Fetch weather by city name
async function fetchWeather(city, unit = 'metric') {
    try {
        const response = await fetch(`${baseUrl}?q=${city}&appid=${apiKey}&units=${unit}`);
        if (!response.ok) {
            throw new Error('City not found. Please try again.');
        }
        const data = await response.json();
        displayWeather(data, unit);
    } catch (error) {
        displayError(error.message);
    }
}

// Fetch weather by location
async function fetchWeatherByLocation(lat, lon, unit = 'metric') {
    try {
        const response = await fetch(`${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`);
        if (!response.ok) {
            throw new Error('Unable to fetch location weather.');
        }
        const data = await response.json();
        displayWeather(data, unit);
    } catch (error) {
        displayError(error.message);
    }
}

// Display weather information
function displayWeather(data, unit) {
    const { name, main, weather, wind } = data;
    const temperatureUnit = unit === 'metric' ? '°C' : '°F';

    weatherInfo.innerHTML = `
        <h2>Weather in ${name}</h2>
        <p><strong>Temperature:</strong> ${main.temp} ${temperatureUnit}</p>
        <p><strong>Feels Like:</strong> ${main.feels_like} ${temperatureUnit}</p>
        <p><strong>Weather:</strong> ${weather[0].description}</p>
        <p><strong>Humidity:</strong> ${main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}</p>
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
    `;
}

// Display error messages
function displayError(message) {
    weatherInfo.innerHTML = `<p style="color: red;">${message}</p>`;
}

// Event: Search for a city
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city, unitToggle.value);
    } else {
        displayError('Please enter a city name.');
    }
});

// Event: Fetch weather for current location
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByLocation(latitude, longitude, unitToggle.value);
            },
            () => {
                displayError('Unable to access your location. Please enable location services.');
            }
        );
    } else {
        displayError('Geolocation is not supported by your browser.');
    }
});
