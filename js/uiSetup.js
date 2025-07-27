

function setupActionButtons() {
  document.getElementById("add-event-btn").addEventListener("click", function() {
    document.getElementById("add-event-modal").classList.add("active");
  });

  document.getElementById("remove-event-btn").addEventListener("click", function() {
    showRemoveEventsModal(1);
  });

  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", function() {
      this.closest(".modal").classList.remove("active");
    });
  });

  document.getElementById("search-btn").addEventListener("click", function() {
    const searchTerm = document.getElementById("search-input").value;
    searchEvents(searchTerm);
  });

  document.getElementById("search-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      document.getElementById("search-btn").click();
    }
  });
}

