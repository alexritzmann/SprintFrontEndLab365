

function likeEvent(eventId) {
  let events = JSON.parse(localStorage.getItem("events")) || [];
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex !== -1) {
    events[eventIndex].likes++;
    localStorage.setItem("events", JSON.stringify(events));
    updateLikeCounts(eventId, events[eventIndex].likes);
    
    const likeBtn = document.querySelector(`.like-btn[data-id="${eventId}"]`);
    const likeBtnDetail = document.querySelector(`.like-btn-detail[data-id="${eventId}"]`);
    
    if (likeBtn) {
      likeBtn.classList.add("liked");
      const icon = likeBtn.querySelector("i");
      if (icon) icon.classList.add("liked");
      
      setTimeout(() => {
        likeBtn.classList.remove("liked");
      }, 500);
    }
    
    if (likeBtnDetail) {
      likeBtnDetail.classList.add("liked");
      const icon = likeBtnDetail.querySelector("i");
      if (icon) icon.classList.add("liked");
      
      setTimeout(() => {
        likeBtnDetail.classList.remove("liked");
      }, 500);
    }
    
    const featuredContainer = document.getElementById("featured-events");
    if (featuredContainer) {
      displayFeaturedEvents(events);
    }
    
    return true;
  }
  return false;
}

function updateLikeCounts(eventId, newCount) {
  const cardCounters = document.querySelectorAll(`.like-btn[data-id="${eventId}"] .like-count`);
  cardCounters.forEach(counter => {
    counter.textContent = newCount;
    counter.classList.add("liked");
    setTimeout(() => counter.classList.remove("liked"), 500);
  });
  
  const detailCounter = document.querySelector(`#event-detail-content .like-count`);
  if (detailCounter) {
    detailCounter.textContent = newCount;
    detailCounter.classList.add("liked");
    setTimeout(() => detailCounter.classList.remove("liked"), 500);
  }
  
  const carouselCounter = document.querySelector(`.carousel-item .like-count[data-id="${eventId}"]`);
  if (carouselCounter) {
    carouselCounter.textContent = newCount;
    carouselCounter.classList.add("liked");
    setTimeout(() => carouselCounter.classList.remove("liked"), 500);
  }
}

function showRemoveEventsModal(page) {
  const modal = document.getElementById("remove-events-modal");
  modal.classList.add("active");
  
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const perPage = 15;
  const totalPages = Math.ceil(events.length / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedEvents = events.slice(startIndex, startIndex + perPage);
  
  let html = "";
  
  if (paginatedEvents.length === 0) {
    html = "<p>Nenhum evento cadastrado.</p>";
  } else {
    html = '<div class="remove-list">';
    paginatedEvents.forEach(event => {
      const formattedDate = formatDate(event.date);
      html += `
        <div class="remove-item">
          <div class="remove-item-image" style="background-image: url('${event.image}')"></div>
          <div class="remove-item-content">
            <h3 class="remove-item-title">${event.name}</h3>
            <p class="remove-item-date">${formattedDate}</p>
          </div>
          <div class="remove-item-actions">
            <button class="btn-remove-item" data-id="${event.id}">Excluir</button>
          </div>
        </div>
      `;
    });
    html += "</div>";
  }
  
  let paginationHtml = "";
  if (totalPages > 1) {
    paginationHtml = '<div class="pagination">';
    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `<button class="page-btn ${i === page ? "active" : ""}" data-page="${i}">${i}</button>`;
    }
    paginationHtml += "</div>";
  }
  
  document.getElementById("remove-events-container").innerHTML = html;
  document.getElementById("pagination").innerHTML = paginationHtml;
  
  document.querySelectorAll(".btn-remove-item").forEach(btn => {
    btn.addEventListener("click", function() {
      const eventId = parseInt(this.dataset.id);
      removeEvent(eventId);
    });
  });
  
  document.querySelectorAll(".page-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const page = parseInt(this.dataset.page);
      showRemoveEventsModal(page);
    });
  });
}

function removeEvent(eventId) {
  let events = JSON.parse(localStorage.getItem("events")) || [];
  const initialLength = events.length;
  
  events = events.filter(event => event.id !== eventId);
  
  if (events.length !== initialLength) {
    localStorage.setItem("events", JSON.stringify(events));
    updateEvents();
    const activePage = document.querySelector(".page-btn.active")?.dataset.page || 1;
    showRemoveEventsModal(parseInt(activePage));
    alert("Evento removido com sucesso!");
  }
}

