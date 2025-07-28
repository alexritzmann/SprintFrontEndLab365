
// main.js
document.addEventListener("DOMContentLoaded", function () {
  initializeEvents();
  const events = JSON.parse(localStorage.getItem("events")) || sampleEvents;
  
  document.getElementById("load-more-btn").addEventListener("click", loadMoreEvents);
  initCarousel(events);
  setupFilters();
  setupActionButtons();
  setupEventForm();
  updateMapLink();
  setupImagePreview();
  filterEvents(currentFilter);
});


document.getElementById('featured-events').addEventListener('click', function(e) {
  const likeBtn = e.target.closest('.like-btn');
  if (likeBtn) {
    const eventId = parseInt(likeBtn.dataset.id);
    likeEvent(eventId);
    return;
  }

  const viewDetailBtn = e.target.closest('.view-detail');
  if (viewDetailBtn) {
    const eventId = parseInt(viewDetailBtn.dataset.id);
    showEventDetails(eventId);
  }
});

