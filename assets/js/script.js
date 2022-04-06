var APIKey = '9ee21022229bd5d692c985f06baf6a14';
var cityFormEl = $("#city-form");
var cityInputEl = $("#city")
var today = moment().format("L");


// var formSubmit = function() {
//     var city = cityInputEl.val();

//     console.log(city);

//     if (city) {
//         getCityWeather(city);
//     } else {
//         alert("Please enter a valid US city");
//     }
// };

var getWeatherIcon = function(iconCode) {
    var icon = $("#currentIcon");
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

    icon.attr("src", iconUrl);
}

//FETCHES LONGITUDE AND LATITUDE FROM CITY
var getCityWeather = function (city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                //Creates variables for long and lat values that are used to fetch meaningful data from the onecall API
                var longitude = data.coord.lon;
                var latitude = data.coord.lat;

                // This is the function for onecall API
                runOneCallWeather(latitude, longitude);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function (error) {
        alert("Unable to connect to OpenWeather");
    })
};

var runOneCallWeather = function(latitude, longitude) {

    fetch(`https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${latitude}&lon=${longitude}&appid=${APIKey}`).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displayWeather(data);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function (error) {
        alert("Unable to connect to OpenWeather");
    })
}

var displayWeather = function(data) {
    var location = $("#location");
    var iconCode = data.current.weather[0].icon;
    var temperature = $("#temp");
    var wind = $("#wind");
    var humidity = $("#humidity");
    var UVIndex = $("#uv-index");

    location.text(`${today}`)
    getWeatherIcon(iconCode)
    temperature.text(`Temp: ${data.current.temp}°F`);
    wind.text(`Wind: ${data.current.wind_speed} MPH`);
    humidity.text(`Humidity: ${data.current.humidity} %`);
    UVIndex.text(`UV Index: ${data.current.uvi}`);

    for (var i = 0; i < 5; i++){
        var blockEl = $("<div>")
        var headingEl = $("<h6>")
        var tempEl = $("<p>")
        var windEl = $("<p>")
        var humidityEl = $("<p>")
        var forecastIconCode = data.daily[i].weather[0].icon;

        var getForecastIcon = function(iconCode) {
            var iconEl = $("<img>");
            var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
        
            iconEl.attr("src", iconUrl);
            blockEl.append(iconEl);   
        }

        blockEl.addClass( ["bg-info", "text-white", "p-1"] )

        headingEl.text(moment().add(i + 1, "day").format("L"));
        tempEl.text(`Temp: ${data.daily[i].temp.day}°F`);
        windEl.text(`Wind: ${data.daily[i].wind_speed} MPH`);
        humidityEl.text(`Humidity: ${data.daily[i].humidity} %`);

        blockEl.append(headingEl);
        getForecastIcon(forecastIconCode);
        blockEl.append(tempEl);
        blockEl.append(windEl);
        blockEl.append(humidityEl);

        $("#flex-container").append(blockEl);

    }
}

getCityWeather("Atlanta");

// cityFormEl.on('submit', formSubmit);