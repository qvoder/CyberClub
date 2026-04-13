let isPopupLoaded = false;

async function loadBookingPopup() {
  if (isPopupLoaded) return;

  const res = await fetch('components/booking-popup/booking-popup.html');
  const html = await res.text();
  document.body.insertAdjacentHTML('beforeend', html);
  isPopupLoaded = true;

  setupPopupEvents();
}

function setupPopupEvents() {
  const popup = document.getElementById('booking-popup');
  const overlay = popup.querySelector('.booking-popup__overlay');

  overlay.addEventListener('click', () => closeBookingPopup());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('active')) {
      closeBookingPopup();
    }
  });
}

function openBookingPopup() {
  loadBookingPopup().then(() => {
    const popup = document.getElementById('booking-popup');
    popup.classList.add('active');
  });
}

function closeBookingPopup() {
  const popup = document.getElementById('booking-popup');
  if (!popup) return;

  popup.classList.add('closing');

  setTimeout(() => {
    popup.classList.remove('active');
    popup.classList.remove('closing');
  }, 350); 
}

window.openBookingPopup = openBookingPopup;
window.closeBookingPopup = closeBookingPopup;

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('open-booking-btn');
  if (btn) btn.addEventListener('click', openBookingPopup);
});