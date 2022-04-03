var APIKey = '9ee21022229bd5d692c985f06baf6a14';
var city = 'Portland';
var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey;

fetch(weatherUrl)
    .then(function (response) {
    return response.json()
    })
    .then(function (data) {
        console.log(data);
        console.log(data.clouds);
    });

console.log(data.clouds);