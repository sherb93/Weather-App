var APIKey = '9ee21022229bd5d692c985f06baf6a14';
var city = 'Portland';
var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey;
var test = document.getElementById("test");

fetch(weatherUrl)
    .then(function (response) {
    return response.json()
    })
    .then(function (data) {
        console.log(data);
        console.log(data.weather);
        test.textContent = data.weather[0].icon
    });
