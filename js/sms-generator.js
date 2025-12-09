// SMS Generator - Port of .NET logic to JavaScript
// Uses session storage to persist unique messages per user session

class SmsGenerator {
    constructor() {
        this.sessionId = this.getOrCreateSessionId();
        this.seedRandom = this.createSeededRandom(this.sessionId);
    }

    // Get or create a unique session ID that persists across page refreshes
    getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('sms_session_id');
        if (!sessionId) {
            sessionId = this.generateUUID();
            sessionStorage.setItem('sms_session_id', sessionId);
        }
        return sessionId;
    }

    // Generate a UUID for session identification
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Create a seeded random number generator for consistent results per session
    createSeededRandom(seed) {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        // Simple seeded PRNG (mulberry32)
        let state = hash >>> 0;
        return function() {
            state = Math.imul(state ^ state >>> 15, state | 1);
            state ^= state + Math.imul(state ^ state >>> 7, state | 61);
            return ((state ^ state >>> 14) >>> 0) / 4294967296;
        };
    }

    // Create a seeded random for a specific phone number
    createPhoneSeededRandom(phoneNumber) {
        const combinedSeed = this.sessionId + phoneNumber;
        return this.createSeededRandom(combinedSeed);
    }

    // Generate E.164 formatted phone number based on country
    generatePhoneNumber(countryId, index) {
        const phoneSeed = this.sessionId + countryId + index;
        const rng = this.createSeededRandom(phoneSeed);

        const randomDigit = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
        const randomDigits = (count) => {
            let result = '';
            for (let i = 0; i < count; i++) {
                result += Math.floor(rng() * 10);
            }
            return result;
        };

        switch (countryId) {
            case 'us':
            case 'ca':
                // NANP: +1 NPA NXX XXXX
                const npa = randomDigit(2, 9).toString() + randomDigits(2);
                const nxx = randomDigit(2, 9).toString() + randomDigits(2);
                const line = randomDigits(4);
                return `+1${npa}${nxx}${line}`;

            case 'uk':
                // UK: +44 7XXX XXXXXX
                return `+447${randomDigits(9)}`;

            case 'de':
                // Germany: +49 1XX XXXXXXX
                const dePrefixes = ['15', '16', '17'];
                const dePrefix = dePrefixes[Math.floor(rng() * dePrefixes.length)];
                return `+49${dePrefix}${randomDigits(8)}`;

            case 'fr':
                // France: +33 6XX XXX XXX or +33 7XX XXX XXX
                const frPrefix = rng() > 0.5 ? '6' : '7';
                return `+33${frPrefix}${randomDigits(8)}`;

            case 'it':
                // Italy: +39 3XX XXX XXXX
                return `+393${randomDigits(9)}`;

            case 'es':
                // Spain: +34 6XX XXX XXX or +34 7XX XXX XXX
                const esPrefix = rng() > 0.5 ? '6' : '7';
                return `+34${esPrefix}${randomDigits(8)}`;

            case 'pl':
                // Poland: +48 XXX XXX XXX (first digit 4-8)
                return `+48${randomDigit(4, 8)}${randomDigits(8)}`;

            case 'ru':
                // Russia: +7 9XX XXX XX XX
                return `+79${randomDigit(0, 9)}${randomDigit(0, 9)}${randomDigits(7)}`;

            case 'se':
                // Sweden: +46 7X XXX XX XX
                const sePrefixes = ['70', '72', '73', '76', '79'];
                const sePrefix = sePrefixes[Math.floor(rng() * sePrefixes.length)];
                return `+46${sePrefix}${randomDigits(7)}`;

            case 'no':
                // Norway: +47 XXX XX XXX (first digit 2-9)
                return `+47${randomDigit(2, 9)}${randomDigits(7)}`;

            case 'gr':
                // Greece: +30 69X XXX XXXX
                return `+3069${randomDigits(8)}`;

            case 'cn':
                // China: +86 1XX XXXX XXXX
                return `+861${randomDigit(3, 9)}${randomDigits(9)}`;

            case 'jp':
                // Japan: +81 X0 XXXX XXXX
                const jpPrefixes = ['70', '80', '90'];
                const jpPrefix = jpPrefixes[Math.floor(rng() * jpPrefixes.length)];
                return `+81${jpPrefix}${randomDigits(8)}`;

            case 'kr':
                // South Korea: +82 10 XXXX XXXX
                return `+8210${randomDigits(8)}`;

            case 'hu':
                // Hungary: +36 XX XXX XXXX
                const huPrefixes = ['20', '30', '70'];
                const huPrefix = huPrefixes[Math.floor(rng() * huPrefixes.length)];
                return `+36${huPrefix}${randomDigits(7)}`;

            default:
                return `+1${randomDigits(10)}`;
        }
    }

    // Generate all phone numbers for a country
    getPhoneNumbersForCountry(countryId) {
        const count = NUMBERS_PER_COUNTRY[countryId] || 3;
        const numbers = [];

        for (let i = 0; i < count; i++) {
            numbers.push({
                id: `${countryId}-${i}`,
                phone: this.generatePhoneNumber(countryId, i),
                countryId: countryId
            });
        }

        return numbers;
    }

    // Render template with random numbers
    renderTemplate(template, rng) {
        return template.replace(/\{num:(\d+)\}/g, (match, digits) => {
            const count = parseInt(digits, 10);
            let result = '';
            for (let i = 0; i < count; i++) {
                result += Math.floor(rng() * 10);
            }
            return result;
        });
    }

    // Generate a random sender (80% phone, 20% alphanumeric)
    generateSender(rng) {
        if (rng() < 0.8) {
            // Generate a phone number as sender
            const areaCode = Math.floor(rng() * 800) + 200;
            const exchange = Math.floor(rng() * 800) + 200;
            const number = Math.floor(rng() * 10000).toString().padStart(4, '0');
            return `+1-${areaCode}-${exchange}-${number}`;
        } else {
            // Use alphanumeric sender
            const idx = Math.floor(rng() * ALPHANUMERIC_SENDERS.length);
            return ALPHANUMERIC_SENDERS[idx];
        }
    }

    // Generate SMS messages for a phone number
    generateSmsForNumber(phoneNumber, count = 15) {
        const rng = this.createPhoneSeededRandom(phoneNumber);
        const messages = [];

        // Generate a base timestamp (within last 24 hours)
        const now = Math.floor(Date.now() / 1000);
        const dayAgo = now - (24 * 60 * 60);

        // Create messages with varying timestamps
        const usedTemplates = new Set();

        for (let i = 0; i < count; i++) {
            // Pick a unique template if possible
            let templateIdx;
            let attempts = 0;
            do {
                templateIdx = Math.floor(rng() * SMS_TEMPLATES.length);
                attempts++;
            } while (usedTemplates.has(templateIdx) && attempts < SMS_TEMPLATES.length);

            usedTemplates.add(templateIdx);
            const template = SMS_TEMPLATES[templateIdx];

            // Calculate timestamp - spread messages across 24 hours
            const timeOffset = Math.floor(rng() * (24 * 60 * 60));
            const timestamp = now - timeOffset;

            messages.push({
                id: i,
                content: this.renderTemplate(template, rng),
                sender: this.generateSender(rng),
                time: timestamp
            });
        }

        // Sort by time (newest first)
        messages.sort((a, b) => b.time - a.time);

        return messages;
    }

    // Format phone number for display
    formatPhoneNumber(phone) {
        // Basic formatting - add spaces for readability
        if (phone.startsWith('+1') && phone.length === 12) {
            return `${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}`;
        }
        // Generic formatting for international numbers
        return phone.replace(/(\+\d{1,3})(\d{3,4})(\d{3,4})(\d{3,4})?/, '$1 $2 $3 $4').trim();
    }

    // Format timestamp for display
    formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diff = now - date;

        // Less than 1 hour
        if (diff < 3600000) {
            const mins = Math.floor(diff / 60000);
            return mins <= 1 ? 'Just now' : `${mins} min ago`;
        }

        // Less than 24 hours
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }

        // Show date
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Highlight verification codes in message content
    highlightCodes(content) {
        // Match 4-6 digit codes
        return content.replace(/\b(\d{4,6})\b/g, '<span class="code">$1</span>');
    }
}

// Create global instance
const smsGenerator = new SmsGenerator();
