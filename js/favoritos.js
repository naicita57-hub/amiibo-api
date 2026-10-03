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
        alert(`¡${amiibo.name} añadido a favoritos!`);
    } else {
        alert("Este Amiibo ya está en tus favoritos.");
    }
}

const eliminarFavorito = (id) => {
    let favoritos = getFavoritos();
    favoritos = favoritos.filter(fav => `${fav.head}${fav.tail}` !== id);
    localStorage.setItem('amiibosFavoritos', JSON.stringify(favoritos));
}