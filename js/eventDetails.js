

function showEventDetails(eventId) {
  const events = JSON.parse(localStorage.getItem("events")) || sampleEvents;
  const event = events.find(e => e.id === eventId);
  
  if (!event) return;
  
  const formattedDate = formatDate(event.date);
  const priceDisplay = event.ticketType === "gratuito" ? 
    "Gratuito" : `R$ ${event.price.toFixed(2)} + taxa de ${event.tax}%`;
  
  const detailsContent = document.getElementById("event-detail-content");
  detailsContent.innerHTML = `
    <h2 class="modal-title">${event.name}</h2>
    <div class="event-detail-image" style="background-image: url('${event.image}')"></div>
    
    <div class="detail-info">
      <div class="detail-item">
        <i class="fas fa-calendar-alt"></i> ${formattedDate}
      </div>
      <div class="detail-item">
        <i class="fas fa-map-marker-alt"></i> ${event.location}
      </div>
      <div class="detail-item">
        <i class="fas fa-tag"></i> ${event.type}
      </div>
      <div class="detail-item">
        <i class="fas fa-ticket-alt"></i> ${priceDisplay}
      </div>
      <div class="detail-item">
        <i class="fas fa-user"></i> Classificação: ${event.rating}
      </div>
      <div class="detail-item">
        <i class="fas fa-heart"></i> 
        <span class="like-count">${event.likes}</span> curtidas
      </div>
    </div>
    
    <p class="detail-description">${event.description}</p>
    
    <div class="detail-buttons">
      <button class="like-btn-detail" data-id="${event.id}">
        <i class="fas fa-heart"></i> Curtir
      </button>
      <button class="btn-buy ${event.purchased ? "purchased" : ""}" 
              data-id="${event.id}">
        ${event.purchased ? "Ingresso Adquirido" : "Comprar Ingresso"}
      </button>
      <button class="btn-close">Fechar</button>
    </div>
  `;
  
  document.getElementById("event-detail-modal").classList.add("active");
  
  document.querySelector(".like-btn-detail").addEventListener("click", function() {
    const success = likeEvent(eventId);
    if (success) {
      const newLikes = event.likes + 1;
      event.likes = newLikes;
      
      const likeCounter = document.querySelector(`#event-detail-content .like-count`);
      if (likeCounter) {
        likeCounter.textContent = newLikes;
        likeCounter.classList.add("liked");
        setTimeout(() => likeCounter.classList.remove("liked"), 500);
      }
      
      this.classList.add("liked");
      const icon = this.querySelector("i");
      if (icon) icon.classList.add("liked");
      
      setTimeout(() => {
        this.classList.remove("liked");
        if (icon) icon.classList.remove("liked");
      }, 500);
    }
  });
  
  const buyBtn = document.querySelector(".btn-buy");
  if (!event.purchased) {
    buyBtn.addEventListener("click", function() {
      event.purchased = true;
      const events = JSON.parse(localStorage.getItem("events")) || [];
      const index = events.findIndex(e => e.id === event.id);
      if (index !== -1) {
        events[index].purchased = true;
        localStorage.setItem("events", JSON.stringify(events));
      }
      
      this.classList.add("purchased");
      this.textContent = "Ingresso Adquirido";
    });
  }
  
  document.querySelector(".btn-close").addEventListener("click", function() {
    document.getElementById("event-detail-modal").classList.remove("active");
  });
}

