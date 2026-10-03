const buscador = document.querySelector('#search-input');
const carga = document.querySelector('#loader');
const error = document.querySelector('#error-message');
const boton = document.querySelector('#reintentar-btn');
const cardsDeJs = document.querySelector('#cards-container');
const modalBody = document.querySelector('#detailModalBody');
const btnModal = document.querySelector('#closeModalBtn');
const modal = document.querySelector('#detailModal');
const btnFav = document.querySelector('#fav-btn');

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

    if (!amiibos || amiibos.length === 0) {
        document.querySelector('#no-results').classList.remove('hidden');
        isLoading(false);
        return;
    }

    const limitAmiibos = amiibos.slice(0, 50);

    limitAmiibos.forEach(amiibo => {
        const cardElement = document.createElement('article');

        cardElement.className = 'wii-card gap-2 bg-white border-2 border-gray-200 rounded-2xl p-4 transition flex flex-col justify-between';

        const amiiboId = `${amiibo.head}${amiibo.tail}`;

        cardElement.innerHTML = `
            <div class="w-full h-44 flex items-center justify-center rounded-xl p-2 mb-3">
                <img src="${amiibo.image}" alt="${amiibo.name}" class="h-full object-contain">
            </div>
            
            <h3 class="font-bold text-lg text-gray-800 text-center mb-3 truncate" title="${amiibo.name}">
                ${amiibo.name}
            </h3>
            
            <div class="flex justify-between items-center text-xs text-gray-500 bg-gray-100 border-glow rounded-lg px-2.5 py-1.5 mb-4">
                <span class="font-semibold text-gray-700 truncate max-w-[55%]" title="${amiibo.amiiboSeries}">
                    ${amiibo.amiiboSeries}
                </span>
                <span class="font-mono text-blue-500">
                     ${amiibo.release.na || 'N/A'}
                </span>
            </div>
            
            <button onclick="detailAmiibo('${amiiboId}')" class="wii-btn-blue text-white font-semibold text-sm py-2 px-4 rounded-xl w-full transition shadow-sm">
                Ver más
            </button>
        `;

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
    const amiibos = JSON.parse(localStorage.getItem("amiibos"));

    amiibos.forEach((amiibo) => {
        const amiiboId = `${amiibo.head}${amiibo.tail}`;

        if (amiiboId === id) {
            document.querySelector('#modalTitle').innerHTML = amiibo.name;

            document.querySelector('#modalContent').innerHTML = `
                <img src="${amiibo.image}" alt="${amiibo.name}" class="img-fluid mb-3" style="max-height: 200px;">
                <ul class="list-group list-group-flush text-start">
                    <li class="list-group-item"><strong>Personaje:</strong> ${amiibo.character}</li>
                    <li class="list-group-item"><strong>Juego original:</strong> ${amiibo.gameSeries}</li>
                    <li class="list-group-item"><strong>Tipo:</strong> ${amiibo.type}</li>
                    <li class="list-group-item"><strong>Lanzamiento (USA):</strong> ${amiibo.release.na || 'No disponible'}</li>
                </ul>
           `;

            const btnFav = document.querySelector('#fav-btn');
            btnFav.onclick = () => {
                console.log("Amiibo añadido a favoritos:", amiibo);
                alert(`¡${amiibo.name} añadido a favoritos!`);
            };
        }
    });
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

const formularioBusqueda = document.querySelector('#search-form');

formularioBusqueda.addEventListener("submit", (e) => {
    e.preventDefault();
    searchAmiibo();
});

showAmiibo(API_URL);