import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherAvis } from "./avis.js";
//get the pieces that will be stored in local storage
let pieces = window.localStorage.getItem("pieces");


if (pieces === null){ 
    const response = await fetch('http://localhost:8081/pieces');
    pieces = await response.json();
    //transform to json
    const valeurPieces = JSON.stringify(pieces);
    //Store info in the local Storage
    window.localStorage.setItem("pieces", valeurPieces);
} else {
    pieces = JSON.parse(pieces);
}

ajoutListenerEnvoyerAvis();

function genererPieces(pieces){
    for (let i = 0; i < pieces.length; i++) {
    
        const article = pieces[i];
        const sectionFiches = document.querySelector(".fiches");
        const pieceElement = document.createElement("article"); 
    
        const imageElement = document.createElement("img");
        imageElement.src = article.image;
        const nameElement = document.createElement("h2");
        nameElement.innerText = article.nom;
        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;
        const catElement = document.createElement("p");
        catElement.innerText = article.categorie ?? "(aucune catégorie)";
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description ?? "(No description availible)";
        const dispoElement = document.createElement("p");
        dispoElement.innerText = article.disponibilite ? "In stock" : "Out of stock" ;
        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";
    
        sectionFiches.appendChild(pieceElement);
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nameElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(catElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(dispoElement);
        pieceElement.appendChild(avisBouton);
    }
    ajoutListenersAvis();
}

genererPieces(pieces);

for(let i=0;i<pieces.length;i++){
    const id = pieces[i].id;
    const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
    const avis = JSON.parse(avisJSON);

    if(avis !== null){
        const pieceElement = document.querySelector(`article[data-id="${id}]`);
        afficherAvis(pieceElement, avis)
    }
}

const buttonTrier = document.querySelector(".btn-trier");
buttonTrier.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a,b){
        return a.prix - b.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
});

const buttonFilter = document.querySelector(".btn-filter");
buttonFilter.addEventListener("click", function (){
    const piecesFilters = pieces.filter(function (piece){
        return piece.prix <= 35;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFilters);
});

const buttonDescription = document.querySelector(".btn-description");
buttonDescription.addEventListener("click", function (){
    const piecesFilters = pieces.filter(function (piece){
        return piece.description;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFilters);
});

const buttonDescend = document.querySelector(".btn-descend");
buttonDescend.addEventListener("click", function(){
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function(a, b){
        return b.prix - a.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
});

const noms = pieces.map(pieces => pieces.nom);
for (let i = pieces.length - 1; i>=0; i--){
    if (pieces[i].prix > 35){
        noms.splice(i,1)
    }
}

const affordableElement = document.createElement('ul');
for (let i =0; i<noms.length; i++){
    const nomElement = document.createElement('li');
    nomElement.innerText = noms[i];
    affordableElement.appendChild(nomElement)
}

document.querySelector('.affordables').appendChild(affordableElement)

const parts = pieces.map(pieces => pieces.nom + " - " + pieces.prix + "€");
for (let i = pieces.length-1; i>=0;i--){
    if (pieces[i].availability == false){
        parts.splice(i,1)
    }
}


const partsDispo = document.createElement('ul');
for (let i = 0; i<parts.length; i++){
    const nomElement = document.createElement('li');
    nomElement.innerText = parts[i];
    partsDispo.appendChild(nomElement)
}

document.querySelector('.parts-dispo').appendChild(partsDispo);

const inputPrixMax = document.querySelector("#prix-max")
inputPrixMax.addEventListener('input', function(){
    const piecesFilters = pieces.filter(function(piece){
        return piece.prix <= inputPrixMax.value;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFilters);
})

//add listener to remove donnees du local storage
const buttonUpdate = document.querySelector(".btn-maj");
buttonUpdate.addEventListener("click", () => {
    window.localStorage.removeItem("pieces");
})



