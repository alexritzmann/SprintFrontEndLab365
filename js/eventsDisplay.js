
// eventsDisplay.js
let currentPage = 1;
const eventsPerPage = 100;
let isSearchActive = false;
let searchTerm = "";

function displayFeaturedEvents(events, isSearch = false) {
  const featuredContainer = document.getElementById('featured-events');
  
  if (currentPage === 1) {
    featuredContainer.innerHTML = '';
  }
  
  if (events.length === 0 && currentPage === 1) {
    featuredContainer.innerHTML = '<p class="no-events">Nenhum evento encontrado.</p>';
    return;
  }
  
  let eventsToDisplay = Array.isArray(events) ? [...events] : [];
  if (!isSearch) {
    eventsToDisplay = eventsToDisplay.sort((a, b) => b.likes - a.likes);
  }
  
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const paginatedEvents = eventsToDisplay.slice(startIndex, endIndex);
  
  paginatedEvents.forEach(event => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.dataset.id = event.id;
    
    card.innerHTML = `    
      <div class="event-image" style="background-image: url('${event.image}')"></div>
      <div class="event-content">
        <h3 class="event-title">${event.name}</h3>
        <div class="event-actions">
          <button class="like-btn" data-id="${event.id}">
            <i class="fas fa-heart"></i> 
            <span class="like-count">${event.likes}</span>
          </button>
          <button class="event-btn view-detail" data-id="${event.id}">Visualizar Detalhes</button>
        </div>
      </div>
      <div class="remove-overlay">
        <button class="remove-btn">Remover Evento</button>
      </div>
      ${event.hasSeats && event.totalSeats > 0 
        ? `<div class="event-seats">Assentos: ${event.totalSeats - (event.bookedSeats?.length || 0)}/${event.totalSeats} disponíveis</div>`
        : ''}
    `;
    
    featuredContainer.appendChild(card);
  });
  
  updateLoadMoreButton(events.length);
}

function updateLoadMoreButton(totalEvents) {
  const loadMoreBtn = document.getElementById('load-more-btn');
  const remainingEvents = totalEvents - (currentPage * eventsPerPage);
  
  if (remainingEvents > 0) {
    loadMoreBtn.style.display = 'block';
    loadMoreBtn.textContent = `Carregar Mais (${remainingEvents} eventos restantes)`;
  } else {
    loadMoreBtn.style.display = 'none';
  }
}

function loadMoreEvents() {
  currentPage++;
  
  if (isSearchActive) {
    const results = allEvents.filter(event => 
      event.name.toLowerCase().includes(searchTerm) || 
      event.type.toLowerCase().includes(searchTerm)
    );
    displayFeaturedEvents(results, true);
  } else if (currentFilter === "all") {
    displayFeaturedEvents(allEvents);
  } else {
    const filteredEvents = allEvents.filter(event => event.type === currentFilter);
    displayFeaturedEvents(filteredEvents);
  }
}

function updateEvents() {
  allEvents = JSON.parse(localStorage.getItem('events')) || sampleEvents;
  initCarousel(allEvents);
  
  if (isSearchActive) {
    searchEvents(searchTerm);
  } else if (currentFilter === "all") {
    displayFeaturedEvents(allEvents);
  } else {
    const filteredEvents = allEvents.filter(event => event.type === currentFilter);
    displayFeaturedEvents(filteredEvents);
  }
}

