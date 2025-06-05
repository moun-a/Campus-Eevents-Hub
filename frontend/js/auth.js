// Handle user authentication state
let currentUser = JSON.parse(localStorage.getItem('user'));

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Handle signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Protect create event page
    if (window.location.pathname.includes('create-event.html') && !isLoggedIn()) {
        window.location.href = 'login.html';
    }
});

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await api.login({ email, password });
        
        if (response.success) {
            // Store the token
            localStorage.setItem('token', response.token);
            
            // Store user info
            localStorage.setItem('user', JSON.stringify(response.user));
            
            // Redirect to home page
            window.location.href = '../index.html';
        }
    } catch (error) {
        showError(error.message || 'Login failed. Please try again.');
    }
}

// Handle signup
async function handleSignup(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    try {
        const response = await api.register({
            email,
            password,
            firstName,
            lastName
        });
        
        if (response.success) {
            // Store the token
            localStorage.setItem('token', response.token);
            
            // Store user info
            localStorage.setItem('user', JSON.stringify(response.user));
            
            // Redirect to home page
            window.location.href = '../index.html';
        }
    } catch (error) {
        showError(error.message || 'Registration failed. Please try again.');
    }
}

// Handle logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
}

// Toggle password visibility
function togglePassword(inputId = 'password') {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show error message
function showError(message) {
    // Remove any existing error message
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and insert new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const form = document.querySelector('form');
    form.insertBefore(errorDiv, form.firstChild);
}

function showSuccess(message) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create and insert new success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;

    const form = document.querySelector('form');
    form.insertBefore(successDiv, form.firstChild);
} 