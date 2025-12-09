// Inbox page (inbox.html)

document.addEventListener('DOMContentLoaded', function() {
    initInboxPage();
});

async function initInboxPage() {
    const params = new URLSearchParams(window.location.search);
    const numberId = params.get('id');

    if (!numberId) {
        window.location.href = 'index.html';
        return;
    }

    // Show loading state
    const container = document.getElementById('messages-list');
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading messages...</p>
        </div>
    `;

    try {
        // Fetch the specific number with its messages from API
        const numberData = await api.getNumberById(numberId);

        if (!numberData) {
            window.location.href = 'index.html';
            return;
        }

        // Get country info
        const country = getCountryByApiId(numberData.countryId);
        if (!country) {
            window.location.href = 'index.html';
            return;
        }

        // Update page content
        const countryLink = document.getElementById('country-link');
        countryLink.textContent = country.name;
        countryLink.href = `numbers.html?country=${country.id}`;

        const formattedPhone = formatPhoneNumberInbox(numberData.phone);
        document.getElementById('phone-number').textContent = formattedPhone;
        document.getElementById('phone-display').textContent = formattedPhone;
        document.title = `${formattedPhone} - TemporarySMS`;

        // Setup copy button
        setupCopyButton(numberData.phone);

        // Render messages
        renderMessages(numberData.sms || []);

        // Set up auto-refresh every 30 seconds
        setInterval(async () => {
            try {
                const updatedData = await api.getNumberById(numberId);
                if (updatedData && updatedData.sms) {
                    renderMessages(updatedData.sms);
                }
            } catch (error) {
                console.error('Error refreshing messages:', error);
            }
        }, 30000);

    } catch (error) {
        console.error('Error loading inbox:', error);
        container.innerHTML = `
            <div class="no-messages">
                <div class="icon">⚠️</div>
                <p>Failed to load messages. Please refresh the page.</p>
            </div>
        `;
    }
}

function setupCopyButton(phone) {
    const copyBtn = document.getElementById('copy-btn');

    copyBtn.addEventListener('click', async function() {
        try {
            await navigator.clipboard.writeText(phone);
            copyBtn.classList.add('copied');
            copyBtn.querySelector('.copy-text').textContent = 'Copied!';

            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.querySelector('.copy-text').textContent = 'Copy';
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = phone;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            copyBtn.classList.add('copied');
            copyBtn.querySelector('.copy-text').textContent = 'Copied!';

            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.querySelector('.copy-text').textContent = 'Copy';
            }, 2000);
        }
    });
}

function renderMessages(messages) {
    const container = document.getElementById('messages-list');
    const messageCountEl = document.getElementById('message-count');

    if (messageCountEl) {
        messageCountEl.textContent = messages.length;
    }

    if (messages.length === 0) {
        container.innerHTML = `
            <div class="no-messages">
                <div class="icon">📭</div>
                <p>No messages yet. New messages will appear here.</p>
            </div>
        `;
        return;
    }

    // Sort messages by time (newest first)
    const sortedMessages = [...messages].sort((a, b) => b.time - a.time);

    container.innerHTML = sortedMessages.map(message => `
        <div class="message-card">
            <div class="message-header">
                <span class="message-sender">${escapeHtml(message.sender)}</span>
                <span class="message-time">${formatTime(message.time)}</span>
            </div>
            <div class="message-content">${highlightCodes(escapeHtml(message.content))}</div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format phone number for display
function formatPhoneNumberInbox(phone) {
    if (!phone) return '';

    // US/Canada format: +1 XXX XXX XXXX
    if (phone.startsWith('+1') && phone.length === 12) {
        return `${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}`;
    }

    // Generic international format
    return phone.replace(/(\+\d{1,3})(\d{3,4})(\d{3,4})(\d{3,4})?/, '$1 $2 $3 $4').trim();
}

// Format timestamp for display
function formatTime(timestamp) {
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
function highlightCodes(content) {
    if (!content) return '';
    // Match 4-6 digit codes
    return content.replace(/\b(\d{4,6})\b/g, '<span class="code">$1</span>');
}
