const apiKey = 'dce0230841ba4dd7b5723747240711';  // Use your actual API key from WeatherAPI

document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        showError('Please enter a city name.');
    }
});

function fetchWeather(city) {
    fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`)
        .then(response => {
            if (!response.ok) throw new Error('City not found');
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            fetchForecast(data.location.lat, data.location.lon);  // Use latitude and longitude from response
        })
        .catch(error => showError(error.message));
}

function fetchForecast(lat, lon) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no`)
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Inspect the entire response
            displayForecast(data.forecast.forecastday); // Adjust this line based on the correct structure
        })
        .catch(error => showError(error.message));
}

function displayWeather(data) {
    document.getElementById('weatherInfo').classList.remove('d-none');
    document.getElementById('cityName').innerText = `${data.location.name}, ${data.location.country}`;
    document.getElementById('description').innerText = data.current.condition.text;
    document.getElementById('temperature').innerText = `${data.current.temp_c} °C`;
    document.getElementById('details').innerText = `Humidity: ${data.current.humidity}% | Wind Speed: ${data.current.wind_kph} km/h`;

    // Change background color based on weather condition
    setBackgroundColor(data.current.condition.text);
}

function displayForecast(forecastData) {
    const forecastCards = document.getElementById('forecastCards');
    forecastCards.innerHTML = '';  // Clear previous forecast

    // Ensure forecastData is an array before using forEach
    if (Array.isArray(forecastData)) {
        forecastData.forEach(day => {
            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <h5>${new Date(day.date).toLocaleDateString()}</h5>
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
                <p>${day.day.condition.text}</p>
                <h6>Day: ${day.day.avgtemp_c} °C</h6>
                <h6>Night: ${day.astro.mintemp_c} °C</h6>
            `;
            forecastCards.appendChild(card);
        });
    } else {
        console.error('Forecast data is not an array:', forecastData);
    }
}

function showError(message) {
    alert(message);  // You can also display it on the page instead of an alert if preferred
}

// Change the background color based on weather condition
function setBackgroundColor(condition) {
    let backgroundColor = '';
    switch (condition.toLowerCase()) {
        case 'sunny':
            backgroundColor = '#FFD700'; // Sunny yellow
            break;
        case 'cloudy':
            backgroundColor = '#B0C4DE'; // Cloudy gray-blue
            break;
        case 'rainy':
            backgroundColor = '#4682B4'; // Rainy blue
            break;
        case 'snowy':
            backgroundColor = '#F0F8FF'; // Snowy light blue
            break;
        default:
            backgroundColor = '#ADD8E6'; // Default light blue
            break;
    }

    document.body.style.backgroundColor = backgroundColor;
}
