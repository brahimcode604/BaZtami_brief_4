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

// ==================== FONCTIONS POPUP ====================

// Fonction pour afficher le popup de suppression
function afficherPopupSuppression(transaction) {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    popup.innerHTML = `
        <div class="bg-white rounded-2xl p-6 mx-4 max-w-md w-full animate-scale-in">
            <div class="text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Supprimer la transaction</h3>
                <p class="text-gray-600 mb-1">"${transaction.description}"</p>
                <p class="text-lg font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'} mb-4">
                    ${transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)} DH
                </p>
                <p class="text-sm text-gray-500 mb-6">Cette action est irréversible</p>
                
                <div class="flex gap-3">
                    <button 
                        id="btn-annuler-suppression" 
                        class="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                    >
                        Annuler
                    </button>
                    <button 
                        id="btn-confirmer-suppression" 
                        class="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                    >
                        <i class="fas fa-trash mr-2"></i>
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Événements
    document.getElementById('btn-annuler-suppression').addEventListener('click', function() {
        document.body.removeChild(popup);
    });
    
    document.getElementById('btn-confirmer-suppression').addEventListener('click', function() {
        supprimerTransaction(transaction.id);
        document.body.removeChild(popup);
    });
    
    // Fermer en cliquant en dehors
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            document.body.removeChild(popup);
        }
    });
}

// Fonction pour afficher le popup de modification
function afficherPopupModification(transaction) {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    popup.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full animate-scale-in max-h-[90vh] overflow-y-auto">
            <!-- En-tête -->
            <div class="flex justify-between items-center p-6 border-b">
                <h3 class="text-xl font-bold text-gray-800">Modifier la transaction</h3>
                <button id="btn-fermer-modification" class="text-gray-400 hover:text-gray-600 transition">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <!-- Formulaire -->
            <div class="p-6 space-y-4">
                <!-- Type de transaction -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <div class="flex gap-3">
                        <label class="flex-1 cursor-pointer">
                            <input type="radio" name="type-modif" value="income" 
                                   ${transaction.type === 'income' ? 'checked' : ''} 
                                   class="hidden peer">
                            <div class="bg-gray-100 py-3 rounded-lg text-center font-semibold peer-checked:bg-green-500 peer-checked:text-white transition">
                                <i class="fas fa-arrow-down mr-2"></i>Revenu
                            </div>
                        </label>
                        <label class="flex-1 cursor-pointer">
                            <input type="radio" name="type-modif" value="expense" 
                                   ${transaction.type === 'expense' ? 'checked' : ''}
                                   class="hidden peer">
                            <div class="bg-gray-100 py-3 rounded-lg text-center font-semibold peer-checked:bg-red-500 peer-checked:text-white transition">
                                <i class="fas fa-arrow-up mr-2"></i>Dépense
                            </div>
                        </label>
                    </div>
                </div>
                
                <!-- Description -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input 
                        type="text" 
                        id="description-modif" 
                        value="${transaction.description}"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Description de la transaction"
                    >
                </div>
                
                <!-- Montant -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Montant (DH)</label>
                    <input 
                        type="number" 
                        id="montant-modif" 
                        value="${transaction.amount}"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                    >
                </div>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                <button 
                    id="btn-annuler-modification" 
                    class="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                    Annuler
                </button>
                <button 
                    id="btn-sauvegarder-modification" 
                    class="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                    <i class="fas fa-save mr-2"></i>
                    Sauvegarder
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    

    // Événements


    document.getElementById('btn-fermer-modification').addEventListener('click', function() {
        document.body.removeChild(popup);
    });
    
    document.getElementById('btn-annuler-modification').addEventListener('click', function() {
        document.body.removeChild(popup);
    });
    
    document.getElementById('btn-sauvegarder-modification').addEventListener('click', function() {
        sauvegarderModification(transaction.id);
    });
    
    // Fermer en cliquant en dehors
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            document.body.removeChild(popup);
        }
    });
}

// Fonction pour sauvegarder les modifications
function sauvegarderModification(transactionId) {
    const type = document.querySelector('input[name="type-modif"]:checked').value;
    const description = document.getElementById('description-modif').value.trim();
    const montant = parseFloat(document.getElementById('montant-modif').value);
    
    // Validation
    if (!description) {
        alert("Veuillez entrer une description");
        return;
    }
    
    if (!montant || montant <= 0) {
        alert("Veuillez entrer un montant valide");
        return;
    }
    
    const transactionIndex = transactions.findIndex(t => t.id === transactionId);
    if (transactionIndex === -1) return;
    
    const ancienneTransaction = transactions[transactionIndex];
    
    // Mettre à jour les totaux (annuler l'ancien montant)
    if (ancienneTransaction.type === 'income') {
        total_income -= ancienneTransaction.amount;
    } else {
        total_expenses -= ancienneTransaction.amount;
    }
    
    // Appliquer le nouveau montant
    if (type === 'income') {
        total_income += montant;
    } else {
        total_expenses += montant;
    }
    net_balance = total_income - total_expenses;
    
    // Mettre à jour la transaction
    transactions[transactionIndex] = {
        ...ancienneTransaction,
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
    
    // Mettre à jour l'interface
    mettreAJourAffichage();
    afficherHistorique(transactions);
    sauvegarderTransactions();
    
    // Fermer le popup
    const popup = document.querySelector('.fixed.inset-0');
    if (popup) document.body.removeChild(popup);
    
    console.log('✅ Transaction modifiée:', transactions[transactionIndex]);
}


// ==================== FONCTIONS D'ACTION ====================

function supprimerTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    // Mettre à jour les totaux
    if (transaction.type === 'income') {
        total_income -= transaction.amount;
    } else {
        total_expenses -= transaction.amount;
    }
    net_balance = total_income - total_expenses;
    
    // Supprimer de la liste
    transactions = transactions.filter(t => t.id !== id);
    
    // Mettre à jour l'interface
    mettreAJourAffichage();
    afficherHistorique(transactions);
    sauvegarderTransactions();
    
    console.log('🗑️ Transaction supprimée:', transaction);
}

function modifierTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    afficherPopupModification(transaction);
}

// ==================== INITIALISATION ====================

// Charger les données au démarrage
document.addEventListener('DOMContentLoaded', function() {
    chargerTransactions();
    mettreAJourAffichage();
    afficherHistorique(transactions);
});

// ==================== FONCTIONS PRINCIPALES ====================

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
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-gray-800">
                        Historique des Transactions
                        <span class="text-sm font-normal text-gray-500 ml-2">
                            (${transactions.length} transaction${transactions.length > 1 ? 's' : ''})
                        </span>
                    </h3>
                    <button 
                        id="btn-supprimer-historique" 
                        class="bg-red-500  text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                    >
                        <i class="fas fa-trash"></i>
                        Tout supprimer
                    </button>
                </div>
                <div class="space-y-3 max-h-96 overflow-y-auto">
                    ${transactions.slice().reverse().map(transaction => `
                        <div class="transaction-item group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition ${
                            transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                        }" data-transaction-id="${transaction.id}">
                            <div class="flex items-center space-x-4 flex-1">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center ${
                                    transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }">
                                    <i class="fas ${transaction.type === 'income' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                                </div>
                                <div class="flex-1">
                                    <p class="font-semibold text-gray-800">${transaction.description}</p>
                                    <p class="text-sm text-gray-500">${transaction.date}</p>
                                </div>
                            </div>
                            <div class="text-right mr-4">
                                <p class="font-bold text-lg ${
                                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                }">
                                    ${transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)} DH
                                </p>
                                <p class="text-xs text-gray-500 capitalize">${transaction.type === 'income' ? 'Revenu' : 'Dépense'}</p>
                            </div>
                            <div class="action-buttons opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                                <button 
                                    class="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-1 text-sm"
                                    onclick="modifierTransaction(${transaction.id})"
                                    title="Modifier"
                                >
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button 
                                    class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition flex items-center gap-1 text-sm"
                                    onclick="afficherPopupSuppression(${JSON.stringify(transaction).replace(/"/g, '&quot;')})"
                                    title="Supprimer"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
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
        afficherHistorique(transactions);
        
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
    }
});




//truncate



