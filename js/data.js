// Country data with flags and phone prefixes
// API countryId mapping: 0=US, 1=UK, 2=FR, 3=DE, 4=IT, 5=ES, 6=PL, 7=RU, 8=PT, 9=GR, 10=SE, 11=FI, 12=CN, 13=JP, 14=KR
const COUNTRIES = [
    { id: 'us', apiId: 0, name: 'United States', flag: '🇺🇸', prefix: '+1', code: 'US' },
    { id: 'uk', apiId: 1, name: 'United Kingdom', flag: '🇬🇧', prefix: '+44', code: 'UK' },
    { id: 'fr', apiId: 2, name: 'France', flag: '🇫🇷', prefix: '+33', code: 'FR' },
    { id: 'de', apiId: 3, name: 'Germany', flag: '🇩🇪', prefix: '+49', code: 'DE' },
    { id: 'it', apiId: 4, name: 'Italy', flag: '🇮🇹', prefix: '+39', code: 'IT' },
    { id: 'es', apiId: 5, name: 'Spain', flag: '🇪🇸', prefix: '+34', code: 'ES' },
    { id: 'pl', apiId: 6, name: 'Poland', flag: '🇵🇱', prefix: '+48', code: 'PL' },
    { id: 'ru', apiId: 7, name: 'Russia', flag: '🇷🇺', prefix: '+7', code: 'RU' },
    { id: 'pt', apiId: 8, name: 'Portugal', flag: '🇵🇹', prefix: '+351', code: 'PT' },
    { id: 'gr', apiId: 9, name: 'Greece', flag: '🇬🇷', prefix: '+30', code: 'GR' },
    { id: 'se', apiId: 10, name: 'Sweden', flag: '🇸🇪', prefix: '+46', code: 'SE' },
    { id: 'fi', apiId: 11, name: 'Finland', flag: '🇫🇮', prefix: '+358', code: 'FI' },
    { id: 'cn', apiId: 12, name: 'China', flag: '🇨🇳', prefix: '+86', code: 'CN' },
    { id: 'jp', apiId: 13, name: 'Japan', flag: '🇯🇵', prefix: '+81', code: 'JP' },
    { id: 'kr', apiId: 14, name: 'South Korea', flag: '🇰🇷', prefix: '+82', code: 'KR' }
];

// Helper functions for country lookups
function getCountryByApiId(apiId) {
    return COUNTRIES.find(c => c.apiId === apiId);
}

function getCountryById(id) {
    return COUNTRIES.find(c => c.id === id);
}

