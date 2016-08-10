$(document).ready(function () {
    var temperature;

    getLocation().then(updateWeather);


    $("#owm-temperature-units").click(function () {
        var units = $("#owm-temperature-units").text();
        if (units === "C") {
            $("#owm-temperature").text(Math.round(celsiusToFarenheit()));
            $("#owm-temperature-units").text("F");
        } else {
            $("#owm-temperature").text(Math.round(temperature));
            $("#owm-temperature-units").text("C");
        }
    });

    function getLocation() {
        var deferred = $.Deferred();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                deferred.resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            }, function () {
                getLocationByUrl()
                    .then(function (data) {
                        var locArr = data.loc.split(",");
                        deferred.resolve({
                            lat: locArr[0],
                            lon: locArr[1]
                        });
                    });
            });
        } else {
            getLocationByUrl()
                .then(function (data) {
                    var locArr = data.loc.split(",");
                    deferred.resolve({
                        lat: locArr[0],
                        lon: locArr[1]
                    });
                });
        }
        return deferred.promise();
    }

    function getLocationByUrl() {
        return $.getJSON("http://ipinfo.io/json");
    }

    function updateWeather(loc) {
        var owmUrl = "http://api.openweathermap.org/data/2.5/weather?"
        var owmParam = {
            lat: loc.lat,
            lon: loc.lon,
            units: "metric",
            appid: "7b8839fd707055374f8273845bedf1d0"
        }
        owmUrl += $.param(owmParam);

        $.getJSON(owmUrl)
            .then(function (data) {
                temperature = data.main.temp;

                $("#owm-location").text(data.name + ", " + data.sys.country);
                $("#owm-temperature").text(Math.round(temperature));
                $("#owm-weather-main").text(data.weather[0].main);
                $("#owm-weather-desc").text(data.weather[0].description);
                $("#owm-weather-icon").attr('class', getIcon(data));
            });
    }

    function celsiusToFarenheit() {
        return temperature * (9 / 5) + 32;
    }

    function getIcon(data) {
        var classIcon = "owf owf-5x owf-";

        var dateNow = Math.round(Date.now() / 1000);
        var dateSunrise = data.sys.sunrise;
        var dateSunset = data.sys.sunset;

        var iconSuffix;
        if (dateNow > dateSunrise && dateNow < dateSunset) {
            iconSuffix = "-d";
        } else {
            iconSuffix = "-n";
        }

        classIcon += "owf owf-5x owf-" + data.weather[0].id + iconSuffix;
        return classIcon;
    }

});