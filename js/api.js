const API_URL = 'https://www.amiiboapi.org/api/amiibo/';

const fetchData = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': ''
            }
        });
        
        if (response.status === 404) {
             return { amiibo: [] }; 
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error de conexión:", error);
        document.querySelector('#error-message').classList.remove('d-none');
        return { amiibo: [] };
    }
}
