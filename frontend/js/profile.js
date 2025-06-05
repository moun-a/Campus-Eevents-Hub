document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Load user data
    loadUserProfile();

    // Handle form submissions
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    document.getElementById('passwordForm').addEventListener('submit', handlePasswordUpdate);

    // Handle avatar change
    document.getElementById('avatarInput').addEventListener('change', handleAvatarChange);
});

// Load user profile data
function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;

    // Update header
    document.getElementById('profileName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('profileEmail').textContent = user.email;

    // Update avatar
    if (user.avatar) {
        document.getElementById('profileAvatar').src = user.avatar;
    } else {
        document.getElementById('profileAvatar').src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`;
    }

    // Fill form fields
    document.getElementById('firstName').value = user.firstName || '';
    document.getElementById('lastName').value = user.lastName || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('department').value = user.department || '';
    document.getElementById('bio').value = user.bio || '';
}

// Handle profile update
async function handleProfileUpdate(e) {
    e.preventDefault();

    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value,
        bio: document.getElementById('bio').value
    };

    try {
        // This is a mock update - replace with actual backend call
        const success = await mockUpdateProfile(formData);
        
        if (success) {
            showSuccess('Profile updated successfully');
            loadUserProfile(); // Reload the profile data
        }
    } catch (error) {
        showError('Failed to update profile');
    }
}

// Handle password update
async function handlePasswordUpdate(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    // Validate passwords match
    if (newPassword !== confirmNewPassword) {
        showError('New passwords do not match', 'passwordForm');
        return;
    }

    try {
        // This is a mock update - replace with actual backend call
        const success = await mockUpdatePassword(currentPassword, newPassword);
        
        if (success) {
            showSuccess('Password updated successfully');
            document.getElementById('passwordForm').reset();
        }
    } catch (error) {
        showError('Failed to update password', 'passwordForm');
    }
}

// Handle avatar change
function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showError('Please upload an image file');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            // This is a mock update - replace with actual backend call
            const success = await mockUpdateAvatar(e.target.result);
            
            if (success) {
                document.getElementById('profileAvatar').src = e.target.result;
                showSuccess('Profile picture updated successfully');
            }
        } catch (error) {
            showError('Failed to update profile picture');
        }
    };
    reader.readAsDataURL(file);
}

// Handle account deletion
function confirmDeleteAccount() {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    
    if (confirmed) {
        try {
            // This is a mock delete - replace with actual backend call
            mockDeleteAccount();
            logout(); // This will redirect to home page
        } catch (error) {
            showError('Failed to delete account');
        }
    }
}

// Show success message
function showSuccess(message) {
    alert(message); // Replace with a better UI notification system
}

// Show error message
function showError(message, formId = 'profileForm') {
    const form = document.getElementById(formId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    form.insertBefore(errorDiv, form.firstChild);
}

// Mock functions for demonstration (replace with actual backend calls)
function mockUpdateProfile(profileData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            // Update user in users array
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], ...profileData };
                localStorage.setItem('users', JSON.stringify(users));
                
                // Update current user
                const updatedUser = { ...currentUser, ...profileData };
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                
                resolve(true);
            } else {
                resolve(false);
            }
        }, 500);
    });
}

function mockUpdatePassword(currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1 && users[userIndex].password === currentPassword) {
                users[userIndex].password = newPassword;
                localStorage.setItem('users', JSON.stringify(users));
                resolve(true);
            } else {
                reject(new Error('Current password is incorrect'));
            }
        }, 500);
    });
}

function mockUpdateAvatar(avatarData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            currentUser.avatar = avatarData;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex].avatar = avatarData;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            resolve(true);
        }, 500);
    });
}

function mockDeleteAccount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const updatedUsers = users.filter(u => u.email !== currentUser.email);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
} 