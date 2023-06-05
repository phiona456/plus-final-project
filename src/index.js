function formatDate() {
  let currentDate = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[currentDate.getDay()];
  let hours = currentDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = currentDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let currentDateAndTime = document.querySelector("#date-and-time");
  currentDateAndTime.innerHTML = `Last updated: ${day} ${hours}:${minutes}`;
}
formatDate();

function cityName(event) {
  event.preventDefault();
  let apiKey = "c8a77112b2faf6684bb4b21a0aa778ae";
  let city = document.querySelector("#city-name").value;
  city = city.trim();
  search(city);
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeather);
  let key = "d46f1b703c43197t9d1457e4fbea3dco";
  let iconUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${key}`;
  axios.get(iconUrl).then(displayIcon);
}
function search(city) {
  if (city) {
    let apiKey = "c8a77112b2faf6684bb4b21a0aa778ae";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(displayWeather);
    let key = "d46f1b703c43197t9d1457e4fbea3dco";
    let iconUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${key}`;
    axios.get(iconUrl).then(displayIcon);
    let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${key}`;
    axios.get(forecastUrl).then(displayForecast);
  } else {
    alert("Please enter a city");
  }
}

function displayWeather(response) {
  let h1 = document.querySelector("h1");
  let humidity = document.querySelector("#humidity");
  let windspeedElement = document.querySelector("#windspeed");
  let windspeed = Math.round(response.data.wind.speed);
  let temperature = document.querySelector("#temperature");
  h1.innerHTML = response.data.name;
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  windspeedElement.innerHTML = `Windspeed: ${windspeed} Km/h`;
  celsiusTemperature = response.data.main.temp;
  temperature.innerHTML = Math.round(celsiusTemperature);
}

function showLiveLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "c8a77112b2faf6684bb4b21a0aa778ae";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeather);

  let key = "d46f1b703c43197t9d1457e4fbea3dco";
  let iconUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${key}`;

  axios.get(iconUrl).then(displayIcon);

  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${longitude}&lat=${latitude}&key=${key}`;
  axios.get(forecastUrl).then(displayForecast);
}

function displayIcon(response) {
  let description = document.querySelector("#description");
  let icon = document.querySelector("#icon");
  description.innerHTML = response.data.condition.description;
  icon.setAttribute(
    "src",
    `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  icon.setAttribute("alt", response.data.condition.icon);
}
function liveLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showLiveLocation);
}

function formattedDays(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days[day];
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
      <div class ="forecast-days">
      ${formattedDays(forecastDay.time)}
      </div>
        <img
          src="https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
            forecastDay.condition.icon
          }.png"
          width="50"
        />
        <div class ="forecast-temperatures"
        <span class ="forecast-temperature-max"> ${Math.round(
          forecastDay.temperature.maximum
        )}°  </span>
        
       <span class ="forecast-temperature-min"> ${Math.round(
         forecastDay.temperature.minimum
       )}°</span>
       </div>
      </div>
    
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let citySearch = document.querySelector("#city-search");
citySearch.addEventListener("submit", cityName);

let currentLocation = document.querySelector("#live-location");
currentLocation.addEventListener("click", liveLocation);

search("Tokyo");
