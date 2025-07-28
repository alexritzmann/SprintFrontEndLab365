
// carousel.js
function initCarousel(events) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const carouselItems = document.querySelectorAll(".carousel-item");
  const indicatorsContainer = document.getElementById("carousel-indicators");

  const futureEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  document.querySelector('.carousel').addEventListener('click', function(e) {
  if (e.target.closest('.view-detail')) {
    const eventId = parseInt(e.target.closest('.view-detail').dataset.id);
    showEventDetails(eventId);
  }
  });

  futureEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextEvents = futureEvents.slice(0, 5);
  indicatorsContainer.innerHTML = "";

  nextEvents.forEach((event, index) => {
    if (index < carouselItems.length) {
      const item = carouselItems[index];
      const formattedDate = formatDate(event.date);

      item.innerHTML = `
        <div class="carousel-image" style="background-image: url('${event.image}')"></div>
        <div class="carousel-content">
          <h3 class="carousel-title">${event.name}</h3>
          <div class="carousel-info">
            <div><i class="fas fa-calendar-alt"></i> ${formattedDate}</div>
            <div><i class="fas fa-map-marker-alt"></i> ${event.location}</div>
            <div><i class="fas fa-tag"></i> ${event.type}</div>
          </div>
          <button class="carousel-btn view-detail" data-id="${event.id}">Visualizar Detalhes</button>
        </div>
      `;

      const indicator = document.createElement("div");
      indicator.className = "indicator";
      if (index === 0) indicator.classList.add("active");
      indicator.dataset.index = index;
      indicatorsContainer.appendChild(indicator);
    }
  });

  startCarouselRotation();
}

function startCarouselRotation() {
  let currentIndex = 0;
  const items = document.querySelectorAll(".carousel-item");
  const indicators = document.querySelectorAll(".indicator");

  function rotateCarousel() {
    items.forEach((item) => item.classList.remove("active"));
    indicators.forEach((indicator) => indicator.classList.remove("active"));

    currentIndex = (currentIndex + 1) % items.length;
    items[currentIndex].classList.add("active");
    indicators[currentIndex].classList.add("active");
  }

  setInterval(rotateCarousel, 5000);

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", function () {
      items.forEach((item) => item.classList.remove("active"));
      indicators.forEach((ind) => ind.classList.remove("active"));

      items[index].classList.add("active");
      indicator.classList.add("active");
      currentIndex = index;
    });
  });
}

