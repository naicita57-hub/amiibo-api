const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        // Muestra u oculta el menú
        mobileMenu.classList.toggle('hidden');
        
        // Alternar entre las 3 rayitas y la 'X'
        iconOpen.classList.toggle('hidden');
        iconClose.classList.toggle('hidden');
    });
}