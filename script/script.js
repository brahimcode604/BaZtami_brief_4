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


let income1_aficher = document.getElementById('Income');
let expense_afficher = document.getElementById('Spent');
let net_Balance = document.getElementById('Balance');


 


let income1 = document.getElementById('incremonte_montant');
let expense = document.getElementById('decriment_montant');
let description = document.getElementById('description');
let montant = document.getElementById('amount');

let total_income = 0, total_expenses = 0, net_balance = 0;
let transactions = []; // Tableau pour stocker les transactions

// Fonction pour créer une transaction
function creerTransaction(type, description, montant) {
    return {
        type: type, // 'income' ou 'expense'
        description: description,
        amount: montant,
        date: new Date().toLocaleDateString() // Date actuelle
    };
}



// Gestionnaire pour les revenus (income)
income1.addEventListener('click', function() {
    // ✅ Récupérer et convertir la valeur
    let valeurMontant = parseFloat(montant.value) || 0;
    let valeurDescription = description.value.trim();
    
    // Validation
    if (valeurMontant <= 0) {
        alert("Veuillez entrer un montant valide");
        return;
    }
    
    if (valeurDescription === "") {
        alert("Veuillez entrer une description");
        return;
    }
    
    // ✅ Mettre à jour le total
    total_income += valeurMontant;
    net_balance = total_income - total_expenses;


    income1_aficher.innerText=total_income;  
     expense_afficher.innerText=total_expenses;  
     net_Balance.innerText=net_balance;

     image.src = 'image/ChatGPT Image 28 oct. 2025, 10_40_24.png';
    
    // ✅ Créer et stocker la transaction
    let transaction = creerTransaction('income', valeurDescription, valeurMontant);
    transactions.push(transaction);
    
    // ✅ Afficher les résultats
    console.log("Nouveau revenu ajouté:", valeurMontant);
    console.log("Total revenus:", total_income);
    console.log("Balance nette:", net_balance);
    console.log("Transaction:", transaction);
    
    // Réinitialiser les champs
    montant.value = "";
    description.value = "";
afficherHistorique(transactions);

});

// Gestionnaire pour les dépenses (expense)
expense.addEventListener('click', function() {
    // ✅ Récupérer et convertir la valeur
    let valeurMontant = parseFloat(montant.value) || 0;
    let valeurDescription = description.value.trim();
    
    // Validation
    if (valeurMontant <= 0) {
        alert("Veuillez entrer un montant valide");
        return;
    }
    
    if (valeurDescription === "") {
        alert("Veuillez entrer une description");
        return;
    }
    
    // ✅ Mettre à jour le total
    total_expenses += valeurMontant;
    net_balance = total_income - total_expenses;


      income1_aficher.innerText=total_income;  
     expense_afficher.innerText=total_expenses;  
     net_Balance.innerText=net_balance;
    image.src = 'image/ChatGPT Image 28 oct. 2025, 10_40_28.png';
    // ✅ Créer et stocker la transaction
    let transaction = creerTransaction('expense', valeurDescription, valeurMontant);
    transactions.push(transaction);
    
    // ✅ Afficher les résultats
    console.log("Nouvelle dépense ajoutée:", valeurMontant);
    console.log("Total dépenses:", total_expenses);
    console.log("Balance nette:", net_balance);
    console.log("Transaction:", transaction);
    
    // Réinitialiser les champs
    montant.value = "";
    description.value = "";
    afficherHistorique(transactions);
});







let historiqueContainer  = document.getElementById('historique');

//let historiqueContainer = document.querySelector('.scrolhistorique');

function afficherHistorique(transactions) {
    if (transactions.length === 0) {
        historiqueContainer.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-receipt text-4xl mb-4 opacity-50"></i>
                <p class="text-lg font-semibold">Aucune transaction</p>
                <p class="text-sm">Ajoutez votre première transaction</p>
            </div>
        `;
    } else {
        historiqueContainer.innerHTML = `
            <div class="space-y-3">
                ${transactions.map(transaction => `
                    <div class="transaction-item bg-white p-4 rounded-lg shadow border-l-4 ${
                        transaction.type === 'income' ? 'border-green-500' : 'border-red-500'
                    }">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="font-semibold">${transaction.description}</h4>
                                <p class="text-sm text-gray-500">${transaction.date}</p>
                            </div>
                            <div class="text-right">
                                <p class="font-bold ${
                                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                }">
                                    ${transaction.type === 'income' ? '+' : '-'}${transaction.amount} DH
                                </p>
                                <p class="text-xs text-gray-500">${transaction.type}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}







