if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('se registro el SW, con alcance: ', registration.scope)
            }).catch((error) => {
                console.log('El registro del SW, fallo: ', error)
            })
    });
}

(() => {
    let advice;
    let showAlert = document.querySelector('#install-app');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        console.log(e);
        advice = e;

        showAddToHomeScreen();

    })

    const showAddToHomeScreen = () => {
        if (showAlert != undefined) {
            showAlert.classList.remove('hidden')
            showAlert.addEventListener('click', addToHomeScreen)
        }
    };

    const addToHomeScreen = () => {
        showAlert.classList.add('show');
        if (advice) {
            advice.prompt();
            advice.userChoice
                .then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('el usuario va a instalar la app');
                    } else {
                        console.log('el usuario no quiere la app');
                    }

                    advice = null
                })
        }
    }
})()

if (window.Notification && Notification.permission != 'denied') {
    setTimeout('Notification.requestPermission()', 10000)
}

(() => {
    let conexionStatus = document.querySelector('#status')
    const conectividad = (e) => {
        if (navigator.onLine) {
            conexionStatus.computedStyleMap.display = 'hidden';
            console.log('Hay conexión')
        } else {
            conexionStatus.computedStyleMap.backgroundColor = 'show';
            console.log('No hay conexión')
        }
    }

    window.addEventListener("online", conectividad);
    window.addEventListener("offline", conectividad);
});

(() => {
    document.querySelector('#share').addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'AMII',
                text: 'Compartir app',
                url: 'https://amiibo-api-two.vercel.app/'
            })
                .then(() => {
                    console.log('Se compartió exitosamente');
                })
                .catch((error) => {
                    console.error(error);
                })
        }
    })
})();