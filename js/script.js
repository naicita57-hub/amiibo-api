if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log("se registro el SW, con alcance: ", registration.scope);
      })
      .catch((error) => {
        console.log("El registro del SW, fallo: ", error);
      });
  });
}

(() => {
  let advice;
  let btnDesktop = document.querySelector("#install-app");
  let btnMobile = document.querySelector("#install-app-mobile");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    console.log(e);
    advice = e;

    showAddToHomeScreen();
  });

  const showAddToHomeScreen = () => {
    if ((btnDesktop != undefined, btnMobile != undefined)) {
      btnDesktop.classList.remove("hidden");
      btnDesktop.addEventListener("click", addToHomeScreen);
      btnMobile.classList.remove("hidden");
      btnMobile.addEventListener("click", addToHomeScreen);
    }
  };

  const addToHomeScreen = () => {
    btnDesktop.classList.add("show");
    btnMobile.classList.add("show");
    if (advice) {
      advice.prompt();
      advice.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("el usuario va a instalar la app");
        } else {
          console.log("el usuario no quiere la app");
        }

        advice = null;
      });
    }
  };
})();

if (window.Notification && Notification.permission != "denied") {
  setTimeout("Notification.requestPermission()", 10000);
}

// (() => {
//   document.querySelector("#share").addEventListener("click", () => {
//     if (navigator.share) {
//       navigator
//         .share({
//           title: "AMII",
//           text: "Mirá Arg Amiibo, la mayor variedad de Amiibo en Argentina",
//           url: "https://amiibo-api-two.vercel.app/",
//         })
//         .then(() => {
//           console.log("Se compartió exitosamente");
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }
//   });
// })();
