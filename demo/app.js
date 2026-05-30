// Mock data matching Pydantic / OpenAPI schema requirements
const SCULPTURES_DATA = [
  {
    id: "234e5678-e89b-12d3-a456-426614174001",
    name: "La Novia Dulce",
    artist: "Lorena Espitia",
    year: 2006,
    latitude: 3.450143,
    longitude: -76.533282,
    status: "on-site",
    image: "assets/la_novia_dulce.png",
    description: "Decorated with sweets and candies representing Cali's culinary traditions. This bride is a homage to the traditional 'Macetas' given to godchildren every June.",
    unlocked_content: "Cultural Oracle Insight: Lorena Espitia used bright fiberglass modeling to create a tactile sense of Colombian sugar candies. The sculpture is traditionally positioned near the river to evoke Cali's warm breeze carrying sweet aromas.",
    captured: false,
    audio_url: "https://cdn.gatos.cali.gov.co/audio/novia_dulce.mp3"
  },
  {
    id: "234e5678-e89b-12d3-a456-426614174002",
    name: "La Gata Ceremonial",
    artist: "José Horacio Martínez",
    year: 2006,
    latitude: 3.451600,
    longitude: -76.532600,
    status: "moved",
    image: "assets/la_gata_ceremonial.png",
    description: "A dark sculpture featuring intricate pre-Columbian gold patterns. It represents the ancestral heritage, jaguar spirits, and mythological elements of Southwest Colombia.",
    unlocked_content: "Cultural Oracle Insight: The gold motifs are inspired by Calima culture gold artifacts. Its temporary relocation due to civic repairs on the Boulevard has triggered consensus recalculation, verifying its new spot 150m north.",
    captured: false,
    audio_url: "https://cdn.gatos.cali.gov.co/audio/gata_ceremonial.mp3"
  },
  {
    id: "234e5678-e89b-12d3-a456-426614174003",
    name: "La Gata Ilustrada",
    artist: "Lucy Tejada",
    year: 2006,
    latitude: 3.452600,
    longitude: -76.532000,
    status: "on-site",
    image: "assets/la_gata_ilustrada.png",
    description: "A whimsical tribute decorated with open books, flying musical notes, and colorful abstract silhouettes of dancing people. Created by the pioneer female artist Lucy Tejada.",
    unlocked_content: "Cultural Oracle Insight: Lucy Tejada painted this cat as a reminder of Cali's literary and artistic renaissance in the mid-20th century. It features references to the Cali Group writers and traditional local salsa music.",
    captured: false,
    audio_url: "https://cdn.gatos.cali.gov.co/audio/gata_ilustrada.mp3"
  }
];

let map;
let markers = [];
let selectedSculpture = null;
let currentFilter = 'all';

// Initialize Map
function initMap() {
  // Center on Cali Gato monument area
  map = L.map('map', {
    zoomControl: false,
    attributionControl: false
  }).setView([3.4516, -76.5325], 16);

  // Add zoom control at bottom-right
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map);

  // CartoDB Dark Matter tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 20
  }).addTo(map);

  renderMarkers();
}

// Render Leaflet Markers
function renderMarkers() {
  // Clear existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  SCULPTURES_DATA.forEach(sculpture => {
    // Skip if doesn't match filter
    if (currentFilter !== 'all' && sculpture.status !== currentFilter) {
      return;
    }

    // Custom glowing icon
    const customIcon = L.divIcon({
      html: `<div class="custom-pin">
               <div class="pin-glow status-${sculpture.status}"></div>
             </div>`,
      className: 'leaflet-custom-marker-wrapper',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker([sculpture.latitude, sculpture.longitude], { icon: customIcon })
      .addTo(map)
      .on('click', () => {
        selectSculpture(sculpture);
        map.setView([sculpture.latitude, sculpture.longitude], 17, { animate: true });
      });

    markers.push(marker);
  });
}

