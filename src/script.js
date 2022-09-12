function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let monthIndex = date.getMonth();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let dateIndex = date.getDate();
  let currentAMPM = hours >= 12 ? "PM" : "AM";
  
  return `${days[dayIndex]} ${hours}:${minutes} ${currentAMPM} <br/> ${months[monthIndex]} ${dateIndex}`;
}

function formatDay(timestamp){
  let date = new Date(timestamp * 1000);
  let day = date.getDay(); 
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];

}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast"); 
  
  let forecastHTML = `<div class = "row">`;
  forecast.forEach(function(forecastDay, index) {
    if (index < 6 ) {
    forecastHTML = 
    forecastHTML + 
    
    `<div class="col-2">
      <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
      
      <img src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt=""
      width="42"
      >
      <div class="weather-forecast-temp">
        <span class="weather-forecast-temp-max">${Math.round(forecastDay.temp.max)}º</span>
        <span class="weather-forecast-temp-min">${Math.round(forecastDay.temp.min)}º</span>
      </div>
    </div>
  `;
    }
    
  });
  forecastHTML =forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
 
}

function getForecast(coordinates) {
  let apiKey = "f0893f6d8d3fd5fce22940c2e9293be0"
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  
  axios.get(apiUrl).then(displayForecast);
}

function displayTemp (response) {
  let dateElement = document.querySelector("#date-time");
  let iconElement = document.querySelector("#emoji-icon");
  console.log(response.data)
  document.querySelector("#city-element").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#feels-like").innerHTML = Math.round(response.data.main.feels_like);
  document.querySelector("#humidity").innerHTML = Math.round(response.data.main.humidity);
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
  document.querySelector("#description").innerHTML = response.data.weather[0].main
  
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute( "src",`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png` )
  iconElement.setAttribute( "alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchLocation(position) {
  let apiKey = "f0893f6d8d3fd5fce22940c2e9293be0";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let units = "imperial";
  let apiUrl = `${apiEndpoint}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemp)
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation)
}

function searchCity(city) {
  let apiKey = "f0893f6d8d3fd5fce22940c2e9293be0";
  let units = "imperial";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemp)
}

function submitCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = 77;
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = 19;
}


let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", submitCity);


let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", convertToCelsius);

let currentLoaction = document.querySelector("#location-button")
currentLoaction.addEventListener("click", getCurrentLocation)

searchCity("Cleveland")