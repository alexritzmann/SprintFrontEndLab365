
// eventDetails.js
function showEventDetails(eventId) {
  const events = JSON.parse(localStorage.getItem("events")) || sampleEvents;
  const event = events.find(e => e.id === eventId);
  
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
      <button class="btn-close">Fechar</button>
    </div>
  `;

  if (!event.purchased) {
    const detailButtons = document.querySelector('.detail-buttons');
    
    if (event.hasSeats && event.totalSeats > 0) {
      detailsContent.innerHTML += `
        <div class="seats-container">
          <div class="seat-label">Selecione seus assentos:</div>
          <div class="seats-grid" id="seats-grid"></div>
          <button class="btn-buy" id="btn-select-seats" disabled>Selecionar Assentos</button>
        </div>
      `;
      
      generateSeatsGrid(event);

      document.getElementById('btn-select-seats').addEventListener('click', function() {
      const selectedSeats = document.querySelectorAll('.seat.selected');
      const seatNumbers = Array.from(selectedSeats).map(seat => parseInt(seat.dataset.seat));
      
      let events = JSON.parse(localStorage.getItem('events')) || [];
      const eventIndex = events.findIndex(e => e.id === event.id);
      
      if (eventIndex !== -1) {
          events[eventIndex].bookedSeats = [...events[eventIndex].bookedSeats, ...seatNumbers];
          
          localStorage.setItem('events', JSON.stringify(events));
          
          alert(`Assentos ${seatNumbers.join(', ')} reservados com sucesso!`);
          
          document.getElementById('event-detail-modal').classList.remove('active');
      }});
      const buyBtn = document.getElementById('btn-buy-ticket');
    if (buyBtn) buyBtn.style.display = 'none';

  } else {
      const buyButton = document.createElement('button');
      buyButton.className = 'btn-buy';
      buyButton.id = 'btn-buy-ticket';
      buyButton.dataset.id = event.id;
      buyButton.textContent = 'Comprar Ingresso';
      
      detailButtons.insertBefore(buyButton, detailButtons.querySelector('.btn-close'));
    }
  }


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
  
  const buyBtn = document.getElementById('btn-buy-ticket');
  if (buyBtn) {
    buyBtn.addEventListener('click', function() {
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

function generateSeatsGrid(event) {
    if (!event.hasSeats || event.totalSeats <= 0) return;

  const seatsGrid = document.getElementById('seats-grid');
  if (!seatsGrid) return;
  
  seatsGrid.innerHTML = '';

    
    for (let i = 1; i <= event.totalSeats; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.dataset.seat = i;
        seat.textContent = i;
        
        if (event.bookedSeats.includes(i)) {
            seat.classList.add('booked');
            seat.title = 'Assento reservado';
        } else {
            seat.addEventListener('click', function() {
                this.classList.toggle('selected');
                updateSelectedSeats(event);
            });
        }
        
        seatsGrid.appendChild(seat);
    }
}

function updateSelectedSeats(event) {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const btnSelect = document.getElementById('btn-select-seats');
    
    btnSelect.disabled = selectedSeats.length === 0;
    btnSelect.textContent = selectedSeats.length > 0 ? 
        `Comprar ${selectedSeats.length} ingresso(s)` : 'Selecionar Assentos';
}
