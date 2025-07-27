

document.addEventListener("DOMContentLoaded", function () {
  initializeEvents();
  document.getElementById("load-more-btn").addEventListener("click", loadMoreEvents);
  initCarousel(allEvents);
  setupFilters();
  setupActionButtons();
  setupEventForm();
  updateMapLink();
  setupImagePreview();
  displayFeaturedEvents(allEvents);
});