// Render Sculpture Cards in List
function renderCards() {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';
  
  let count = 0;

  SCULPTURES_DATA.forEach(sculpture => {
    if (currentFilter !== 'all' && sculpture.status !== currentFilter) {
      return;
    }
    
    count++;

    const card = document.createElement('div');
    card.className = `sculpture-card ${selectedSculpture && selectedSculpture.id === sculpture.id ? 'selected' : ''}`;
    card.innerHTML = `
      <img src="${sculpture.image}" alt="${sculpture.name}" class="card-thumb">
      <div class="card-info">
        <span class="card-title">${sculpture.name}</span>
        <span class="card-artist">${sculpture.artist}</span>
        <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px;">
          <span class="status-badge status-${sculpture.status}">${capitalize(sculpture.status)}</span>
          ${sculpture.captured ? '<span class="status-badge status-on-site" style="background:rgba(16,185,129,0.1);"><i class="fa-solid fa-circle-check"></i> Captured</span>' : ''}
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      selectSculpture(sculpture);
      map.setView([sculpture.latitude, sculpture.longitude], 17, { animate: true });
    });

    container.appendChild(card);
  });

  document.getElementById('list-count').textContent = `${count} matching`;
}

// Select a sculpture & display detail view
function selectSculpture(sculpture) {
  selectedSculpture = sculpture;
  
  // Toggle sidebar panel views
  document.getElementById('sidebar-default').style.display = 'none';
  document.getElementById('sidebar-detail').style.display = 'flex';

  // Fill in data
  document.getElementById('detail-img').src = sculpture.image;
  document.getElementById('detail-title').textContent = sculpture.name;
  document.getElementById('detail-artist').textContent = sculpture.artist;
  document.getElementById('detail-year').textContent = sculpture.year;
  document.getElementById('detail-desc').textContent = sculpture.description;

  const statusBadge = document.getElementById('detail-status');
  statusBadge.className = `status-badge status-${sculpture.status}`;
  statusBadge.textContent = capitalize(sculpture.status);

  // Render Lock/Unlock Checkin box
  renderCheckInArea(sculpture);

  // Update card selected status
  renderCards();
}

// Render Lock check-in box based on captured state
function renderCheckInArea(sculpture) {
  const container = document.getElementById('checkin-container');
  container.innerHTML = '';

  if (sculpture.captured) {
    container.innerHTML = `
      <div class="unlocked-box">
        <div class="unlocked-header">
          <i class="fa-solid fa-lock-open"></i> Sighting Captured & Unlocked
        </div>
        <p>${sculpture.unlocked_content}</p>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="locked-box">
        <p style="margin-bottom: 12px; color: var(--text-secondary);">
          <i class="fa-solid fa-lock" style="margin-right: 6px;"></i> 
          Historical insights & media are locked. Capture this Gata on-site to unlock.
        </p>
        <button class="checkin-btn" id="start-checkin-btn" style="width: 100%;">
          <i class="fa-solid fa-camera"></i> Verify Sighting (Check-in)
        </button>
      </div>
    `;

    document.getElementById('start-checkin-btn').addEventListener('click', () => {
      triggerCheckInSimulation(sculpture);
    });
  }
}

// Trigger Checkin Modal simulation
function triggerCheckInSimulation(sculpture) {
  const modal = document.getElementById('checkin-modal');
  const viewImg = document.getElementById('viewfinder-img');
  const modalTitle = document.getElementById('modal-sculpture-title');
  const logs = document.getElementById('scan-logs');

  modalTitle.textContent = `Verifying ${sculpture.name}`;
  viewImg.src = sculpture.image;
  logs.innerHTML = '';

  // Show modal
  modal.classList.add('active');

  // Logs sequence simulation
  const steps = [
    { text: '[INIT] Contacting Hybrid Recognition Service...', delay: 0 },
    { text: '[GPS] Acquiring coordinates: latitude: ' + sculpture.latitude.toFixed(4) + ', longitude: ' + sculpture.longitude.toFixed(4) + '...', delay: 600 },
    { text: '[GPS] Lock established. Within 2.4 meters threshold.', delay: 1200, success: true },
    { text: '[VISION] Comparing photo vector embeddings with pgvector dataset...', delay: 1800 },
    { text: '[VISION] Match found. Similarity threshold: 0.941 > 0.85.', delay: 2400, success: true },
    { text: '[ORACLE] Consensus engine: Verification success.', delay: 3000 }
  ];

  steps.forEach(step => {
    setTimeout(() => {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      
      let icon = '';
      if (step.success !== undefined) {
        icon = step.success ? '<i class="fa-solid fa-circle-check" style="color:var(--success-color);"></i>' : '<i class="fa-solid fa-circle-xmark" style="color:var(--danger-color);"></i>';
      } else {
        icon = '<div class="log-spinner"></div>';
      }

      // If it's a loading log, remove spinner from previous logs
      const spinners = logs.querySelectorAll('.log-spinner');
      spinners.forEach(s => s.replaceWith(document.createTextNode('✓')));

      entry.innerHTML = `${icon} <span>${step.text}</span>`;
      logs.appendChild(entry);

      // Auto-scroll logs
      logs.scrollTop = logs.scrollHeight;
    }, step.delay);
  });

  // End of simulation -> Show Success card
  setTimeout(() => {
    renderSuccessScreen(sculpture);
  }, 3800);
}

// Render Success screen in modal body
function renderSuccessScreen(sculpture) {
  const modalBody = document.getElementById('modal-body-content');
  
  // Save original body to restore later
  if (!window.originalModalBodyHTML) {
    window.originalModalBodyHTML = modalBody.innerHTML;
  }

  // Trigger Canvas Confetti
  triggerConfetti();

  modalBody.innerHTML = `
    <div class="success-card">
      <div class="success-icon">
        <i class="fa-solid fa-cat"></i>
      </div>
      <h2 class="success-title">Sighting Validated!</h2>
      <div class="success-badge-reward">
        <i class="fa-solid fa-award"></i>
        <span>Unlocked Badge: ${sculpture.name} Capture</span>
      </div>
      <div class="similarity-metric">
        Recognition Match Score: <span class="val">94.1%</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 320px; line-height: 1.4;">
        GPS proximity and vector identity matching completed. Trust score validated. Cultural Oracle content unlocked!
      </p>
      <button class="close-success-btn" id="finish-checkin-btn">
        Access Cultural Content
      </button>
    </div>
  `;

  document.getElementById('finish-checkin-btn').addEventListener('click', () => {
    // Capture state update
    sculpture.captured = true;
    updateCapturedStats();

    // Close modal & reset layout
    closeCheckInModal();
    
    // Refresh detail view
    selectSculpture(sculpture);
  });
}

function closeCheckInModal() {
  const modal = document.getElementById('checkin-modal');
  modal.classList.remove('active');
  
  // Restore original body structure after transition completes
  setTimeout(() => {
    const modalBody = document.getElementById('modal-body-content');
    if (window.originalModalBodyHTML) {
      modalBody.innerHTML = window.originalModalBodyHTML;
    }
  }, 300);
}

function updateCapturedStats() {
  const count = SCULPTURES_DATA.filter(s => s.captured).length;
  document.getElementById('captured-count').textContent = count;
}

function triggerConfetti() {
  const duration = 2 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff5e62', '#ff9966', '#10b981']
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff5e62', '#ff9966', '#10b981']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

// Utility Helper
function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Event Listeners
document.getElementById('detail-back-btn').addEventListener('click', () => {
  document.getElementById('sidebar-detail').style.display = 'none';
  document.getElementById('sidebar-default').style.display = 'flex';
  selectedSculpture = null;
  renderCards();
});

document.getElementById('close-modal').addEventListener('click', closeCheckInModal);

// Filter pills interaction
document.querySelectorAll('.filter-pill').forEach(pill => {
  pill.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    e.target.classList.add('active');
    
    currentFilter = e.target.dataset.status;
    renderCards();
    renderMarkers();
  });
});

// Audio Player Mock toggle play
let audioPlaying = false;
document.getElementById('audio-play').addEventListener('click', (e) => {
  const icon = e.currentTarget.querySelector('i');
  const progressBar = document.querySelector('.audio-progress-bar');
  
  if (audioPlaying) {
    icon.className = 'fa-solid fa-play';
    audioPlaying = false;
    progressBar.style.animation = 'none';
  } else {
    icon.className = 'fa-solid fa-pause';
    audioPlaying = true;
    // Simulate progression bar movement
    progressBar.style.animation = 'audioPlaySim 133s linear infinite';
  }
});

// Add dynamic CSS style for simulating audio player progress bar
const audioStyle = document.createElement('style');
audioStyle.innerHTML = `
  @keyframes audioPlaySim {
    0% { width: 35%; }
    100% { width: 100%; }
  }
`;
document.head.appendChild(audioStyle);

// Load everything on startup
window.addEventListener('DOMContentLoaded', () => {
  initMap();
  renderCards();
  updateCapturedStats();
});
