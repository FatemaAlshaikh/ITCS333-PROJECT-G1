document.addEventListener("DOMContentLoaded", () => {
    const itemsContainer = document.querySelector(".row");
    const searchInput = document.querySelector("input[type='text']");
    const sortSelect = document.querySelector("select");
    const prevButton = document.querySelector(".btn-secondary");
    const nextButton = document.querySelector(".btn-primary");
  
    let items = [];
    let currentPage = 1;
    const itemsPerPage = 6;
  
    function showLoading() {
      itemsContainer.innerHTML = '<div class="text-center">Loading...</div>';
    }
  
    function showError() {
      itemsContainer.innerHTML = '<div class="text-danger text-center">Failed to load items.</div>';
    }
  
    function displayItems() {
      let filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchInput.value.toLowerCase())
      );
  
      if (sortSelect.value === "price-asc") {
        filteredItems.sort((a, b) => a.price - b.price);
      } else if (sortSelect.value === "price-desc") {
        filteredItems.sort((a, b) => b.price - a.price);
      } else if (sortSelect.value === "newest") {
        filteredItems.sort((a, b) => b.id - a.id);
      }
  
      const start = (currentPage - 1) * itemsPerPage;
      const paginatedItems = filteredItems.slice(start, start + itemsPerPage);
  
      itemsContainer.innerHTML = "";
      paginatedItems.forEach(item => {
        itemsContainer.innerHTML += `
          <div class="col">
            <div class="card text-center mx-auto" style="width: 25rem;">
              <img src="${item.image}" class="card-img-top" style="height: 300px; width: 100%; object-fit: contain; background-color: #f8f9fa;">
              <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text text-muted">Price: ${item.price} BD</p>
                <a href="itemDetail.html" class="btn btn-outline-primary" onclick="localStorage.setItem('selectedItem', '${item.id}')">View Details</a>
              </div>
            </div>
          </div>
        `;
      });
    }
  
    async function fetchItems() {
      showLoading();
      try {
        const response = await fetch('items.json');
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        items = data;
        displayItems();
      } catch (error) {
        showError();
      }
    }
  
    searchInput.addEventListener("input", () => {
      currentPage = 1;
      displayItems();
    });
  
    sortSelect.addEventListener("change", () => {
      currentPage = 1;
      displayItems();
    });
  
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        displayItems();
      }
    });
  
    nextButton.addEventListener("click", () => {
      const maxPage = Math.ceil(items.length / itemsPerPage);
      if (currentPage < maxPage) {
        currentPage++;
        displayItems();
      }
    });
  
    fetchItems();
  });
  
  
  