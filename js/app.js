const buscador = document.querySelector('#search-input');
const carga = document.querySelector('#loader');
const error = document.querySelector('#error-message');
const boton = document.querySelector('#reintentar-btn');
const cardsDeJs = document.querySelector('#cards-container');
const modalBody = document.querySelector('#detailModalBody');
const btnModal = document.querySelector('#closeModalBtn');
const modal = document.querySelector('#detailModal');
const btnFav = document.querySelector('#fav-btn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');
const formularioBusqueda = document.querySelector('#search-form');

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
    
    document.querySelector('#error-message').classList.add('hidden');
    document.querySelector('#no-results').classList.add('hidden');

    const amiibos = await getAllAmiibo(url);

    if(!amiibos || amiibos.length === 0){
        document.querySelector('#no-results').classList.remove('hidden');
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
        
        imgContainer.appendChild(imgElement);

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

        tagsContainer.appendChild(seriesSpan);
        tagsContainer.appendChild(dateSpan);

        const btnElement = document.createElement('button');
        btnElement.className = 'wii-btn-blue text-white font-semibold text-sm py-2 px-4 rounded-xl w-full transition shadow-sm';
        btnElement.textContent = 'Ver más';
        
        btnElement.addEventListener('click', () => {
            detailAmiibo(amiiboId);
        });

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

const detailAmiibo = (id) => {
    const amiibos = JSON.parse(localStorage.getItem("amiibos")) || JSON.parse(localStorage.getItem("amiibosCache"));
    const amiibo = amiibos.find(a => `${a.head}${a.tail}` === id);
    
    if (!amiibo) return;

    const modal = document.querySelector('#detailModal');
    const modalTitle = document.querySelector('#detailModalLabel');
    const modalBody = document.querySelector('#detailModalBody');
    const btnFav = document.querySelector('#fav-btn');
    const btnCloseTop = document.querySelector('#closeModalBtn');
    const btnCloseBottom = document.querySelector('#closeModalBottomBtn');

    modalTitle.textContent = amiibo.name;

    modalBody.textContent = ''; 

    const contentDiv = document.createElement('div');
    contentDiv.className = 'flex flex-col items-center text-center';

    const imgElement = document.createElement('img');
    imgElement.src = amiibo.image;
    imgElement.alt = amiibo.name;
    imgElement.className = 'h-48 object-contain mb-4';

    const ulElement = document.createElement('ul');
    ulElement.className = 'w-full text-left bg-gray-50 rounded-lg p-4 border-2 border-[#d0d7de]';

    const crearListItem = (etiqueta, valor) => {
        const li = document.createElement('li');
        li.className = 'py-2 border-b border-gray-200 last:border-0 text-gray-700';
        
        const strong = document.createElement('strong');
        strong.className = 'text-[#484848] mr-1';
        strong.textContent = `${etiqueta}:`;
        
        const span = document.createElement('span');
        span.textContent = valor;

        li.appendChild(strong);
        li.appendChild(span);
        return li;
    };

    ulElement.appendChild(crearListItem('Personaje', amiibo.character));
    ulElement.appendChild(crearListItem('Juego original', amiibo.gameSeries));
    ulElement.appendChild(crearListItem('Tipo', amiibo.type));
    ulElement.appendChild(crearListItem('Lanzamiento (USA)', amiibo.release.na || 'No disponible'));

    contentDiv.appendChild(imgElement);
    contentDiv.appendChild(ulElement);
    modalBody.appendChild(contentDiv);

    btnFav.onclick = () => {
        agregarFavorito(amiibo); 
    };

    const cerrarModal = () => {
        modal.classList.add('hidden');
    };

    btnCloseTop.onclick = cerrarModal;
    btnCloseBottom.onclick = cerrarModal;

    modal.classList.remove('hidden');
}

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