export function ajoutListenersAvis() {
  
    const piecesElements = document.querySelectorAll(".fiches article button");

    for (let i = 0; i < piecesElements.length; i++) {
      piecesElements[i].addEventListener("click", async function (event) {
        const id = event.target.dataset.id;
        const response = await fetch(`http://localhost:8081/pieces/${id}/avis`);
        const avis = await response.json();
        window.localStorage.setItem(`avis-piece-${id}`, JSON.stringify(avis))
        const pieceElement = event.target.parentElement;
        afficherAvis(pieceElement,avis)
      });
    }
}

export function afficherAvis(pieceElement,avis){
  const avisElement = document.createElement("p");
  for (let i =0; i<avis.length; i++) {
      avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire}</b>`;
  }
  pieceElement.appendChild(avisElement);
}

export function ajoutListenerEnvoyerAvis(){
  const formulaireAvis = document.querySelector(".formulaire-avis");
  formulaireAvis.addEventListener("submit", (event) => {
  event.preventDefault();
    // Création de l’objet du nouvel avis.
  const avis = {
    pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
    utilisateur: event.target.querySelector("[name=utilisateur").value,
    commentaire: event.target.querySelector("[name=commentaire]").value,
    stars: parseInt(event.target.querySelector("[name=stars]").value)
  };
  const chareUtile = JSON.stringify(avis);
  fetch("http://localhost:8081/avis", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: chareUtile
  });


  });
}