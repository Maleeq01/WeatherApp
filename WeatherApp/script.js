// The actual API key
const apiKey = "b456677c964bf24b9932113b9ac335a9";

// Function to fetch weather data when the button is clicked
async function getWeather() {
  const cityInput = document.getElementById("city-input");
  const city = cityInput.value;

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  try {
    const currentWeather = await fetchWeatherData(city, "weather");
    const forecast = await fetchWeatherData(city, "forecast");

    displayCurrentWeather(currentWeather);
    displayForecast(forecast);
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while fetching the weather data");
  }
}

// Function to fetch weather data from the API
async function fetchWeatherData(city, type) {
  const url = `http://api.openweathermap.org/data/2.5/${type}?q=${city}&appid=${"b456677c964bf24b9932113b9ac335a9"}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Weather data not found");
  }
  return await response.json();
}

// Function to display current weather
function displayCurrentWeather(data) {
  const weatherInfo = document.getElementById("weather-info");
  const temperature = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);

  weatherInfo.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>${data.weather[0].description}</p>
                <p><i class="fas fa-temperature-high"></i> Temperature: ${temperature}°C</p>
                <p><i class="fas fa-thermometer-half"></i> Feels like: ${feelsLike}°C</p>
                <p><i class="fas fa-tint"></i> Humidity: ${data.main.humidity}%</p>
                <p><i class="fas fa-wind"></i> Wind: ${data.wind.speed} m/s</p>
            `;
}

// Function to display 5-day forecast
function displayForecast(data) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  // Filter data to get one forecast per day at noon
  const dailyData = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.slice(0, 5).forEach((day) => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString("en-US", {
      weekday: "short",
    });
    const temp = Math.round(day.main.temp);
    const icon = day.weather[0].icon;

    const forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-item");
    forecastItem.innerHTML = `
                    <h3>${dayName}</h3>
                    <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather icon">
                    <p>${temp}°C</p>
                `;
    forecastDiv.appendChild(forecastItem);
  });
}

// Optional: Function to get weather for user's current location
function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoords(lat, lon);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// Function to fetch weather data by coordinates
async function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${"b456677c964bf24b9932113b9ac335a9"}&units=metric`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayCurrentWeather(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Uncomment the line below to get weather for the user's location on page load
// getLocationWeather();
