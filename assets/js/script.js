// GLOBAL VARIABLES //
var APIKey = '9ee21022229bd5d692c985f06baf6a14';
var cityFormEl = $("#city-form");
var cityInputEl = $("#city")
var today = moment().format("L");
var submitBtn = $("#search-btn");

// DISPLAYING HEADER INFORMATION //
var displayHeader = function(data) {
    var location = $("#location");
    location.text(data.name + " " + today)

    getWeatherIcon(data.weather[0].icon);
}

var getWeatherIcon = function(iconCode) {
    var icon = $("#currentIcon");
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";

    icon.attr("src", iconUrl);
}

var displayWeather = function(data) {
    $("#forecast-container").empty();

    var iconCode = data.current.weather[0].icon;
    var temperature = $("#temp");
    var wind = $("#wind");
    var humidity = $("#humidity");
    var UVIndex = $("#uv-index");

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

        $("#forecast-container").append(blockEl);

    }
}

// FETCH API's //
var getCityWeather = function (city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                //Creates variables for long and lat values that are used to fetch meaningful data from the onecall API
                var longitude = data.coord.lon;
                var latitude = data.coord.lat;
                var cityName = data.name;

                saveResult(cityName);
                displayHeader(data)
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

// LOCAL STORAGE HANDLERS //
var saveResult = function(cityName) {
    //Create an if statment for Clear button. append if historyEl has no children

    var historyEl = $("#previous-searches");
    var newBtn = $("<div>");

    newBtn.text(cityName);
    newBtn.addClass("savedSearchBtn");
    historyEl.prepend(newBtn);

    var saveToLS = function() {
        saveValue = historyEl.children.length;
        localStorage.setItem("weather-app-city", cityName);
    };

    saveToLS();
}


// BUTTON LISTENERS //
cityFormEl.on("submit", function(event) {
    console.log(cityInputEl.val());
    event.preventDefault();
    
    if (!cityInputEl) {
        alert("You must enter a city into the search box.")
    } else {
        getCityWeather(cityInputEl.val());
    }
});

// getCityWeather("Atlanta");

var todayWrapper = document.querySelector(".today-wrapper");
console.log(todayWrapper.children.length);

console.log(document.getElementById("previous-searches").children.length);