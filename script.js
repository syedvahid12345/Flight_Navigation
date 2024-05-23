document.getElementById('city-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    console.log(`Fetching weather data for city: ${city}`);
    getWeatherData(city);
});

document.getElementById('select-button').addEventListener('click', function() {
    const selectedScenario = document.getElementById('scenario-select').value;
    console.log(`Selected scenario: ${selectedScenario}`);
    const mockWeatherData = generateMockWeatherData(selectedScenario);
    displayScenarios(mockWeatherData);
});

const API_KEY = 'aed9fea3dd2e8a0c77d7ff978f7cc4e4';
async function getWeatherData(city) {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Weather data:', data);  // Debugging log
        displayScenarios(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function displayScenarios(weatherData) {
    console.log('Displaying scenarios...');
    const scenarios = identifyScenarios(weatherData);
    const scenariosList = document.getElementById('scenarios');
    scenariosList.innerHTML = '';
    scenarios.forEach(scenario => {
        const li = document.createElement('li');
        li.textContent = scenario;
        scenariosList.appendChild(li);
    });

    const route = planRoute(weatherData);
    document.getElementById('route').textContent = route;
}

function identifyScenarios(weatherData) {
    console.log('Identifying scenarios...');
    const scenarios = [];
    if (weatherData.weather[0].main === 'Fog' || weatherData.weather[0].main === 'Snow' || weatherData.weather[0].main === 'Rain') {
        scenarios.push('Adverse weather conditions');
    }
    if (weatherData.wind.speed > 20) {
        scenarios.push('High wind speed');
    }
    console.log('Scenarios identified:', scenarios);
    return scenarios;
}

function planRoute(weatherData) {
    console.log('Planning route...');
    let route = `Optimal route for landing in ${weatherData.name}: `;

    if (weatherData.weather[0].main === 'Clear') {
        route += "Approach from the south to avoid any wind interference.";
    } else if (weatherData.weather[0].main === 'Fog') {
        route += "Use instrument landing system (ILS) and approach with caution.";
    } else if (weatherData.weather[0].main === 'Snow') {
        route += "Ensure runway is clear of snow, approach slowly and use anti-skid braking.";
    } else if (weatherData.weather[0].main === 'Rain') {
        route += "Approach at a lower speed to account for reduced friction on wet runway.";
    } else if (weatherData.weather[0].main === 'Clouds') {
        route += "Use standard approach pattern and be prepared for sudden turbulence.";
    }

    if (weatherData.wind.speed > 20) {
        route += " High wind speeds detected; consider diverting to an alternative airport.";
    }

    console.log('Route planned:', route);
    return route;
}

function generateMockWeatherData(scenario) {
    const mockData = {
        name: 'MockCity',
        weather: [{ main: scenario }],
        wind: { speed: scenario === 'HighWind' ? 25 : 10 } // Set high wind speed for HighWind scenario
    };
    return mockData;
}
