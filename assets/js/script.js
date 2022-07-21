// GLOBAL VARIABLES //
var APIKey = '9ee21022229bd5d692c985f06baf6a14';
var cityFormEl = $("#city-form");
var cityInputEl = $("#city")
var today = moment().format("L");
var currentTime = moment().format("HH:mm a");
var submitBtn = $("#search-btn");
var historyEl = $("#previous-searches");

// DISPLAYING HEADER INFORMATION //
var displayHeader = function(data) {
    // local variables
    var location = $("#location");
    var location2 = $("#location2");

    var getWeatherIcon = function(iconCode) {
        var icon = $("#currentIcon");
        var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    
        icon.attr("src", iconUrl);
    }

    // displays current information to today's header & forecast
    location.html(`<small class="text-muted"></small>`);
    location.prepend(`${data.name} `);
    location.children("small").text(`as of ${currentTime}`);

    location2.text(`${data.name}`);

    getWeatherIcon(data.weather[0].icon);
}

var displayWeather = function(data) {
    $("#forecast-container").empty();

    var UV = data.current.uvi;

    var temperature = $("#temp");
    var wind = $("#wind");
    var humidity = $("#humidity");
    var UVScale = $("#uv-scale");

    temperature.text(`${Math.trunc(data.current.temp)}°`);
    wind.text(`Wind ${data.current.wind_speed} mph `);
    humidity.text(`RH ${data.current.humidity}%`);
    UVScale.text(`${UV}`);

    // sets color of UV index
    switch (true) {
        case UV < 3:
            UVScale.css("background", "#66b94d");
            break;
        case UV >= 3 && UV < 6:
            UVScale.css("background", "#fcbd1e");
            break;
        case UV >= 6 && UV < 8:
            UVScale.css("background", "#f66b34");
            break;
        case UV >= 8 && UV < 10:
            UVScale.css("background", "#ee154a");
            break;
        case UV >= 11:
            UVScale.css("background", "#7b439c");
            break;
        default:
            UVScale.css("background", "none");
    }

    for (var i = 0; i < 5; i++){
        // create HTML elements
        var blockEl = $("<div>")
        var borderEl = $("<div>")
        var headingEl = $("<h6>")
        var highEl = $("<p>")
        var lowEl = $("<p>")
        var humidityEl = $("<p>")

        // forecast icon code from the fetch request
        var forecastIconCode = data.daily[i].weather[0].icon;

        // fetches and appends forecast icon to forecast block
        var getForecastIcon = function(iconCode) {
            var iconEl = $("<img>");
            var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
        
            iconEl.attr("src", iconUrl);
            blockEl.append(iconEl);   
        }

        blockEl.addClass( ["forecast-day"] )
        borderEl.addClass( ["separator"])

        // adding and styling information for each forecast block
        headingEl.text(moment().add(i + 1, "day").format("ddd D"));
        highEl.text(`${Math.trunc(data.daily[i].temp.max)}°F`);
        lowEl.text(`${Math.trunc(data.daily[i].temp.min)}°`);
        humidityEl.text(`${data.daily[i].humidity}% RH`);

        // append all info to each forecast block
        blockEl.append(headingEl);
        blockEl.append(highEl);
        blockEl.append(lowEl);
        getForecastIcon(forecastIconCode);
        blockEl.append(humidityEl);

        $("#forecast-container").append(blockEl);
        if (i < 4) {
            $("#forecast-container").append(borderEl);
        }


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
                console.log(data);
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
    var historyElLength = historyEl.children().length;

    if (historyElLength >= 8) {
        historyEl.child

    }

    var newBtn = $("<button>");
    var randomNum = Math.floor(Math.random() * 100);

    newBtn.text(cityName);
    newBtn.addClass("savedSearchBtn");
    historyEl.prepend(newBtn);
    // GOAL HERE is to use the child nodes value to assign local storage keys 
    var saveToLS = function() {
        if (historyEl.children().length <= 8) {
            localStorage.setItem(`city${randomNum}`, cityName);
        }
    };

    saveToLS();
}


// BUTTON LISTENERS //
cityFormEl.on("submit", function(event) {
    event.preventDefault();
    
    if (!cityInputEl) {
        alert("You must enter a city into the search box.")
    } else {
        getCityWeather(cityInputEl.val());
    }
});

//Initialize page with Atlanta, GA
getCityWeather("Atlanta");

var todayWrapper = document.querySelector(".today-wrapper");