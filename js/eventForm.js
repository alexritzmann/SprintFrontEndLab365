
// eventForm.js
function setupEventForm() {
  const form = document.getElementById("event-form");
  const ticketTypeSelect = document.getElementById("ticket-type");
  const priceGroup = document.getElementById("price-group");
  const priceInput = document.getElementById("event-price");
  const taxInput = document.getElementById("event-tax");

  const seatSelectionGroup = document.createElement('div');
  seatSelectionGroup.className = 'form-group';
  seatSelectionGroup.innerHTML = `
      <label>Assentos Marcados</label>
      <div class="radio-group">
          <label>
              <input type="radio" name="hasSeats" id="hasSeats-yes" value="sim"> Sim
          </label>
          <label>
              <input type="radio" name="hasSeats" id="hasSeats-no" value="nao" checked> Não
          </label>
      </div>
      <div id="seat-quantity-group" style="display: none; margin-top: 10px;">
          <label for="seat-quantity" class="required">Quantidade de Assentos</label>
          <input type="number" id="seat-quantity" class="form-control" min="1" step="1">
      </div>
  `;

  const formGroups = form.querySelectorAll('.form-group');
  const lastFormGroup = formGroups[formGroups.length - 1];
  form.insertBefore(seatSelectionGroup, lastFormGroup);

  document.getElementById('hasSeats-yes').addEventListener('change', function() {
      document.getElementById('seat-quantity-group').style.display = 'block';
      document.getElementById('seat-quantity').required = true;
  });

  document.getElementById('hasSeats-no').addEventListener('change', function() {
      document.getElementById('seat-quantity-group').style.display = 'none';
      document.getElementById('seat-quantity').required = false;
      document.getElementById('seat-quantity').value = '';
  });

  function updatePriceFieldsState() {
    if (ticketTypeSelect.value === "gratuito") {
      priceInput.disabled = true;
      taxInput.disabled = true;
      priceInput.value = 0;
      taxInput.value = 0;
      priceInput.style.backgroundColor = "#3a3a3a";
      priceInput.style.cursor = "not-allowed";
      taxInput.style.backgroundColor = "#3a3a3a";
      taxInput.style.cursor = "not-allowed";
      document.querySelector('label[for="event-price"]').classList.add("disabled-label");
      document.querySelector('label[for="event-tax"]').classList.add("disabled-label");
    } else {
      priceInput.disabled = false;
      taxInput.disabled = false;
      priceInput.style.backgroundColor = "";
      priceInput.style.cursor = "";
      taxInput.style.backgroundColor = "";
      taxInput.style.cursor = "";
      document.querySelector('label[for="event-price"]').classList.remove("disabled-label");
      document.querySelector('label[for="event-tax"]').classList.remove("disabled-label");
      if (parseFloat(priceInput.value) === 0) priceInput.value = "";
      if (parseFloat(taxInput.value) === 0) taxInput.value = "";
    }
  }

  ticketTypeSelect.addEventListener("change", function () {
    priceGroup.style.display = "block";
    updatePriceFieldsState();
  });

  updatePriceFieldsState();

  document.getElementById("event-location").addEventListener("input", updateMapLink);

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateEventForm()) return;

    const imageInput = document.getElementById("event-image");
    if (!imageInput.files || !imageInput.files[0]) {
      alert("Por favor, selecione uma imagem para o evento");
      return;
    }

    let imageBase64 = "";
    try {
      imageBase64 = await convertImageToBase64(imageInput.files[0]);
    } catch (error) {
      console.error("Erro ao converter a imagem:", error);
      alert("Erro ao processar a imagem. Tente novamente.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      name: document.getElementById("event-name").value,
      description: document.getElementById("event-description").value,
      location: document.getElementById("event-location").value,
      type: document.getElementById("event-type").value,
      date: document.getElementById("event-date").value,
      ticketType: document.getElementById("ticket-type").value,
      price: document.getElementById("ticket-type").value === "pago"
        ? parseFloat(document.getElementById("event-price").value)
        : 0,
      tax: parseFloat(document.getElementById("event-tax").value),
      rating: document.getElementById("event-rating").value,
      image: imageBase64,
      comments: Math.floor(Math.random() * 200),
      purchased: false,
      likes: 0,
      hasSeats: document.getElementById('hasSeats-yes').checked,
      totalSeats: document.getElementById('hasSeats-yes').checked ? 
        parseInt(document.getElementById('seat-quantity').value) : 0,
      bookedSeats: []
    };

    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push(newEvent);
    localStorage.setItem("events", JSON.stringify(events));
    document.getElementById("add-event-modal").classList.remove("active");
    updateEvents();
    form.reset();
    ticketTypeSelect.value = "";
    document.getElementById("event-type").value = "";
    document.getElementById('hasSeats-no').checked = true;
    document.getElementById('seat-quantity-group').style.display = 'none';
    updatePriceFieldsState();
    alert("Evento cadastrado com sucesso!");
  });
}

