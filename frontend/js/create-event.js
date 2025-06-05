document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const createEventForm = document.getElementById('createEventForm');
    const imageInput = document.getElementById('image');

    createEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('description', document.getElementById('description').value);
        
        // Combine date and time
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        formData.append('datetime', `${date}T${time}`);
        
        formData.append('location', document.getElementById('location').value);
        formData.append('category', document.getElementById('category').value);
        
        const maxAttendees = document.getElementById('maxAttendees').value;
        if (maxAttendees) {
            formData.append('maxAttendees', maxAttendees);
        }

        if (imageInput.files[0]) {
            formData.append('image', imageInput.files[0]);
        }

        try {
            const response = await api.createEvent(formData);
            if (response.success) {
                alert('Event created successfully!');
                window.location.href = 'my-events.html';
            } else {
                alert('Failed to create event: ' + response.message);
            }
        } catch (error) {
            console.error('Error creating event:', error);
            alert('An error occurred while creating the event. Please try again.');
        }
    });

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
});

// Initialize form functionality
function initializeForm() {
    const form = document.getElementById('createEventForm');
    const imageInput = document.getElementById('eventImage');
    const imagePreview = document.getElementById('imagePreview');

    // Handle image upload and preview
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                document.querySelector('.upload-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Set minimum date to today
    const dateInput = document.getElementById('eventDate');
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    dateInput.min = today.toISOString().slice(0, 16);

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const eventData = await getFormData(form);
            await publishEvent(eventData);
            window.location.href = 'my-events.html';
        } catch (error) {
            alert('Failed to create event: ' + error.message);
        }
    });
}

// Get form data including image
async function getFormData(form) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const formData = new FormData(form);
    const imageFile = formData.get('image');
    
    // Basic event data
    const eventData = {
        id: generateEventId(),
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        location: formData.get('location'),
        category: formData.get('category'),
        maxAttendees: formData.get('maxAttendees') || null,
        creatorId: currentUser.id,
        creatorName: `${currentUser.firstName} ${currentUser.lastName}`,
        status: 'upcoming',
        registeredUsers: [],
        createdAt: new Date().toISOString()
    };

    // Handle image
    if (imageFile.size > 0) {
        eventData.image = await readFileAsDataURL(imageFile);
    }

    return eventData;
}

// Save event as draft
function saveAsDraft() {
    const form = document.getElementById('createEventForm');
    const formData = new FormData(form);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const draftData = {
        id: generateEventId(),
        title: formData.get('title') || 'Untitled Event',
        description: formData.get('description') || '',
        date: formData.get('date') || '',
        location: formData.get('location') || '',
        category: formData.get('category') || '',
        maxAttendees: formData.get('maxAttendees') || null,
        creatorId: currentUser.id,
        creatorName: `${currentUser.firstName} ${currentUser.lastName}`,
        status: 'draft',
        registeredUsers: [],
        createdAt: new Date().toISOString()
    };

    // Save draft
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push(draftData);
    localStorage.setItem('events', JSON.stringify(events));

    // Redirect to my events page
    window.location.href = 'my-events.html';
}

// Publish event
async function publishEvent(eventData) {
    // This is a mock function - replace with actual backend call
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push(eventData);
    localStorage.setItem('events', JSON.stringify(events));
}

// Helper function to read file as data URL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

// Helper function to generate unique event ID
function generateEventId() {
    return 'evt_' + Math.random().toString(36).substr(2, 9);
} 