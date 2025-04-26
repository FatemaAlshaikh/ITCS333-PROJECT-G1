const sections = [
    { id: "OnlineEvents", data: [], originalData: [], filtered: [], currentPage: 1 },
    { id: "LiveEvents", data: [], originalData: [], filtered: [], currentPage: 1 },
    { id: "OutsideEvents", data: [], originalData: [], filtered: [], currentPage: 1 }
  ];
  const eventsPerPage = 6;
  async function fetchEvents() {
    const loadingIndicator = document.createElement("div");
    loadingIndicator.id = "loadingIndicator";
    loadingIndicator.textContent = "Loading...";
    Object.assign(loadingIndicator.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#fff",
      padding: "20px",
      borderRadius: "5px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      fontSize: "1.5rem",
      zIndex: "1000"
    });
    document.body.appendChild(loadingIndicator);
    try {
      const sectionsToLoad = [];
      for (const section of sections) {
        const eventSection = document.querySelector(`#${section.id} .cards`);
        if (!eventSection) continue;
        const cards = eventSection.querySelectorAll(".card");
        const events = Array.from(cards).map((card, index) => {
          const title = card.querySelector("h3")?.textContent || `Event ${index + 1}`;
          const description = card.querySelector("p")?.textContent || "No description available.";
          const dateMonth = card.querySelector(".date h3")?.textContent || "May";
          const dateDay = card.querySelector(".date p")?.textContent || (index + 1).toString();
          const date = `${dateMonth} ${dateDay}`;
          const img = card.querySelector("img")?.getAttribute("src") || "meeting-04.png";
          const location = card.querySelector("span")?.textContent || "University of Technology";
          const buttonText = card.querySelector("button")?.textContent || "View Details";
          return { id: index + 1, title, description, date, img, location, buttonText };
        });
        section.data = events;
        section.originalData = [...events];
        section.filtered = [...events];
  
        sectionsToLoad.push(section);
      }
      for (const section of sectionsToLoad) {
        renderSortOptions(section);
        renderEvents(section);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      loadingIndicator.textContent = "Failed to load events. Please refresh the page.";
      loadingIndicator.style.background = "#ffe0e0";
      loadingIndicator.style.color = "#a00";
    } finally {
      setTimeout(() => {
        const loader = document.getElementById("loadingIndicator");
        if (loader) loader.remove();
      }, 300);
    }
  }  
  function renderEvents(section) {
    const eventSection = document.querySelector(`#${section.id} .cards`);
    const start = (section.currentPage - 1) * eventsPerPage;
    const paginatedEvents = section.filtered.slice(start, start + eventsPerPage);
    eventSection.innerHTML = paginatedEvents.map(event =>
      `<div class="card" style="opacity: 0; transform: translateY(20px); transition: all 0.5s ease;" onclick="openModal('${section.id}', ${event.id})">
        <img src="${event.img}" alt="${event.title}">
        <div class="card-content">
          <div class="date">
            <h3>${event.date.split(" ")[0]}</h3>
            <p>${event.date.split(" ")[1]}</p>
          </div>
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          <button class="view-details">${event.buttonText}</button>
        </div>
        <span>${event.location}</span>
      </div>`
    ).join("");
    requestAnimationFrame(() => {
      document.querySelectorAll(`#${section.id} .card`).forEach(card => {
        card.style.opacity = 1;
        card.style.transform = "translateY(0)";
      });
    });
    renderPagination(section);
  }
  function handleSearch(sectionId) {
    const section = sections.find(s => s.id === sectionId);
    const input = document.querySelector(`#${sectionId} .search-container input`);
    const keyword = input.value.toLowerCase();
    section.filtered = section.data.filter(event => event.title.toLowerCase().includes(keyword));
    section.currentPage = 1;
    renderEvents(section);
  }
  function renderPagination(section) {
    const eventSection = document.querySelector(`#${section.id} .cards`);
    const oldPagination = document.querySelector(`#${section.id} #paginationContainer`);
    if (oldPagination) oldPagination.remove();
    const totalPages = Math.ceil(section.filtered.length / eventsPerPage);
    const paginationContainer = document.createElement("div");
    paginationContainer.id = "paginationContainer";
    paginationContainer.style.textAlign = "center";
    paginationContainer.style.marginTop = "2rem";
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      Object.assign(pageButton.style, {
        margin: "0 5px",
        padding: "0.5rem 1rem",
        borderRadius: "5px",
        border: "1px solid #888",
        backgroundColor: i === section.currentPage ? "#555" : "#ccc",
        color: i === section.currentPage ? "#fff" : "#000",
        cursor: "pointer",
        transition: "background-color 0.3s, color 0.3s"
      });
      pageButton.addEventListener("click", () => {
        section.currentPage = i;
        renderEvents(section);
      });
      paginationContainer.appendChild(pageButton);
    }
    eventSection.parentElement.appendChild(paginationContainer);
  }
  function renderSortOptions(section) {
    const sortContainer = document.createElement("div");
    sortContainer.className = "sort-container";
    sortContainer.style.textAlign = "center";
    sortContainer.style.marginBottom = "2rem";
    const select = document.createElement("select");
    select.style.padding = "0.5rem";
    select.style.fontSize = "1.4rem";
    const options = [
      { value: "default", text: "Sort by Default" },
      { value: "title", text: "Sort by Title (A-Z)" },
      { value: "date", text: "Sort by Date" }
    ];
    options.forEach(opt => {
      const optionElement = document.createElement("option");
      optionElement.value = opt.value;
      optionElement.textContent = opt.text;
      select.appendChild(optionElement);
    });
    select.addEventListener("change", (e) => {
      const value = e.target.value;
      if (value === "title") {
        section.filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else if (value === "date") {
        section.filtered.sort((a, b) => parseInt(a.date.split(" ")[1]) - parseInt(b.date.split(" ")[1]));
      } else {
        section.filtered = [...section.originalData];
      }
      section.currentPage = 1;
      renderEvents(section);
    });
    sortContainer.appendChild(select);
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search...";
    searchInput.style.marginLeft = "1rem";
    searchInput.style.padding = "0.5rem";
    searchInput.style.fontSize = "1.4rem";
    searchInput.addEventListener("input", () => handleSearch(section.id));
    sortContainer.appendChild(searchInput);
    const firstSection = document.querySelector(`#${section.id} .cards`);
    firstSection.parentElement.insertBefore(sortContainer, firstSection);
  }
  function openModal(sectionId, id) {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    const event = section.data.find(e => e.id === id);
    if (!event) return;
    const modal = document.createElement("div");
    modal.id = "eventModal";
    Object.assign(modal.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "1000",
      opacity: "0",
      transition: "opacity 0.4s"
    });
    modal.innerHTML = 
      `<div style="background: #fff; padding: 2rem; border-radius: 1rem; max-width: 400px; text-align: center; position: relative;">
        <button onclick="closeModal()" style="position: absolute; top: 10px; right: 15px; background: red; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">&times;</button>
        <img src="${event.img}" alt="${event.title}" style="width: 100%; border-radius: 0.5rem; margin-bottom: 1rem;">
        <h2>${event.title}</h2>
        <p>${event.description}</p>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Location:</strong> ${event.location}</p>
      </div>`;
    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      modal.style.opacity = "1";
    });
  }
  function closeModal() {
    const modal = document.getElementById("eventModal");
    if (modal) {
      modal.style.opacity = "0";
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = "auto";
      }, 400);
    }
  }
  const attendForm = document.querySelector("#Attend-Event form");
  if (attendForm) {
    attendForm.addEventListener("submit", function(e) {
      const nameField = attendForm.querySelector('input[name="name"]');
      const emailField = attendForm.querySelector('input[name="email"]');
      let valid = true;
      const previousErrors = attendForm.querySelectorAll(".error-message");
      previousErrors.forEach(error => error.remove());
      if (!nameField.value.trim()) {
        valid = false;
        showError(nameField, "Name is required");
      }
      if (!emailField.value.trim() || !validateEmail(emailField.value)) {
        valid = false;
        showError(emailField, "Please enter a valid email");
      }
      if (!valid) {
        e.preventDefault();
      }
    });
  }
  function showError(field, message) {
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.style.color = "red";
    errorMessage.style.fontSize = "1.2rem";
    errorMessage.textContent = message;
    field.style.borderColor = "red";
    field.style.borderWidth = "2px";
    field.insertAdjacentElement("afterend", errorMessage);
  }
  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }
  document.addEventListener("DOMContentLoaded", fetchEvents);
  