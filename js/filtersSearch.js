

function filterEvents(filterType) {
  currentPage = 1;
  
  if (filterType === "all") {
    displayFeaturedEvents(allEvents);
  } else {
    const filteredEvents = allEvents.filter(event => event.type === filterType);
    displayFeaturedEvents(filteredEvents);
  }
}

function searchEvents(searchTerm) {
  currentPage = 1;
  const term = searchTerm.toLowerCase().trim();
  
  if (!term) {
    displayFeaturedEvents(allEvents);
    return;
  }

  const results = allEvents.filter(event => 
    event.name.toLowerCase().includes(term) || 
    event.type.toLowerCase().includes(term)
  );

  displayFeaturedEvents(results, true);
}

function setupFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      filterBtns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      const filterType = this.dataset.filter;
      filterEvents(filterType);
    });
  });
}