function validateEventForm() {
  const eventType = document.getElementById("event-type").value;
  const ticketType = document.getElementById("ticket-type").value;
  const price = document.getElementById("event-price").value;
  const tax = document.getElementById("event-tax").value;
  const hasSeats = document.getElementById('hasSeats-yes').checked;
  const seatQuantity = document.getElementById('seat-quantity').value;
  let isValid = true;

  document.querySelectorAll(".error-message").forEach(el => el.remove());
  
  if (!eventType) {
    showError("event-type", "Por favor, selecione um tipo de evento");
    isValid = false;
  }
  
  if (!ticketType) {
    showError("ticket-type", "Por favor, selecione um tipo de ingresso");
    isValid = false;
  }
  
  if (ticketType === "pago" && (!price || isNaN(price) || parseFloat(price) <= 0)) {
    showError("event-price", "Por favor, informe um preço válido");
    isValid = false;
  }
  
  if (!tax || isNaN(tax) || parseFloat(tax) < 0) {
    showError("event-tax", "Por favor, informe uma taxa válida");
    isValid = false;
  }
  
  // Validação do campo de assentos
  if (hasSeats && (!seatQuantity || isNaN(seatQuantity) || parseInt(seatQuantity) <= 0)) {
    showError("seat-quantity", "Por favor, informe uma quantidade válida de assentos");
    isValid = false;
  }
  
  return isValid;
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.style.color = "#f44336";
  errorElement.style.marginTop = "5px";
  errorElement.style.fontSize = "0.85rem";
  errorElement.textContent = message;
  
  field.parentNode.insertBefore(errorElement, field.nextSibling);
  field.style.borderColor = "#f44336";
  
  field.addEventListener("input", function() {
    field.style.borderColor = "#444";
    if (errorElement.parentNode) {
      errorElement.parentNode.removeChild(errorElement);
    }
  });
}

function updateMapLink() {
  const location = document.getElementById("event-location").value;
  const mapLink = document.getElementById("map-link");

  if (location) {
    const encodedLocation = encodeURIComponent(location);
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  } else {
    mapLink.href = "#";
  }
}

function setupImagePreview() {
  const customButton = document.querySelector(".custom-file-button");
  const fileInput = document.getElementById("event-image");
  const fileName = document.getElementById("file-name");
  const previewContainer = document.getElementById("image-preview");
  const previewImg = document.getElementById("preview-img");

  customButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", function() {
    const file = this.files[0];
    
    if (!file) {
      fileName.textContent = "Nenhum arquivo selecionado";
      previewContainer.style.display = "none";
      return;
    }
    
    if (!file.type.match("image.*")) {
      alert("Por favor, selecione um arquivo de imagem (JPG, PNG, etc.)");
      this.value = "";
      fileName.textContent = "Arquivo inválido - selecione uma imagem";
      previewContainer.style.display = "none";
      return;
    }
    
    fileName.textContent = file.name;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      previewImg.src = e.target.result;
      previewContainer.style.display = "block";
    }
    
    reader.readAsDataURL(file);
  });
}

function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

