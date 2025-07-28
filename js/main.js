
// main.js
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

