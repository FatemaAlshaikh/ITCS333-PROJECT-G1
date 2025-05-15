document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://mockapi.io/clone/680c10042ea307e081d31b0f';
  const groupGrid = document.querySelector('.group-grid');
  const searchInput = document.querySelector('input[type="text"]');
  const searchButton = document.querySelector('.search-button');
  const filterButton = document.querySelector('.search-filter');
  const paginationContainer = document.querySelector('.pagination');

  let groups = [];
  let currentPage = 1;
  const itemsPerPage = 4;

  const loadingIndicator = document.createElement('p');
  loadingIndicator.textContent = 'Loading...';
  loadingIndicator.style.fontWeight = 'bold';

  async function fetchGroups() {
    try {
      groupGrid.innerHTML = '';
      groupGrid.appendChild(loadingIndicator);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const data = await response.json();

      groups = data.slice(0, 15).map((item, index) => ({
        id: item.id,
        course: `Course ${index + 1}`,
        title: item.title,
        time: `Weekday ${index + 1} at ${10 + index % 5} AM`,
        location: index % 2 === 0 ? 'Online' : 'Campus Room ' + index,
      }));

      renderGroups();
    } catch (error) {
      groupGrid.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
  }

  function renderGroups() {
    groupGrid.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const visibleGroups = groups.slice(start, end);

    if (visibleGroups.length === 0) {
      groupGrid.innerHTML = '<p>No groups found.</p>';
      return;
    }

    visibleGroups.forEach(group => {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'group';
      groupDiv.innerHTML = `
        <h3>${group.course} - ${group.title}</h3>
        <p>Time: ${group.time} | Location: ${group.location}</p>
        <button class="join-button" data-id="${group.id}">Join Group</button>
      `;
      groupGrid.appendChild(groupDiv);
    });

    renderPagination();
  }

  function renderPagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(groups.length / itemsPerPage);

    const createPageButton = (label, page) => {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = label;
      if (page === currentPage) a.classList.add('active');
      a.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = page;
        renderGroups();
      });
      return a;
    };

    if (currentPage > 1) paginationContainer.appendChild(createPageButton('«', currentPage - 1));
    for (let i = 1; i <= totalPages; i++) {
      paginationContainer.appendChild(createPageButton(i, i));
    }
    if (currentPage < totalPages) paginationContainer.appendChild(createPageButton('»', currentPage + 1));
  }

  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      alert('Please enter a course code to search.');
      return;
    }
    const filtered = groups.filter(g => g.course.toLowerCase().includes(query));
    if (filtered.length === 0) {
      groupGrid.innerHTML = '<p>No matching groups found.</p>';
    } else {
      groups = filtered;
      currentPage = 1;
      renderGroups();
    }
  });

  filterButton.addEventListener('click', () => {
    groups.sort((a, b) => a.course.localeCompare(b.course));
    currentPage = 1;
    renderGroups();
  });
document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.querySelector(".search-button");
  const searchInput = document.querySelector(".search-bar input");
  const groups = document.querySelectorAll(".group");

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toUpperCase();

    groups.forEach(group => {
      const course = group.dataset.course.toUpperCase();
      group.style.display = course.includes(query) ? "block" : "none";
    });
  });
});
  const resetButton = document.querySelector(".reset-button");
resetButton.addEventListener("click", () => {
  searchInput.value = "";
  groups.forEach(group => group.style.display = "block");
});

  document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.querySelector(".search-button");
  const searchInput = document.querySelector(".search-input");
  const groups = document.querySelectorAll(".group");

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim().toUpperCase();

    groups.forEach(group => {
      const course = group.dataset.course.toUpperCase();
      group.style.display = course.includes(query) ? "block" : "none";
    });
  });
});

  fetchGroups();
});
