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
    if(items){
        localStorage.setItem("amiibos", JSON.stringify(items));
    }
    return items;
}

const showAmiibo = async (url) => {
    isLoading(true);
    cardsDeJs.innerHTML = '';

    const amiibos = await getAllAmiibo(url);

    if(!amiibos || amiibos.length === 0){
        cardsDeJs.innerHTML = '<h4>No se encontraron Amiibos con ese nombre</h4>'
        isLoading(false);
        return;
    }

    const limitAmiibos = amiibos.slice(0, 50);

    limitAmiibos.forEach(amiibo => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card col-12 col-md-3 col-lg-2 p-3 text-center shadow-sm';
        
        const amiiboId = `${amiibo.head}${amiibo.tail}`;

        cardElement.innerHTML = `
            <h5 class="card-title text-truncate" title="${amiibo.name}">${amiibo.name}</h5>
            <p class="text-muted small mb-2">${amiibo.amiiboSeries}</p> 
            <div class="mb-3" style="height: 150px;">
                <img class="img-fluid h-100 object-fit-contain" src="${amiibo.image}" alt="${amiibo.name}">
            </div>
            <button onclick="detailAmiibo('${amiiboId}')" class="btn btn-primary btn-sm w-100" data-bs-target="#detailModal" data-bs-toggle="modal">Ver Detalles</button>
        `;

        cardsDeJs.appendChild(cardElement);
    });

    isLoading(false);
}

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
}

const isLoading = (isActive) => {
    if (isActive) {
        carga.classList.remove('d-none');
    } else {
        carga.classList.add('d-none');
    }
}

const searchAmiibo = () => {
    const data = buscador.value.trim();
    if (data !== "") {
        showAmiibo(`${API_URL}?name=${data}`);
    } else {
        showAmiibo(API_URL);
    }

}

buscador.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchAmiibo();
    }
});

showAmiibo(API_URL);