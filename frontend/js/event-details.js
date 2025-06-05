import api from './api.js';

let currentEventId = null;
let currentUser = null;

// Get event ID from URL
function getEventIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load event details
async function loadEventDetails() {
    try {
        currentEventId = getEventIdFromUrl();
        if (!currentEventId) {
            throw new Error('No event ID provided');
        }

        const event = await api.getEvent(currentEventId);
        displayEventDetails(event);
        loadComments();
    } catch (error) {
        console.error('Error loading event:', error);
        showError('Failed to load event details');
    }
}

// Display event details
function displayEventDetails(event) {
    const eventDetails = document.getElementById('eventDetails');
    eventDetails.innerHTML = `
        <h1>${event.title}</h1>
        <div class="event-meta">
            <p><i class="fas fa-calendar"></i> ${formatDate(event.date)}</p>
            <p><i class="fas fa-clock"></i> ${formatTime(event.time)}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <p><i class="fas fa-tag"></i> ${event.category_name}</p>
            <p><i class="fas fa-user"></i> Organized by: ${event.creator_name}</p>
        </div>
        <div class="event-description">
            <p>${event.description}</p>
        </div>
    `;
}

// Load comments
async function loadComments() {
    try {
        const comments = await api.getEventComments(currentEventId);
        displayComments(comments);
    } catch (error) {
        console.error('Error loading comments:', error);
        showError('Failed to load comments');
    }
}

// Display comments
function displayComments(comments) {
    const commentsList = document.getElementById('commentsList');
    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
        return;
    }

    commentsList.innerHTML = comments.map(comment => `
        <div class="comment" data-comment-id="${comment.id}">
            <div class="comment-header">
                <span class="comment-author">${comment.user_name}</span>
                <span class="comment-date">${formatDate(comment.created_at)}</span>
                ${comment.user_id === getCurrentUserId() ? `
                    <div class="comment-actions">
                        <button class="edit-comment" onclick="editComment(${comment.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-comment" onclick="deleteComment(${comment.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                ` : ''}
            </div>
            <div class="comment-content">${comment.content}</div>
        </div>
    `).join('');
}

// Add new comment
async function addComment(content) {
    try {
        await api.addComment(currentEventId, content);
        document.getElementById('commentInput').value = '';
        loadComments(); // Reload comments
    } catch (error) {
        console.error('Error adding comment:', error);
        showError('Failed to add comment');
    }
}

// Edit comment
async function editComment(commentId) {
    const commentDiv = document.querySelector(`[data-comment-id="${commentId}"]`);
    const contentDiv = commentDiv.querySelector('.comment-content');
    const currentContent = contentDiv.textContent;

    contentDiv.innerHTML = `
        <textarea class="edit-comment-input">${currentContent}</textarea>
        <div class="edit-actions">
            <button onclick="updateComment(${commentId})">Save</button>
            <button onclick="cancelEdit(${commentId}, '${currentContent}')">Cancel</button>
        </div>
    `;
}

// Update comment
async function updateComment(commentId) {
    const commentDiv = document.querySelector(`[data-comment-id="${commentId}"]`);
    const content = commentDiv.querySelector('.edit-comment-input').value;

    try {
        await api.updateComment(commentId, content);
        loadComments(); // Reload comments
    } catch (error) {
        console.error('Error updating comment:', error);
        showError('Failed to update comment');
    }
}

// Delete comment
async function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }

    try {
        await api.deleteComment(commentId);
        loadComments(); // Reload comments
    } catch (error) {
        console.error('Error deleting comment:', error);
        showError('Failed to delete comment');
    }
}

// Helper functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatTime(timeString) {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.id : null;
}

function showError(message) {
    // Implement error display logic
    alert(message);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadEventDetails();

    document.getElementById('submitComment').addEventListener('click', () => {
        const content = document.getElementById('commentInput').value.trim();
        if (content) {
            addComment(content);
        }
    });
});

// Make functions available globally for onclick handlers
window.editComment = editComment;
window.updateComment = updateComment;
window.deleteComment = deleteComment; 