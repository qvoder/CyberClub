document.addEventListener('DOMContentLoaded', () => {
    const tooltip = document.getElementById('map-tooltip');
    const tooltipImg = document.getElementById('tooltip-img');
    const tooltipNumber = document.getElementById('tooltip-number');

    const icons = document.querySelectorAll('#interactive-map circle[data-image]');

    icons.forEach(icon => {
        icon.style.cursor = 'pointer';

        icon.addEventListener('mouseenter', (e) => {

            tooltipImg.src = icon.dataset.image;
            tooltipNumber.textContent = icon.dataset.number || '';

            tooltip.style.display = 'block';
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
            tooltip.style.position = 'fixed';
            tooltip.style.left = (e.clientX + 30) + 'px';
            tooltip.style.top = (e.clientY + 30) + 'px';
            tooltip.style.zIndex = '9999';
        });

        icon.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });
});
