// Sample events data (this will be replaced with API calls to your backend)
const sampleEvents = [
    {
        id: 1,
        title: "Campus Tech Workshop",
        category: "academic",
        date: "2024-03-20",
        time: "14:00",
        location: "Engineering Building, Room 101",
        image: "https://source.unsplash.com/random/800x600/?technology",
        description: "Learn about the latest technologies and their applications in various fields.",
        organizer: "Computer Science Department"
    },
    {
        id: 2,
        title: "Spring Music Festival",
        category: "cultural",
        date: "2024-03-25",
        time: "18:00",
        location: "Campus Amphitheater",
        image: "https://source.unsplash.com/random/800x600/?concert",
        description: "Annual spring music festival featuring student bands and performers.",
        organizer: "Student Music Association"
    },
    // Add more sample events as needed
];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const dateFilter = document.getElementById('dateFilter');
const eventsContainer = document.getElementById('eventsGrid');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    setupEventListeners();
});

// Event handling
async function loadEvents() {
    try {
        const events = await api.getAllEvents();
        displayEvents(events);
    } catch (error) {
        console.error('Error loading events:', error);
        showError('Failed to load events');
    }
}

function displayEvents(events) {
    if (!events || events.length === 0) {
        eventsContainer.innerHTML = '<p class="no-events">No events found</p>';
        return;
    }

    eventsContainer.innerHTML = events.map(event => `
        <div class="event-card" data-aos="fade-up">
            <img src="${event.image || 'https://via.placeholder.com/300x200?text=Event'}" alt="${event.title}" class="event-image">
            <div class="event-details">
                <h3 class="event-title">${event.title}</h3>
                <div class="event-info">
                    <p><i class="fas fa-calendar"></i> ${formatDate(event.date)}</p>
                    <p><i class="fas fa-clock"></i> ${event.time}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                    <p><i class="fas fa-tag"></i> ${event.category}</p>
                </div>
                <p class="event-description">${event.description}</p>
                <div class="event-actions">
                    <button class="register-btn" onclick="handleRegistration(${event.id})">
                        Register Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Event listeners setup
function setupEventListeners() {
    searchInput.addEventListener('input', debounce(filterEvents, 300));
    categoryFilter.addEventListener('change', filterEvents);
    dateFilter.addEventListener('change', filterEvents);
}

// Filter events
async function filterEvents() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const date = dateFilter.value;

    try {
        const events = await api.getAllEvents();
        const filteredEvents = events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                                event.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || event.category.toLowerCase() === category;
            const matchesDate = !date || isInDateRange(event.date, date);

            return matchesSearch && matchesCategory && matchesDate;
        });

        displayEvents(filteredEvents);
    } catch (error) {
        console.error('Error filtering events:', error);
        showError('Failed to filter events');
    }
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function isInDateRange(dateString, range) {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (range) {
        case 'today':
            return isSameDay(eventDate, today);
        case 'tomorrow':
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return isSameDay(eventDate, tomorrow);
        case 'week':
            const weekFromNow = new Date(today);
            weekFromNow.setDate(weekFromNow.getDate() + 7);
            return eventDate >= today && eventDate <= weekFromNow;
        case 'month':
            const monthFromNow = new Date(today);
            monthFromNow.setMonth(monthFromNow.getMonth() + 1);
            return eventDate >= today && eventDate <= monthFromNow;
        default:
            return true;
    }
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showError(message) {
    console.error(message);
    // You can implement a more user-friendly error display here
}

// Event registration
async function handleRegistration(eventId) {
    try {
        await api.registerForEvent(eventId);
        alert('Successfully registered for the event!');
    } catch (error) {
        console.error('Error registering for event:', error);
        showError('Failed to register for event');
    }
}

// View Toggle
const viewBtns = document.querySelectorAll('.view-btn');
const eventsGrid = document.getElementById('eventsGrid');
const calendarView = document.getElementById('calendarView');
let calendar;

viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const view = btn.getAttribute('data-view');
        if (view === 'grid') {
            eventsGrid.classList.remove('hidden');
            calendarView.classList.add('hidden');
        } else {
            eventsGrid.classList.add('hidden');
            calendarView.classList.remove('hidden');
            initializeCalendar();
        }
    });
});

// Calendar Initialization
function initializeCalendar() {
    if (!calendar) {
        const calendarEl = document.getElementById('calendarView');
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            themeSystem: 'standard',
            events: async function(info, successCallback, failureCallback) {
                try {
                    const events = await api.getEvents();
                    const calendarEvents = events.map(event => ({
                        id: event.id,
                        title: event.title,
                        start: event.date + 'T' + event.time,
                        description: event.description,
                        url: `pages/event-details.html?id=${event.id}`,
                        backgroundColor: getCategoryColor(event.category_name)
                    }));
                    successCallback(calendarEvents);
                } catch (error) {
                    failureCallback(error);
                }
            },
            eventClick: function(info) {
                info.jsEvent.preventDefault();
                window.location.href = info.event.url;
            },
            eventDidMount: function(info) {
                tippy(info.el, {
                    content: `
                        <strong>${info.event.title}</strong><br>
                        ${info.event.extendedProps.description}
                    `,
                    allowHTML: true,
                    theme: htmlElement.getAttribute('data-theme')
                });
            }
        });
        calendar.render();
    } else {
        calendar.refetchEvents();
    }
}

// Event Card Animation
function animateEventCards() {
    const cards = document.querySelectorAll('.event-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

// Category Colors
function getCategoryColor(category) {
    const colors = {
        'academic': '#3b82f6',
        'social': '#f59e0b',
        'sports': '#22c55e',
        'cultural': '#ec4899',
        'default': '#64748b'
    };
    return colors[category.toLowerCase()] || colors.default;
} 