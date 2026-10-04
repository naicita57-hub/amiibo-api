const buscador = document.querySelector('#search-input');
const carga = document.querySelector('#loader');
const error = document.querySelector('#error-message');
const boton = document.querySelector('#reintentar-btn');
const cardsDeJs = document.querySelector('#cards-container');
const modalBody = document.querySelector('#detailModalBody');
const btnModal = document.querySelector('#closeModalBtn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');
const formularioBusqueda = document.querySelector('#search-form');
const modalTitle = document.querySelector('#detailModalLabel');

const getAllAmiibo = async (url) => {
    const data = await fetchData(url);
    const items = data.amiibo;
    if (items) {
        localStorage.setItem("amiibos", JSON.stringify(items));
    }
    return items;
}

const showAmiibo = async (url) => {
    isLoading(true);
    cardsDeJs.innerHTML = '';

    const amiibos = await getAllAmiibo(url);

    if(!amiibos || amiibos.length === 0){
       const hayErrorDeRed = !document.querySelector('#error-message').classList.contains('hidden');
        if (!hayErrorDeRed) {
            document.querySelector('#no-results').classList.remove('hidden');
        }
        isLoading(false);
        return;
    }

    const limitAmiibos = amiibos.slice(0, 50);

    limitAmiibos.forEach(amiibo => {
        const amiiboId = `${amiibo.head}${amiibo.tail}`;

        const cardElement = document.createElement('article');
        cardElement.className = 'wii-card gap-2 bg-white border-2 border-gray-200 rounded-2xl p-4 transition flex flex-col justify-between';
        
        const imgContainer = document.createElement('div');
        imgContainer.className = 'w-full h-44 flex items-center justify-center rounded-xl p-2 mb-3';
        
        const imgElement = document.createElement('img');
        imgElement.src = amiibo.image;
        imgElement.alt = amiibo.name;
        imgElement.className = 'h-full object-contain';

        const titleElement = document.createElement('h3');
        titleElement.className = 'font-bold text-lg text-gray-800 text-center mb-3 truncate';
        titleElement.title = amiibo.name;
        titleElement.textContent = amiibo.name;

        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'flex justify-between items-center text-xs text-gray-500 bg-gray-100 border-glow rounded-lg px-2.5 py-1.5 mb-4';

        const seriesSpan = document.createElement('span');
        seriesSpan.className = 'font-semibold text-gray-700 truncate max-w-[55%]';
        seriesSpan.title = amiibo.amiiboSeries;
        seriesSpan.textContent = amiibo.amiiboSeries;

        const dateSpan = document.createElement('span');
        dateSpan.className = 'font-mono text-blue-500';
        dateSpan.textContent = amiibo.release.na || 'N/A';

        const btnElement = document.createElement('button');
        btnElement.className = 'wii-btn-blue text-white font-semibold text-sm py-2 px-4 rounded-xl w-full transition shadow-sm';
        btnElement.textContent = 'Ver más';
        
        btnElement.addEventListener('click', () => {
            detailAmiibo(amiiboId);
        });

        imgContainer.appendChild(imgElement);

        tagsContainer.appendChild(seriesSpan);
        tagsContainer.appendChild(dateSpan);

        cardElement.appendChild(imgContainer);
        cardElement.appendChild(titleElement);
        cardElement.appendChild(tagsContainer);
        cardElement.appendChild(btnElement);

        cardsDeJs.appendChild(cardElement);
    });

    isLoading(false);
}

const isLoading = (isActive) => {
    if (isActive) {
        carga.classList.remove('hidden');
    } else {
        carga.classList.add('hidden');
    }
};

boton.addEventListener('click', () => {
    document.querySelector('#error-message').classList.add('hidden');
    
    showAmiibo(API_URL);
});