// SMS message templates (from .NET project)
const SMS_TEMPLATES = [
    "Amazon: Your verification code is {num:6}. Do not share this code.",
    "WeChat: Your verification code is {num:6}. Code valid for 5 minutes.",
    "Google: Your verification code is {num:6}",
    "Facebook: Your confirmation code is {num:6}",
    "WhatsApp: Your code is {num:6}. Do not share it.",
    "PayPal: Your security code is {num:6}. It expires in 10 minutes.",
    "Instagram: {num:6} is your Instagram code.",
    "Apple: Your Apple ID Code is: {num:6}. Don't share it with anyone.",
    "Microsoft: Your security code is {num:6}",
    "Alibaba: Your verification code is {num:6}. Do not share.",
    "Shopee: Your OTP is {num:6}. Valid for 5 mins.",
    "Mercado Libre: Your security code is {num:6}",
    "Alipay: Your verification code is {num:6}. Valid for 5 minutes.",
    "Telegram: Your login code: {num:5}. Do not give it to anyone.",
    "Viber: Your Viber code: {num:6}",
    "LINE: Your verification code is {num:6}",
    "Zalo: {num:6} is your Zalo verification code.",
    "Tango: Your Tango code is {num:4}",
    "Uber: Your Uber code is {num:4}. Never share this code.",
    "Lyft: Your Lyft code is {num:4}",
    "Bolt: Your Bolt code is {num:4}. Don't share it.",
    "Grab: Your Grab verification code is {num:6}",
    "Ola: Your OTP is {num:6}. Valid for 3 mins.",
    "Didi: Your verification code is {num:6}",
    "inDrive: Your code: {num:4}",
    "DoorDash: Your DoorDash verification code is {num:6}.",
    "Revolut: Your code is {num:6}. Never share it.",
    "Wise: Your Wise verification code is {num:6}",
    "Monzo: Your Monzo verification code is {num:6}",
    "Paytm: Your Paytm OTP is {num:6}. Do not share.",
    "GCash: Your GCash verification code is {num:6}",
    "Klarna: Your one-time code is {num:6}",
    "Netflix: Your Netflix verification code is {num:6}",
    "Spotify: Your Spotify code is {num:6}",
    "Disney+: Your Disney+ code is {num:6}",
    "Booking.com: Your verification code is {num:4}",
    "Airbnb: Your verification code is {num:4}. It expires in 10 minutes.",
    "Trip.com: Your verification code is {num:6}.",
    "Expedia: Your Expedia verification code is {num:6}",
    "Agoda: Your verification code is {num:6}. Don't share this code.",
    "Steam: Your Steam Guard code is {num:5}",
    "PSN: Your verification code is {num:6}",
    "Xbox: Your security code is {num:6}",
    "Riot Games: Your verification code is {num:6}",
    "Epic Games: Your security code is {num:6}",
    "Zoom: Your Zoom verification code is {num:6}",
    "Slack: Your Slack confirmation code is {num:6}",
    "Canva: Your verification code is {num:6}",
    "Notion: Your login code is {num:6}",
    "Dropbox: Your Dropbox security code is {num:6}",
    "Reddit: Your verification code is {num:6}",
    "Snapchat: Your Snapchat code: {num:6}. Do not share.",
    "VK: Your confirmation code is {num:6}.",
    "Vodafone: Your one-time PIN is {num:6}",
    "Orange: Your verification code is {num:6}",
    "Telstra: Your verification code is {num:6}",
    "T-Mobile: Your verification code is {num:6}",
    "Claro: Your verification code is {num:6}",
    "M-Pesa: Your M-Pesa confirmation code is {num:6}. Don't share it.",
    "Your OTP code is {num:6}. Valid for 5 minutes.",
    "Security code: {num:6}. Do not share this with anyone.",
    "Verification: {num:6}",
    "Your login code is {num:6}. This code expires in 10 minutes.",
    "Code: {num:4}. Don't share it.",
    "Your confirmation code: {num:6}",
    "Twitter: Your verification code is {num:6}",
    "TikTok: {num:6} is your verification code",
    "LinkedIn: Your verification code is {num:6}",
    "Pinterest: Your code is {num:6}",
    "Yahoo: Your verification code is {num:6}",
    "Binance: Your verification code is {num:6}. Don't share.",
    "Coinbase: Your verification code is {num:6}",
    "Kraken: Your authentication code is {num:6}",
    "Cash App: Your verification code is {num:6}",
    "Venmo: Your Venmo code is {num:6}. Don't share.",
    "Zelle: Your verification code is {num:6}",
    "eBay: Your security code is {num:6}",
    "Etsy: Your verification code is {num:6}",
    "Walmart: Your verification code is {num:6}",
    "Target: Your verification code is {num:6}",
    "Tinder: Your Tinder code is {num:6}",
    "Bumble: Your Bumble code is {num:6}",
    "Hinge: Your verification code is {num:6}",
    "Signal: Your Signal verification code: {num:6}",
    "Discord: Your verification code is {num:6}",
    "Twitch: Your verification code is {num:6}",
    "GitHub: Your verification code is {num:6}",
    "GitLab: {num:6} is your verification code",
    "Stripe: Your verification code is {num:6}",
    "Square: Your verification code is {num:6}",
    "Shopify: Your verification code is {num:6}",
    "OpenAI: Your verification code is {num:6}"
];

// Alphanumeric senders (20% chance)
const ALPHANUMERIC_SENDERS = [
    'Service', 'Notify', 'AcmeCorp', 'OTP', 'Verify',
    'SecureCode', 'Alert', 'Info', 'Support', 'Auth'
];

// Number of phone numbers per country (will be updated from API)
let NUMBERS_PER_COUNTRY = {
    'us': 6, 'uk': 5, 'fr': 3, 'de': 4, 'it': 3,
    'es': 3, 'pl': 3, 'ru': 6, 'pt': 3, 'gr': 2,
    'se': 3, 'fi': 3, 'cn': 6, 'jp': 4, 'kr': 5
};

// Cache for API data
let cachedNumbers = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60000; // 1 minute cache

// Fetch and cache all numbers from API
async function fetchAllNumbers() {
    const now = Date.now();

    // Return cached data if still valid
    if (cachedNumbers && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
        return cachedNumbers;
    }

    try {
        cachedNumbers = await api.getAllNumbers();
        cacheTimestamp = now;

        // Update NUMBERS_PER_COUNTRY from API data
        const stats = {};
        cachedNumbers.forEach(num => {
            const country = getCountryByApiId(num.countryId);
            if (country) {
                stats[country.id] = (stats[country.id] || 0) + 1;
            }
        });
        NUMBERS_PER_COUNTRY = { ...NUMBERS_PER_COUNTRY, ...stats };

        return cachedNumbers;
    } catch (error) {
        console.error('Failed to fetch numbers from API:', error);
        return [];
    }
}
