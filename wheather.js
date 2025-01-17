const apiKey = "accf1e642046be91d5a06ffdcf089576"; // Replace with your OpenWeatherMap API Key
const weatherInfo = document.getElementById("weather-info");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const cityInput = document.getElementById("city-input");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherByCity(city);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      (error) => {
        alert("Unable to retrieve your location. Make sure location services are enabled.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

async function getWeatherByCity(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    updateWeatherCard(data);
  } catch (error) {
    alert(error.message);
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    if (!response.ok) throw new Error("Weather data not found");

    const data = await response.json();
    updateWeatherCard(data);
  } catch (error) {
    alert(error.message);
  }
}

function updateWeatherCard(data) {
  const { name, main, weather, wind } = data;
  const icon = getWeatherIcon(weather[0].main);

  weatherInfo.querySelector(".weather-icon").textContent = icon;
  weatherInfo.querySelector("h1").textContent = `${main.temp}°C`;
  weatherInfo.querySelector("p").textContent = name;
  weatherInfo.querySelectorAll(".detail p")[0].textContent = `${main.humidity}%`;
  weatherInfo.querySelectorAll(".detail p")[1].textContent = `${wind.speed} m/s`;

  weatherInfo.style.display = "block";
}

function getWeatherIcon(condition) {
  switch (condition.toLowerCase()) {
    case "clear":
      return "☀️";
    case "clouds":
      return "☁️";
    case "rain":
      return "🌧️";
    case "snow":
      return "❄️";
    case "thunderstorm":
      return "⛈️";
    default:
      return "🌤️";
  }
}
