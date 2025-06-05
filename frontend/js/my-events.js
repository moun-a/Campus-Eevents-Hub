document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const tabButtons = document.querySelectorAll('.tab-button');
    const createdEventsContainer = document.getElementById('createdEvents');
    const registeredEventsContainer = document.getElementById('registeredEvents');
    const eventCardTemplate = document.getElementById('eventCardTemplate');

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const tabToShow = button.dataset.tab;
            if (tabToShow === 'created') {
                createdEventsContainer.style.display = 'block';
                registeredEventsContainer.style.display = 'none';
                loadCreatedEvents();
            } else {
                createdEventsContainer.style.display = 'none';
                registeredEventsContainer.style.display = 'block';
                loadRegisteredEvents();
            }
        });
    });

    // Load created events
    async function loadCreatedEvents() {
        try {
            const response = await api.getCreatedEvents();
            const eventsGrid = createdEventsContainer.querySelector('.events-grid');
            eventsGrid.innerHTML = '';

            if (response.success && response.events.length > 0) {
                response.events.forEach(event => {
                    const eventCard = createEventCard(event, true);
                    eventsGrid.appendChild(eventCard);
                });
            } else {
                eventsGrid.innerHTML = '<p class="no-events">You haven\'t created any events yet.</p>';
            }
        } catch (error) {
            console.error('Error loading created events:', error);
            showError('Failed to load your created events.');
        }
    }

    // Load registered events
    async function loadRegisteredEvents() {
        try {
            const response = await api.getRegisteredEvents();
            const eventsGrid = registeredEventsContainer.querySelector('.events-grid');
            eventsGrid.innerHTML = '';

            if (response.success && response.events.length > 0) {
                response.events.forEach(event => {
                    const eventCard = createEventCard(event, false);
                    eventsGrid.appendChild(eventCard);
                });
            } else {
                eventsGrid.innerHTML = '<p class="no-events">You haven\'t registered for any events yet.</p>';
            }
        } catch (error) {
            console.error('Error loading registered events:', error);
            showError('Failed to load your registered events.');
        }
    }

    // Create event card
    function createEventCard(event, isCreator) {
        const card = eventCardTemplate.content.cloneNode(true);
        
        // Set event image
        const eventImage = card.querySelector('.event-image img');
        eventImage.src = event.image || '../assets/default-event.jpg';
        eventImage.alt = event.title;

        // Set event details
        card.querySelector('.event-title').textContent = event.title;
        card.querySelector('.event-date').textContent = new Date(event.datetime).toLocaleString();
        card.querySelector('.event-location').textContent = event.location;

        // Set event status
        const statusElement = card.querySelector('.event-status');
        const now = new Date();
        const eventDate = new Date(event.datetime);
        
        if (event.cancelled) {
            statusElement.textContent = 'Cancelled';
            statusElement.classList.add('cancelled');
        } else if (eventDate < now) {
            statusElement.textContent = 'Past';
            statusElement.classList.add('past');
    } else {
            statusElement.textContent = 'Upcoming';
            statusElement.classList.add('upcoming');
        }

        // Configure action buttons
        const editBtn = card.querySelector('.edit-btn');
        const cancelBtn = card.querySelector('.cancel-btn');
        const deleteBtn = card.querySelector('.delete-btn');

        if (isCreator) {
            editBtn.style.display = 'flex';
            deleteBtn.style.display = 'flex';
            
            editBtn.addEventListener('click', () => {
                window.location.href = `create-event.html?id=${event.id}`;
            });

            deleteBtn.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this event?')) {
                    try {
                        const response = await api.deleteEvent(event.id);
                        if (response.success) {
                            loadCreatedEvents();
                        } else {
                            showError('Failed to delete event.');
                        }
                    } catch (error) {
                        console.error('Error deleting event:', error);
                        showError('An error occurred while deleting the event.');
                    }
                }
            });
        }

        cancelBtn.addEventListener('click', async () => {
            const action = isCreator ? 'cancel' : 'unregister from';
            if (confirm(`Are you sure you want to ${action} this event?`)) {
                try {
                    const response = isCreator 
                        ? await api.cancelEvent(event.id)
                        : await api.unregisterFromEvent(event.id);
                    
                    if (response.success) {
                        if (isCreator) {
                            loadCreatedEvents();
                        } else {
                            loadRegisteredEvents();
                        }
    } else {
                        showError(`Failed to ${action} event.`);
                    }
                } catch (error) {
                    console.error(`Error ${action} event:`, error);
                    showError(`An error occurred while ${action} the event.`);
                }
            }
        });

        return card;
    }

    // Error handling
    function showError(message) {
        alert(message);
    }

    // Load initial events
    loadCreatedEvents();
}); 