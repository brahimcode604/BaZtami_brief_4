let btn_user = document.getElementById('user_cont');
let fragment = document.getElementById('FRAGMENT_control');
fragment.style.display = 'none';

if (btn_user && fragment) {
    btn_user.addEventListener('click', function() {
        if (fragment.style.display === 'none' || fragment.style.display === '') {
            fragment.style.display = 'block';
        } else {
            fragment.style.display = 'none';
        }
    });
} else {
    console.error('Éléments non trouvés: btn_user ou fragment');
}

let mode = document.getElementById('mode');

if (mode) {
    mode.addEventListener('click', function() {
        if (document.body.style.backgroundColor === "white") {
            document.body.style.backgroundColor = "black";
            document.body.style.color = "white";
        } else {
            document.body.style.backgroundColor = "white";
            document.body.style.color = "black";
        }
    });
}

let image = document.getElementById('image');

if (image) {
    image.addEventListener('click', function() {
        // Utiliser includes() pour vérifier le nom de fichier dans le chemin complet
        if (image.src.includes("image/ChatGPT Image 28 oct. 2025, 10_40_24.png")) {
            image.src = 'image/ChatGPT Image 28 oct. 2025, 10_40_28.png';
            image.alt = 'Logo secondaire';
        } else {
            image.src = 'image/ChatGPT Image 28 oct. 2025, 10_40_28.png';
            image.alt = 'Logo principal';
        }
    });
}



let income1 = document.getElementById('incremonte_montant');
let expense = document.getElementById('decriment_montant');

let description = document.getElementById('description');
let montant = document.getElementById('amount');

let    total_income=0,total_expenss=0,net_bane=0;

let     tansaction={

        description ,
        amount,
        dat_e
         

};


 income1.addEventListener('click', function() {
          
         
    });







