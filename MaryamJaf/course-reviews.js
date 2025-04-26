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
