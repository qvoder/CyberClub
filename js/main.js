async function loadHero() {
    const heroPlaceholder = document.getElementById('hero-placeholder');
    if (!heroPlaceholder) return;

    try {
        const response = await fetch('components/hero.html');
        const html = await response.text();
        heroPlaceholder.innerHTML = html;
        const btn = document.getElementById('open-booking-btn');
        if (btn && typeof initBookingPopup === 'function') {
            initBookingPopup(); 
        }
    } catch (err) {
        console.error('Ошибка загрузки Hero:', err);
    }
}

document.addEventListener('DOMContentLoaded', loadHero);