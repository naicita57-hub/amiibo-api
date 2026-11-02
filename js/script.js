if('serviceWorker' in navigator) {
    window.addEventListener('load',  () => {
        navigator.serviceWorker.register('sw.js')
            .then( (registration)=>{
                console.log('se registro el SW, con alcance: ', registration.scope)
            }).catch( (error) => {
                console.log('El registro del SW, fallo: ', error)
            })
    });
}

(()=>{
    let advice;

    let showAlert = document.querySelector('#install-app');
    window.addEventListener('beforeinstallprompt', (e)=>{
        e.preventDefault()
        console.log(e);
        advice = e;

        showAddToHomeScreen();
        
    })

    const showAddToHomeScreen = () => {
        if(showAlert != undefined){
            showAlert.classList.remove('hidden')
            showAlert.addEventListener('click', addToHomeScreen)
        }
    };

    const addToHomeScreen = () => {
        showAlert.classList.add('show');
        if(advice){
            advice.prompt();
            advice.userChoice
            .then((choiceResult)=>{
                if(choiceResult.outcome === 'accepted'){
                    console.log('el usuario va a instalar la app');
                } else {
                    console.log('el usuario no quiere la app');
                }

                advice = null
            })
        }
    }
})()
