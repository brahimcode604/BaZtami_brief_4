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

// ==================== LOCALSTORAGE ====================

// Fonction pour sauvegarder dans le localStorage
function sauvegarderTransactions() {
    try {
        const data = {
            transactions: transactions,
            total_income: total_income,
            total_expenses: total_expenses,
            net_balance: net_balance,
            last_update: new Date().toISOString()
        };
        localStorage.setItem('budget_data', JSON.stringify(data));
        console.log('✅ Données sauvegardées');
    } catch (error) {
        console.error('❌ Erreur sauvegarde:', error);
    }
}

// Fonction pour charger depuis le localStorage
function chargerTransactions() {
    try {
        const savedData = localStorage.getItem('budget_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            transactions = data.transactions || [];
            total_income = data.total_income || 0;
            total_expenses = data.total_expenses || 0;
            net_balance = data.net_balance || 0;
            
            console.log('📥 Données chargées:', transactions.length + ' transactions');
            return true;
        }
    } catch (error) {
        console.error('❌ Erreur chargement:', error);
    }
    return false;
}

// ==================== VARIABLES GLOBALES ====================

let total_income = 0, total_expenses = 0, net_balance = 0;
let transactions = [];

// ==================== INITIALISATION ====================

// Charger les données au démarrage
document.addEventListener('DOMContentLoaded', function() {
    chargerTransactions();
    mettreAJourAffichage();
    afficherHistorique(transactions);
});

// ==================== FONCTIONS ====================

function creerTransaction(type, description, montant) {
    return {
        id: Date.now(), // ID unique
        type: type,
        description: description,
        amount: montant,
        date: new Date().toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
}

function mettreAJourAffichage() {
    if (income1_aficher) income1_aficher.innerText = total_income.toFixed(2) + ' DH';
    if (expense_afficher) expense_afficher.innerText = total_expenses.toFixed(2) + ' DH';
    if (net_Balance) net_Balance.innerText = net_balance.toFixed(2) + ' DH';
}

// Gestionnaire pour les revenus (income)
income1.addEventListener('click', function() {
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
    
    // Mettre à jour le total
    total_income += valeurMontant;
    net_balance = total_income - total_expenses;

    income1_aficher.innerText = total_income.toFixed(2) + ' DH';  
    expense_afficher.innerText = total_expenses.toFixed(2) + ' DH';  
    net_Balance.innerText = net_balance.toFixed(2) + ' DH';

    image.src = 'image/ChatGPT Image 28 oct. 2025, 10_40_24.png';
    
    // Créer et stocker la transaction
    let transaction = creerTransaction('income', valeurDescription, valeurMontant);
    transactions.push(transaction);
    
    console.log("Nouveau revenu ajouté:", valeurMontant);
    
    // SAUVEGARDER DANS LE LOCALSTORAGE
    sauvegarderTransactions();
    
    // Réinitialiser les champs
    montant.value = "";
    description.value = "";
    afficherHistorique(transactions);
});

// Gestionnaire pour les dépenses (expense)
expense.addEventListener('click', function() {
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
    
    // Mettre à jour le total
    total_expenses += valeurMontant;
    net_balance = total_income - total_expenses;

    income1_aficher.innerText = total_income.toFixed(2) + ' DH';  
    expense_afficher.innerText = total_expenses.toFixed(2) + ' DH';  
    net_Balance.innerText = net_balance.toFixed(2) + ' DH';
    
    image.src = 'image/ChatGPT Image 28 oct. 2025, 10_40_28.png';
    
    // Créer et stocker la transaction
    let transaction = creerTransaction('expense', valeurDescription, valeurMontant);
    transactions.push(transaction);
    
    console.log("Nouvelle dépense ajoutée:", valeurMontant);
    
    // SAUVEGARDER DANS LE LOCALSTORAGE
    sauvegarderTransactions();
    
    // Réinitialiser les champs
    montant.value = "";
    description.value = "";
    afficherHistorique(transactions);
});

let historiqueContainer = document.querySelector('.scrolhistorique');

function afficherHistorique(transactions) {
    if (!historiqueContainer) {
        console.error("Container historique non trouvé");
        return;
    }
    
    if (transactions.length === 0) {
        historiqueContainer.innerHTML = `
            <div class="text-center py-8 text-gray-500 bg-white rounded-2xl p-6">
                <i class="fas fa-receipt text-4xl mb-4 opacity-50"></i>
                <p class="text-lg font-semibold">Aucune transaction</p>
                <p class="text-sm">Ajoutez votre première transaction</p>
            </div>
        `;
    } else {
        historiqueContainer.innerHTML = `
            <div class="bg-white rounded-2xl p-6">
            
            <div class="flex justify-between items-center">
                <h3 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                    Historique des Transactions
                    <span class="text-sm font-normal text-gray-500 ml-2">
                        (${transactions.length} transaction${transactions.length > 1 ? 's' : ''})
                    </span>
                     
                </h3>

                   
<button 
            id="btn-supprimer-historique" 
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
        >
            <i class="fas fa-trash "></i>
            Supprimer
        </button>
                    
</div>

                     
                <div class="space-y-3 max-h-96 overflow-y-auto">
                    ${transactions.slice().reverse().map(transaction => `
                        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition ${
                            transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                        }">
                            <div class="flex items-center space-x-4">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center ${
                                    transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }">
                                    <i class="fas ${transaction.type === 'income' ?'fa-arrow-up'  : 'fa-arrow-down'}"></i>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-800">${transaction.description}</p>
                                    <p class="text-sm text-gray-500">${transaction.date}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-bold text-lg ${
                                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                }">
                                    ${transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)} DH
                                </p>
                                <p class="text-xs text-gray-500 capitalize">${transaction.type === 'income' ? 'Revenu' : 'Dépense'}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}



 
// Fonction pour supprimer tout l'historique
function supprimerHistoriqueComplet() {
    if (confirm('Êtes-vous sûr de vouloir supprimer tout l\'historique ? Cette action est irréversible.')) {
        // Réinitialiser les variables
        transactions = [];
        total_income = 0;
        total_expenses = 0;
        net_balance = 0;
        
        // Mettre à jour l'affichage
        mettreAJourAffichage();
        
        
        // Sauvegarder les changements (historique vide)
        sauvegarderTransactions();
        
        console.log('🗑️ Historique supprimé avec succès');
         
    }
}

  // Attacher l'événement au parent (qui existe toujours)
document.addEventListener('click', function(e) {
    // Vérifier si le clic vient du bouton de suppression
    if (e.target && e.target.id === 'btn-supprimer-historique') {
        supprimerHistoriqueComplet();
        afficherHistorique(transactions);
    }
    
   
});




