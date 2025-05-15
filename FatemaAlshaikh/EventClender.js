// Base URL of the PHP backend API
const API_BASE = "https://aed35cbb-3531-4de2-96c8-b21d7b191527-00-1l2ypr9ke580q.pike.replit.dev/Api.php";

// Define event sections: Online, Live, and Outside, each with separate state tracking
const sections = [
  { id: "OnlineEvents", label: "Online Events", data: [], originalData: [], filtered: [], currentPage: 1 },
  { id: "LiveEvents", label: "Live Events", data: [], originalData: [], filtered: [], currentPage: 1 },
  { id: "OutsideEvents", label: "Outside Events", data: [], originalData: [], filtered: [], currentPage: 1 }
];
const eventsPerPage = 6; // Number of events to show per page
// Fetch events from the backend API and render them
async function fetchEventsFromAPI() {
  const loadingIndicator = document.createElement("div");
  loadingIndicator.id = "loadingIndicator";
  loadingIndicator.textContent = "Loading...";
  // Styling the loading indicator
  Object.assign(loadingIndicator.style, {
    position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
    background: "#fff", padding: "20px", borderRadius: "5px", fontSize: "1.5rem", zIndex: "1000"
  });
  document.body.appendChild(loadingIndicator);
  try {
    const response = await fetch(`${API_BASE}?action=get_events`);
    if (!response.ok) throw new Error("Failed to fetch data");
    const jsonData = await response.json();
    // Filter data into their respective sections and render them
    sections.forEach(section => {
      const list = jsonData.filter(e => e.category === section.id);
      section.data = list;
      section.originalData = [...list];
      section.filtered = [...list];
      renderSortOptions(section);
      renderEvents(section);
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    loadingIndicator.textContent = "Failed to load events. Please refresh.";
    loadingIndicator.style.background = "#ffe0e0";
    loadingIndicator.style.color = "#a00";
  } finally {
    setTimeout(() => document.getElementById("loadingIndicator")?.remove(), 300);
  }
}
// Render event cards for a section and handle pagination
function renderEvents(section) {
  const container = document.querySelector(`#${section.id} .cards`);
  const start = (section.currentPage - 1) * eventsPerPage;
  const pageItems = section.filtered.slice(start, start + eventsPerPage);
  container.innerHTML = pageItems.map(event => 
    `<div class="card" onclick="openModal('${section.id}', ${event.id})" style="opacity:0;transform:translateY(20px);transition:all .5s;">
      <img src="${event.img}" alt="${event.title}" />
      <div class="card-content">
        <div class="date"><h3>${event.date.split(' ')[0]}</h3><p>${event.date.split(' ')[1]}</p></div>
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <span>${event.location}</span>
        <button class="view-details">${event.buttonText}</button>
      </div>
    </div>`).join('');
  // Animate cards on appearance
  requestAnimationFrame(() => {
    document.querySelectorAll(`#${section.id} .card`).forEach(c => { c.style.opacity = 1; c.style.transform = 'translateY(0)'; });
  });
  renderPagination(section);
}
// Render sorting and filtering options for each section
function renderSortOptions(section) {
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';
  toolbar.style.display = 'flex';
  toolbar.style.flexWrap = 'wrap';
  toolbar.style.alignItems = 'center';
  toolbar.style.justifyContent = 'space-between';
  toolbar.style.margin = '1rem 0';
  toolbar.style.gap = '0.5rem';
  const label = document.createElement('h2');
  label.textContent = section.label;
  label.style.flex = '1 100%';
  toolbar.appendChild(label);
  // Sort dropdown
  const sortSelect = document.createElement('select');
  ['Default','Title (A-Z)','Date'].forEach((t,i) => {
    const opt = document.createElement('option');
    opt.value = ['default','title','date'][i];
    opt.textContent = `Sort by ${t}`;
    sortSelect.appendChild(opt);
  });
  // Sorting logic
  sortSelect.onchange = () => {
    const v = sortSelect.value;
    if (v==='title') section.filtered.sort((a,b)=>a.title.localeCompare(b.title));
    else if (v==='date') section.filtered.sort((a,b)=>new Date(a.date) - new Date(b.date));
    else section.filtered = [...section.originalData];
    section.currentPage = 1;
    renderEvents(section);
  };
  toolbar.appendChild(sortSelect);
  // Helper to create input boxes for search
  const makeInput = (cls,ph) => {
    const inp=document.createElement('input'); 
    inp.className=cls; 
    inp.placeholder=ph; 
    inp.style.flex='1'; 
    inp.oninput = ()=>handleSearch(section.id); 
    return inp;
  };
  toolbar.appendChild(makeInput('search-title','Search title...'));
  toolbar.appendChild(makeInput('search-location','Search location...'));
  toolbar.appendChild(makeInput('search-date','Search date...'));
  const secEl = document.getElementById(section.id);
  secEl.insertBefore(toolbar, secEl.firstChild);
}
// Filter events based on title, location, or date input
function handleSearch(id) {
  const sec = sections.find(s=>s.id===id);
  const {value: t} = document.querySelector(`#${id} .search-title`);
  const {value: l} = document.querySelector(`#${id} .search-location`);
  const {value: d} = document.querySelector(`#${id} .search-date`);
  sec.filtered = sec.data.filter(ev =>
    ev.title.toLowerCase().includes(t.toLowerCase()) &&
    ev.location.toLowerCase().includes(l.toLowerCase()) &&
    ev.date.toLowerCase().includes(d.toLowerCase())
  );
  sec.currentPage = 1;
  renderEvents(sec);
}
// Render pagination buttons
function renderPagination(section) {
  const wrapper = document.querySelector(`#${section.id} .cards`).parentElement;
  wrapper.querySelector('#paginationContainer')?.remove();
  const total = Math.ceil(section.filtered.length/eventsPerPage);
  const pag = document.createElement('div'); pag.id='paginationContainer'; pag.style.textAlign='center'; pag.style.margin='1rem';
  for(let i=1;i<=total;i++){
    const btn=document.createElement('button'); btn.textContent=i; btn.style.margin='0 .3rem';
    btn.style.backgroundColor = i===section.currentPage?'#555':'#ccc'; btn.style.color = '#fff';
    btn.onclick=()=>{section.currentPage=i;renderEvents(section);}; pag.appendChild(btn);
  }
  wrapper.appendChild(pag);
}
// Display event details in a modal popup
function openModal(sectionId,id){
  const ev=sections.find(s=>s.id===sectionId).data.find(x=>x.id===id);
  if(!ev)return;
  const m=document.createElement('div'); m.id='eventModal'; Object.assign(m.style,{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center'});
  m.innerHTML=`<div style="background:#fff;padding:2rem;border-radius:1rem;max-width:400px;position:relative;">
    <button onclick="closeModal()" style="position:absolute;top:10px;right:15px;background:red;color:#fff;border:none;border-radius:50%;width:30px;height:30px;cursor:pointer;">×</button>
    <h2>${ev.title}</h2><img src="${ev.img}" alt="${ev.title}" style="width:100%;margin:1rem 0;" />
    <p>${ev.description}</p><p><strong>Date:</strong> ${ev.date}</p><p><strong>Location:</strong> ${ev.location}</p>
  </div>`;
  document.body.appendChild(m); document.body.style.overflow='hidden';
}
// Close the modal popup
function closeModal(){
  document.getElementById('eventModal')?.remove();
  document.body.style.overflow='auto';
}
// DOMContentLoaded: fetch all events once page is loaded
document.addEventListener('DOMContentLoaded', fetchEventsFromAPI);