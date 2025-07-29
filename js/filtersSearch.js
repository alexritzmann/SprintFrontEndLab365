
// filtersSearch.js
let currentFilter = "all";

function filterEvents(filterType) {
  currentPage = 1;
  currentFilter = filterType;
  isSearchActive = false;
  searchTerm = "";
  
  if (filterType === "all") {
    displayFeaturedEvents(allEvents);
  } else {
    const filteredEvents = allEvents.filter(event => event.type === filterType);
    displayFeaturedEvents(filteredEvents);
  }
}

function searchEvents(term) {
  searchTerm = term.toLowerCase().trim();
  isSearchActive = searchTerm !== "";
  
  if (!isSearchActive) {
    displayFeaturedEvents(allEvents);
    return;
  }

  const results = allEvents.filter(event => 
    event.name.toLowerCase().includes(searchTerm) || 
    event.type.toLowerCase().includes(searchTerm)
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

