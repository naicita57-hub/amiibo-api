const getFavoritos = () => {
    return JSON.parse(localStorage.getItem('amiibosFavoritos')) || [];
}

const agregarFavorito = (amiibo) => {
    const favoritos = getFavoritos();
    const amiiboId = `${amiibo.head}${amiibo.tail}`;
    
    const existe = favoritos.some(fav => `${fav.head}${fav.tail}` === amiiboId);
    
    if (!existe) {
        favoritos.push(amiibo);
        localStorage.setItem('amiibosFavoritos', JSON.stringify(favoritos));
        return `¡${amiibo.name} añadido a favoritos!`;
    }else {
        return "Listo! Este Amiibo ya está en tus favoritos.";
    };
};  

const eliminarFavorito = (id) => {
    let favoritos = getFavoritos();
    favoritos = favoritos.filter(fav => `${fav.head}${fav.tail}` !== id);
    localStorage.setItem('amiibosFavoritos', JSON.stringify(favoritos));
}

const renderizarFavoritos = () => {
    const contenedorFavoritos = document.querySelector('#fav-container');
    const mensajeVacio = document.querySelector('#no-favs');

    if (!contenedorFavoritos || !mensajeVacio) {
        return;
    }

    const favoritos = getFavoritos();
    
    contenedorFavoritos.textContent = '';

    if (favoritos.length === 0) {
        mensajeVacio.classList.remove('hidden');
        mensajeVacio.classList.add('flex');
        contenedorFavoritos.classList.add('hidden');
        return;
    }

    mensajeVacio.classList.add('hidden');
    mensajeVacio.classList.remove('flex');
    contenedorFavoritos.classList.remove('hidden');

    favoritos.forEach(amiibo => {
        const amiiboId = `${amiibo.head}${amiibo.tail}`;

        const card = document.createElement('article');
        card.className = 'wii-card gap-2 bg-white border-2 border-gray-200 rounded-2xl p-4 transition flex flex-col justify-between';
        
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
        seriesSpan.textContent = amiibo.amiiboSeries;

        const dateSpan = document.createElement('span');
        dateSpan.className = 'font-mono text-blue-500';
        dateSpan.textContent = amiibo.release.na || 'N/A';

        tagsContainer.appendChild(seriesSpan);
        tagsContainer.appendChild(dateSpan);

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold text-sm py-2 px-4 rounded-xl w-full transition shadow-sm mt-2';
        btnEliminar.textContent = 'Eliminar';
        
        btnEliminar.addEventListener('click', () => {
            eliminarFavorito(amiiboId);
            renderizarFavoritos();
        });

        card.appendChild(imgContainer);
        card.appendChild(titleElement);
        card.appendChild(tagsContainer);
        card.appendChild(btnEliminar);

        contenedorFavoritos.appendChild(card);
    });
}

renderizarFavoritos();