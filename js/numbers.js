// Numbers listing page (numbers.html)

document.addEventListener('DOMContentLoaded', function() {
    initNumbersPage();
});

async function initNumbersPage() {
    const params = new URLSearchParams(window.location.search);
    const countryId = params.get('country');

    if (!countryId) {
        window.location.href = 'index.html';
        return;
    }

    const country = getCountryById(countryId);
    if (!country) {
        window.location.href = 'index.html';
        return;
    }

    // Update page content
    document.getElementById('country-name').textContent = country.name;
    document.getElementById('country-title').textContent = `${country.name} Phone Numbers`;
    document.getElementById('country-flag').innerHTML = `<img src="img/flags/${country.id}.svg" alt="${country.name} flag" width="72" height="52">`;
    document.title = `${country.name} Numbers - TemporarySMS`;

    // Show loading state
    const container = document.getElementById('numbers-list');
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading phone numbers...</p>
        </div>
    `;

    // Fetch and render phone numbers from API
    await renderPhoneNumbers(countryId, country);
}

async function renderPhoneNumbers(countryId, country) {
    const container = document.getElementById('numbers-list');

    try {
        // Fetch all numbers from API
        const allNumbers = await fetchAllNumbers();

        // Filter numbers for this country
        const countryNumbers = allNumbers.filter(num => num.countryId === country.apiId);

        if (countryNumbers.length === 0) {
            container.innerHTML = `
                <div class="no-messages">
                    <div class="icon">📱</div>
                    <p>No phone numbers available for ${country.name} at the moment.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = countryNumbers.map(number => {
            const messageCount = number.sms ? number.sms.length : 0;

            return `
                <a href="inbox.html?id=${number.id}" class="number-card">
                    <span class="number-phone">${formatPhoneNumber(number.phone)}</span>
                    <div class="number-meta">
                        <span class="message-badge">${messageCount} message${messageCount !== 1 ? 's' : ''}</span>
                    </div>
                </a>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading phone numbers:', error);
        container.innerHTML = `
            <div class="no-messages">
                <div class="icon">⚠️</div>
                <p>Failed to load phone numbers. Please refresh the page.</p>
            </div>
        `;
    }
}

// Format phone number for display
function formatPhoneNumber(phone) {
    if (!phone) return '';

    // US/Canada format: +1 XXX XXX XXXX
    if (phone.startsWith('+1') && phone.length === 12) {
        return `${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}`;
    }

    // Generic international format
    return phone.replace(/(\+\d{1,3})(\d{3,4})(\d{3,4})(\d{3,4})?/, '$1 $2 $3 $4').trim();
}
