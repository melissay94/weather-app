let weatherData, userCity, userDay, cityLat, cityLong;

const $city = $("#city");
const $temperature = $("#temperature");
const $feelsLike = $("#feelsLike");
const $weather = $("#weather");
const $byDay = $(".by-day");

const $input = $("#city-field");
const $daysCnt = $("#days");

$("form").on("submit", getLatLong);

function handleCitySearch() {

  userDay = $daysCnt.val();
  $byDay.html("");

  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&units=imperial&exclude=minutely,hourly&appid=${config.WEATHER_API_KEY}`
  }).then(
    data => {
      weatherData = data;
      update();
    },
    error => {
      console.log(error);
    }
  );
}

function getLatLong(event) {
  event.preventDefault();

  userCity = $input.val();

  $.ajax({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${userCity}&key=${config.GOOGLE_MAPS_API_KEY}`
  }).then(
    data => {
      cityLat = data.results[0].geometry.location.lat;
      cityLong = data.results[0].geometry.location.lng;

      handleCitySearch();
    },
    error => {
      console.log(error);
    }
  )
}

function parseWeather(weatherArr) {

  let weatherList = weatherArr.map(element => {
    return element.description;
  });

  return weatherList.join(", ");
}

function dayResults(day, index, dayName) {
  $byDay.append(`
    <div id=day-${index} class='day-result'>
      <h3>${dayName}</h3>
      <div>
        <h3>High Temperature:</h3>
        <p>${day.temp.max} °F</p>
      </div>
      <div>
        <h3>Low Temperature:</h3>
        <p>${day.temp.min} °F</p>
      </div>
      <div>
        <h3>Humidity:</h3>
        <p>${day.humidity} %</p>
      </div>
      <div>
        <h3>Wind Speed:</h3>
        <p>${day.wind_speed} mph</p>
      </div>
      <div>
        <h3>Weather:</h3>
        <p>${parseWeather(day.weather)}</p>
      </div>
    </div>
  `);
}

function update() {

  $city.html(userCity);
  $temperature.html(weatherData.current.temp + " °F");
  $feelsLike.html(weatherData.current.feels_like + " °F");
  $weather.html(parseWeather(weatherData.current.weather));

  console.log(userDay);

  for (let i = 0; i < parseInt(userDay); i++) {

    let dayName = '';
    switch(i) {
      case 0:
        dayName = "Today";
        break;
      case 1:
        dayName = "Tomorrow";
        break;
      default:
        dayName = `In ${i+1} days`
    }

    dayResults(weatherData.daily[i], i, dayName);
  }

  $input.val("");
}
