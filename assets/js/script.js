// GLOBAL VARIABLES //
var APIKey = '9ee21022229bd5d692c985f06baf6a14';
var cityFormEl = $("#city-form");
var cityInputEl = $("#city");
var stateAbr = "";
var submitBtn = $("#search-btn");
var historyEl = $("#previous-searches");

// DISPLAYING HEADER INFORMATION //
var displayHeader = function(data) {
    // local variables
    var location = $("#location");
    var location2 = $("#location2");
    var currentTime = moment().format("hh:mm a");

    var getWeatherIcon = function(iconCode) {
        var icon = $("#currentIcon");
        var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    
        icon.attr("src", iconUrl);
    }

    // displays current information to today's header & forecast
    location.html(`<small></small>`);
    location.children("small").text(`as of ${currentTime}`);

    if (stateAbr.length > 0) {
        location.prepend(`${data.name}, ${stateAbr} `);
        location2.text(`${data.name}, ${stateAbr}`);
    } else {
        location.prepend(`${data.name} `);
        location2.text(`${data.name}`);
    }

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
        case UV >= 8 && UV < 11:
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
        humidityEl.text(`RH ${data.daily[i].humidity}%`);

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
var getCityWeather = function (lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                //Creates variables for long and lat values that are used to fetch meaningful data from the onecall API
                var locationName = data.name;
                console.log(data);
                // saveResult(cityName);
                displayHeader(data)
                runOneCallWeather(lat, lon);
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

var geolocator = function(cityCode, stateCode) {

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=Athens,Georgia&limit=5&appid=${APIKey}`).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].state === stateCode) {
                        var lat = data[i].lat;
                        var lon = data[i].lon;
                        getCityWeather(lat, lon);
                    }
                }
                console.log("Geolocator:", data);
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


// // BUTTON LISTENERS //
cityFormEl.on("submit", function(event) {
    event.preventDefault();

    if (!cityInputEl.val().includes(",")) {
        return alert("Please use proper 'City, State' format.");
    }

    // array for matching user input for state
    var statesArray = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];


    [city, state] = cityInputEl.val().replace(/\s/g, "").split(",");
    
    if (state.length === 2) {
        state = state.toUpperCase();
        stateAbr = state;

        var isNotValid = true;

        for (let i = 0; i < statesArray.length; i++) {
            if (state === statesArray[i][1]) {
                state = statesArray[i][0];
                isNotValid = false;
                break;
            };
        };

        if (isNotValid) return alert("Please enter a valid US state abbreviation.")
    };

    geolocator(city, state);
});

//Initialize page with user's location or a default
var currentLocation = function(userLocation) {
    var lat = userLocation.coords.latitude;
    var lon = userLocation.coords.longitude;

    getCityWeather(lat, lon);
}

var defaultLocation = function() {
    getCityWeather(33.9568, -83.3794);
}

window.navigator.geolocation.getCurrentPosition(currentLocation, console.log);