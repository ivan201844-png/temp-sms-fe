// Main app.js for countries listing page (index.html)

document.addEventListener('DOMContentLoaded', function() {
    initCountriesPage();
});

async function initCountriesPage() {
    const grid = document.getElementById('countries-grid');
    if (!grid) return;

    // Show loading state
    grid.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading countries...</p>
        </div>
    `;

    try {
        // Fetch numbers from API to get accurate counts
        const numbers = await fetchAllNumbers();
        console.log('Fetched numbers:', numbers);

        if (!numbers || numbers.length === 0) {
            console.warn('No numbers returned from API');
            grid.innerHTML = `
                <div class="no-messages">
                    <div class="icon">📱</div>
                    <p>No phone numbers available at the moment. Please try again later.</p>
                </div>
            `;
            return;
        }

        // Calculate counts per country from API data
        const countryCounts = {};
        numbers.forEach(num => {
            const country = getCountryByApiId(num.countryId);
            console.log('Number countryId:', num.countryId, 'Mapped to:', country);
            if (country) {
                countryCounts[country.id] = (countryCounts[country.id] || 0) + 1;
            }
        });

        console.log('Country counts:', countryCounts);

        // Filter countries to only show those with numbers
        const countriesWithNumbers = COUNTRIES.filter(country => countryCounts[country.id] > 0);

        console.log('Countries with numbers:', countriesWithNumbers);

        if (countriesWithNumbers.length === 0) {
            grid.innerHTML = `
                <div class="no-messages">
                    <div class="icon">📱</div>
                    <p>No phone numbers available at the moment. Please try again later.</p>
                </div>
            `;
            return;
        }

        renderCountries(countriesWithNumbers, countryCounts);
    } catch (error) {
        console.error('Error loading countries:', error);
        grid.innerHTML = `
            <div class="no-messages">
                <div class="icon">⚠️</div>
                <p>Failed to load countries. Please refresh the page.</p>
            </div>
        `;
    }
}

function renderCountries(countries, counts) {
    const grid = document.getElementById('countries-grid');
    if (!grid) return;

    grid.innerHTML = countries.map(country => {
        const phoneCount = counts[country.id] || 0;

        return `
            <a href="numbers.html?country=${country.id}" class="country-card">
                <div class="country-flag">
                    <img src="img/flags/${country.id}.svg" alt="${country.name} flag" width="56" height="40" loading="lazy">
                </div>
                <div class="country-info">
                    <h3>${country.name}</h3>
                    <p class="phone-count">${phoneCount} number${phoneCount !== 1 ? 's' : ''} available</p>
                </div>
                <svg class="country-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </a>
        `;
    }).join('');
}