const detailAmiibo = (id) => {
    const amiibos = JSON.parse(localStorage.getItem("amiibos")) || JSON.parse(localStorage.getItem("amiibosCache"));
    const amiibo = amiibos.find(a => `${a.head}${a.tail}` === id);
    
    if (!amiibo) return;

    const modal = document.querySelector('#detailModal');

    modal.innerHTML = `
        <div class="wii-modal-card bg-white max-w-lg w-full p-6 shadow-2xl">
            
            <div class="flex justify-between items-center border-b-2 border-[#d0d7de] pb-3">
                <h3 id="detailModalLabel" class="text-xl font-bold">${amiibo.name}</h3>
                <button id="closeModalBtn" class="px-3 py-1 bg-white border-2 border-[#d0d7de] rounded-full hover:bg-gray-100 font-bold text-gray-500">&times;</button>
                
            </div>
            
            <div id="detailModalBody" class="py-6">

            
                <div class="flex flex-col items-center text-center">
                    <img src="${amiibo.image}" alt="${amiibo.name}" class="h-48 object-contain mb-6">
                    <ul class="w-full text-left bg-gray-50 rounded-lg p-4 border-2 border-[#d0d7de]">
                        <li class="py-2 border-b border-gray-200 last:border-0 text-gray-700">
                            <strong class="text-[#484848] mr-2">Personaje:</strong> <span>${amiibo.character}</span>
                        </li>
                        <li class="py-2 border-b border-gray-200 last:border-0 text-gray-700">
                            <strong class="text-[#484848] mr-2">Juego original:</strong> <span>${amiibo.gameSeries}</span>
                        </li>
                        <li class="py-2 border-b border-gray-200 last:border-0 text-gray-700">
                            <strong class="text-[#484848] mr-2">Tipo:</strong> <span>${amiibo.type}</span>
                        </li>
                        <li class="py-2 border-b border-gray-200 last:border-0 text-gray-700">
                            <strong class="text-[#484848] mr-2">Lanzamiento (USA):</strong> <span>${amiibo.release.na || 'No disponible'}</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div class="flex justify-between items-center border-t-2 border-[#d0d7de] pt-4">
                <button id="fav-btn" class=" btn-fav flex items-center gap-3 bg-white border-2 border-[#d0d7de] hover:border-[#34BEED] rounded-full px-5 py-2 hover:shadow-[0_0_15px_rgba(52,190,237,0.5)] hover:scale-105 active:scale-95 transition-all">
                    <div class="w-8 h-8 flex items-center justify-center">
                        <svg class="w-full h-full" viewBox="0 0 187 187" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_modal)">
                                <circle cx="85" cy="85" r="81" fill="#D9D9D9" />
                                <circle cx="85" cy="85" r="83" stroke="#34BEED" stroke-width="4" />
                            </g>
                            <path d="M115.15 63.2531C130.738 48.6458 132.095 22.9189 112.046 15.5428C104.058 12.604 95.4282 11 86.4251 11C45.3212 11 12 44.4348 12 85.6786C12 92.8513 13.0078 99.7878 14.889 106.353C20.8004 126.984 46.6859 127.41 62.3459 112.735L115.15 63.2531Z" fill="#E4E4E4" />
                            <path d="M81.6754 34.4875C82.8305 30.716 88.1695 30.716 89.3246 34.4875L97.5432 61.3214C98.058 63.0022 99.6099 64.15 101.368 64.15H128.444C132.261 64.15 133.909 68.9876 130.886 71.3181L108.582 88.5091C107.262 89.5264 106.711 91.2553 107.199 92.8486L115.621 120.347C116.763 124.074 112.442 127.066 109.355 124.686L87.9419 108.182C86.5029 107.073 84.4971 107.073 83.0581 108.182L61.6452 124.686C58.5577 127.066 54.2371 124.074 55.3786 120.347L63.8007 92.8486C64.2887 91.2553 63.7378 89.5264 62.418 88.5091L40.1143 71.3181C37.0907 68.9876 38.7387 64.15 42.5562 64.15H69.6322C71.3901 64.15 72.942 63.0022 73.4568 61.3214L81.6754 34.4875Z" fill="#A2A2A2" />
                            <defs>
                                <filter id="filter0_modal" x="-6" y="-6" width="193" height="193" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feMorphology radius="3" operator="erode" in="SourceAlpha" result="effect1_dropShadow_modal" />
                                    <feOffset dx="18" dy="18" />
                                    <feGaussianBlur stdDeviation="1" />
                                    <feComposite in2="hardAlpha" operator="out" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0.737255 0 0 0 0 0.741176 0 0 0 0 0.764706 0 0 0 1 0" />
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_modal" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_modal" result="shape" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dx="-6" dy="-6" />
                                    <feGaussianBlur stdDeviation="7" />
                                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.26 0" />
                                    <feBlend mode="normal" in2="shape" result="effect2_innerShadow_modal" />
                                </filter>
                            </defs>
                        </svg>
                    </div>
                    <span class="font-bold text-[#484848]">Agregar a Favoritos</span>
                </button>
                <button id="closeModalBottomBtn" class=" card-close-btn bg-white border-2 border-[#d0d7de] font-bold rounded-full px-5 py-2.5 hover:bg-gray-100 transition">
                    Cerrar
                </button>
            </div>
        </div>
    `;

    const btnFav = document.querySelector('#fav-btn');
    const btnCloseTop = document.querySelector('#closeModalBtn');
    const btnCloseBottom = document.querySelector('#closeModalBottomBtn');

    btnFav.onclick = () => {
        const mensajeDeRespuesta = agregarFavorito(amiibo);

        mostrarToast(mensajeDeRespuesta);
    };

    const cerrarModal = () => {
        modal.classList.add('hidden');
    };

    btnCloseTop.onclick = cerrarModal;
    btnCloseBottom.onclick = cerrarModal;

    modal.classList.remove('hidden');
}

const mostrarToast = (mensaje) => {
    const toast = document.querySelector('#fav-toast');
    
    if (!toast) return; 

    const toastSpan = toast.querySelector('span');
    toastSpan.textContent = mensaje;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 5000);
};

const searchAmiibo = () => {
    const data = buscador.value.trim();
    if (data !== "") {
        showAmiibo(`${API_URL}?name=${data}`);
    } else {
        showAmiibo(API_URL);
    }
};

buscador.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchAmiibo();
    }
});

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      
        mobileMenu.classList.toggle('hidden');
        
        
        iconOpen.classList.toggle('hidden');
        iconClose.classList.toggle('hidden');
    });
}

formularioBusqueda.addEventListener("submit", (e) => {
    e.preventDefault();
    searchAmiibo();
});

showAmiibo(API_URL);