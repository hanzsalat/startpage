const WMO_CODES = {
    0: "clear sky",
    1: "mainly clear",
    2: "partly cloudy",
    3: "overcast",
    45: "fog",
    48: "depositing rime fog",
    51: "light drizzle",
    53: "moderate drizzle",
    55: "dense drizzle",
    56: "light freezing drizzle",
    57: "dense freezing drizzle",
    61: "slight rain",
    63: "moderate rain",
    65: "heavy rain",
    66: "light freezing rain",
    67: "heavy freezing rain",
    71: "light snow fall",
    73: "moderate snow fall",
    75: "heavy snow fall",
    77: "snow grains",
    80: "slight rain shower",
    81: "moderate rain shower",
    82: "violent rain shower",
    85: "slight snow shower",
    86: "heavy snow shower",
    95: "slight or moderate thunderstorm",
    96: "thunderstorm with slight hail",
    99: "thunderstorm with heavy hail",
};

const WMO_ICONS = {
    0: { 0: "", 1: "" },
    1: { 0: "", 1: "" },
    2: { 0: "", 1: "" },
    3: { 0: "", 1: "" },
    45: { 0: "", 1: "" },
    48: { 0: "", 1: "" },
    51: { 0: "", 1: "" },
    53: { 0: "", 1: "" },
    55: { 0: "", 1: "" },
    56: { 0: "", 1: "" },
    57: { 0: "", 1: "" },
    61: { 0: "", 1: "" },
    63: { 0: "", 1: "" },
    65: { 0: "", 1: "" },
    66: { 0: "", 1: "" },
    67: { 0: "", 1: "" },
    71: { 0: "", 1: "" },
    73: { 0: "", 1: "" },
    75: { 0: "", 1: "" },
    77: { 0: "", 1: "" },
    80: { 0: "", 1: "" },
    81: { 0: "", 1: "" },
    82: { 0: "", 1: "" },
    85: { 0: "", 1: "" },
    86: { 0: "", 1: "" },
    95: { 0: "", 1: "" },
    96: { 0: "", 1: "" },
    99: { 0: "", 1: "" },
};

function convert24to12(time) {
    var hours = time.split(":")[0];
    var minutes = time.split(":")[1];
    var part = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    hours = hours ? hours : 12;

    return hours + ":" + minutes + " " + part;
}

async function fetchWeather(lat, lon, element) {
    try {
        const timezone = Intl.DateTimeFormat()
            .resolvedOptions()
            .timeZone.replace("/", "%2F");
        const current =
            "temperature_2m," +
            "relative_humidity_2m," +
            "apparent_temperature," +
            "is_day," +
            "rain," +
            "showers," +
            "snowfall," +
            "weather_code," +
            "cloud_cover," +
            "wind_speed_10m," +
            "wind_direction_10m,";
        const daily =
            "weather_code," +
            "temperature_2m_max," +
            "temperature_2m_min," +
            "apparent_temperature_max," +
            "apparent_temperature_min," +
            "sunrise," +
            "sunset,";

        const r = await fetch(
            "https://api.open-meteo.com/v1/forecast?" +
                "latitude=" +
                lat +
                "&longitude=" +
                lon +
                "&current=" +
                current +
                "&daily=" +
                daily +
                "&timezone=" +
                timezone,
        );

        const d = await r.json();

        weatherDiscription = WMO_CODES[d.current.weather_code];
        weatherIcon = WMO_ICONS[d.current.weather_code][d.current.is_day];
        weatherText = `${weatherIcon} ${weatherDiscription}`;

        if (d.current.rain > 0) {
            downfall = d.current.rain + d.current_units.rain;
            downfallText = `${downfall} of rain`;
        } else if (d.current.showers > 0) {
            downfall = d.current.showers + d.current_units.showers;
            downfallText = `${downfall} of showers`;
        } else if (d.current.snow > 0) {
            downfall = d.current.snow + d.current_units.snow;
            downfallText = `${downfall} of snow`;
        } else {
            downfall = "N/A";
            downfallText = `no downfall`;
        }

        humidity =
            d.current.relative_humidity_2m +
            d.current_units.relative_humidity_2m;
        humidityText = `a humidity of ${humidity}`;
        // wind
        wind = d.current.wind_speed_10m + d.current_units.wind_speed_10m;
        windText = `with a wind of ${wind}`;
        // temperature
        temperature = d.current.temperature_2m;
        apparent_temperature = d.current.apparent_temperature;
        temprature_unit = d.current_units.apparent_temperature;
        temperatureText = `(${temperature}/${apparent_temperature})${temprature_unit}`;
        // sunset/rise
        sunset = convert24to12(d.daily.sunset[0].split("T")[1]);
        sunrise = convert24to12(d.daily.sunrise[0].split("T")[1]);
        sunText = `the sun is rising at ${sunrise} and setting at ${sunset}`;
        // push weatherInfo to element
        const weatherInfo = new Array(
            weatherText,
            temperatureText,
            windText,
            humidityText,
            downfallText,
            sunText,
        );
        element.innerHTML = `${weatherInfo.join("<br>")}`;
    } catch (e) {
        element.textContent = "look out the window dawg :)";
        console.log(e);
    }
}

// only needed https://open-meteo.com/en/docs#
// TODO: cloud coverage ?
document.addEventListener("DOMContentLoaded", () => {
    const weatherElement = document.querySelector("#weather");
    fetchWeather(52.3772, 13.797, weatherElement);
    // call limit per day so 8460ms is the lowset call freq
    setInterval(() => fetchWeather(52.3772, 13.797, weatherElement), 60000);
});
