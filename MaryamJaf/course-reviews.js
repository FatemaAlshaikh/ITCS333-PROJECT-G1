const DATA_URL = "https://jsonplaceholder.typicode.com/comments"; 

// DOM Elements
const reviewsList = document.getElementById('reviews-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const paginationContainer = document.getElementById('pagination');
const reviewForm = document.getElementById('review-form');
const formErrors = document.getElementById('form-errors');
const loadingIndicator = document.getElementById('loading');

// Pagination settings
let currentPage = 1;
const reviewsPerPage = 5;
let reviewsData = []; // will hold fetched reviews

// Fetch data
async function fetchReviews() {
    showLoading(true);
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        reviewsData = data.slice(0, 50); // Only taking first 50 for demo purposes
        renderReviews();
        renderPagination();
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        reviewsList.innerHTML = `<p class="error">Failed to load reviews. Please try again later.</p>`;
    } finally {
        showLoading(false);
    }
}

// Render reviews
function renderReviews() {
    const filteredReviews = getFilteredReviews();
    const paginatedReviews = getPaginatedReviews(filteredReviews);

    reviewsList.innerHTML = "";

    if (paginatedReviews.length === 0) {
        reviewsList.innerHTML = "<p>No reviews found.</p>";
        return;
    }

    paginatedReviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <h3>${review.name}</h3>
            <p><strong>Email:</strong> ${review.email}</p>
            <p>${review.body}</p>
        `;
        reviewItem.addEventListener('click', () => showReviewDetail(review));
        reviewsList.appendChild(reviewItem);
    });
}

// Show single review detail
function showReviewDetail(review) {
    alert(`Review by ${review.name}\n\n${review.body}`);
}

// Search and filter
function getFilteredReviews() {
    const searchText = searchInput.value.toLowerCase();
    let filtered = reviewsData.filter(review =>
        review.name.toLowerCase().includes(searchText) ||
        review.body.toLowerCase().includes(searchText)
    );

    // Sorting
    const sortValue = sortSelect.value;
    if (sortValue === 'name-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === 'name-desc') {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
}
// Pagination
function getPaginatedReviews(reviews) {
    const start = (currentPage - 1) * reviewsPerPage;
    const end = start + reviewsPerPage;
    return reviews.slice(start, end);
}

function renderPagination() {
    const filteredReviews = getFilteredReviews();
    const pageCount = Math.ceil(filteredReviews.length / reviewsPerPage);

    paginationContainer.innerHTML = "";

    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = (i === currentPage) ? 'active' : '';
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderReviews();
            renderPagination();
        });
        paginationContainer.appendChild(pageButton);
    }
}

// Loading Indicator
function showLoading(isLoading) {
    loadingIndicator.style.display = isLoading ? 'block' : 'none';
}
// Form Validation
function validateForm(event) {
    event.preventDefault();
    formErrors.innerHTML = "";

    const name = reviewForm.elements['name'].value.trim();
    const email = reviewForm.elements['email'].value.trim();
    const reviewText = reviewForm.elements['review'].value.trim();

    let errors = [];

    if (name.length < 3) {
        errors.push("Name must be at least 3 characters.");
    }
    if (!validateEmail(email)) {
        errors.push("Invalid email format.");
    }
    if (reviewText.length < 10) {
        errors.push("Review must be at least 10 characters long.");
    }

    if (errors.length > 0) {
        formErrors.innerHTML = errors.map(e => `<p>${e}</p>`).join('');
    } else {
        alert("Form is valid! (In real app, it would be submitted)");
        reviewForm.reset();
    }
}

// Email Validation Helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Event Listeners
searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderReviews();
    renderPagination();
});

sortSelect.addEventListener('change', () => {
    currentPage = 1;
    renderReviews();
    renderPagination();
});

reviewForm.addEventListener('submit', validateForm);

// Initialize
fetchReviews();
