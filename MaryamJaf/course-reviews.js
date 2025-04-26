const DATA_URL = "https://jsonplaceholder.typicode.com/comments"; 

// DOM Elements
const reviewsList = document.getElementById('reviews-list');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const paginationContainer = document.getElementById('pagination');
const reviewForm = document.getElementById('review-form');
const formErrors = document.getElementById('form-errors');
const loadingIndicator = document.getElementById('loading');