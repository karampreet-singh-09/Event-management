let events = JSON.parse(localStorage.getItem('events')) || [
    { id: 1, name: 'Tech Fest 2026', date: '2026-02-15', desc: 'AI/ML Workshop', category: 'Tech', spots: 100, registered: [] },
    { id: 2, name: 'Cultural Night', date: '2026-03-10', desc: 'Dance & Music', category: 'Cultural', spots: 200, registered: [] }
];
let userName = localStorage.getItem('userName') || '';

function saveData() {
    localStorage.setItem('events', JSON.stringify(events));
}

function showSection(section) {
    document.querySelectorAll('[id$="-section"]').forEach(s => s.style.display = 'none');
    document.getElementById(section + '-section').style.display = 'block';
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    if (section === 'events') renderEvents();
    if (section === 'myRegs') renderRegistrations();
}

function renderEvents(filteredEvents = events) {
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = '';
    filteredEvents.forEach(event => {
        const spotsLeft = event.spots - event.registered.length;
        grid.innerHTML += `
            <div class="event-card">
                <h3>${event.name}</h3>
                <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                <p>${event.desc}</p>
                <p><strong>Category:</strong> ${event.category} | <strong>Spots left:</strong> ${spotsLeft}</p>
                <button onclick="register(${event.id})" ${spotsLeft <= 0 ? 'disabled' : ''}>Register</button>
            </div>
        `;
    });
}

function filterEvents() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const filtered = events.filter(e => 
        e.name.toLowerCase().includes(search) && 
        (!category || e.category === category)
    );
    renderEvents(filtered);
}

function register(eventId) {
    if (!userName) {
        userName = prompt('Enter your name:');
        if (userName) localStorage.setItem('userName', userName);
    }
    const event = events.find(e => e.id === eventId);
    if (event && event.registered.length < event.spots && !event.registered.includes(userName)) {
        event.registered.push(userName);
        saveData();
        renderEvents();
        alert('Registered successfully!');
    } else {
        alert('Spots full or already registered!');
    }
}

function addEvent() {
    const name = document.getElementById('eventName').value;
    const date = document.getElementById('eventDate').value;
    const desc = document.getElementById('eventDesc').value;
    const category = document.getElementById('eventCategory').value;
    const spots = parseInt(document.getElementById('eventSpots').value);
    if (name && date && spots > 0) {
        events.push({
            id: Date.now(),
            name, date, desc, category, spots, registered: []
        });
        saveData();
        document.querySelectorAll('#add-section input, #add-section select').forEach(el => el.value = '');
        alert('Event added!');
        renderEvents();
    }
}

function renderRegistrations() {
    const list = document.getElementById('regsList');
    const regs = events.filter(e => e.registered.includes(userName));
    list.innerHTML = regs.length ? 
        regs.map(e => `<p>${e.name} - ${new Date(e.date).toLocaleDateString()}</p>`).join('') :
        '<p>No registrations yet.</p>';
}

function updateCountdown() {
    const now = new Date();
    const nextEvent = events.find(e => new Date(e.date) > now);
    if (nextEvent) {
        const diff = new Date(nextEvent.date) - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        document.getElementById('countdown').textContent = `Next: ${nextEvent.name} in ${days} days`;
    }
}

// Init
renderEvents();
showSection('events');
updateCountdown();
setInterval(updateCountdown, 86400000);
