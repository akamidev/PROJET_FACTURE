/*============================================================================
Création d'un tableau vide qui contiendra toutes les factures
============================================================================*/
let invoices = [];


/*============================================================================
Récupérez les factures du localStorage si elles existent
============================================================================*/
const storedInvoices = localStorage.getItem("invoices");
if (storedInvoices) {
    invoices = JSON.parse(storedInvoices);
}

/*============================================================================
 LES CIBLES HTML DE L'APPLICATION
============================================================================*/
const wrapper = document.getElementById('wrapper');
const invoiceForm = document.getElementById("invoiceForm");
const showInvoicesButton = document.getElementById("showInvoices");
const invoiceList = document.getElementById("invoiceList");


/*============================================================================
 AFFICHER MESSAGE PERSONNALISES
============================================================================*/
function showMessage(type, message) {
    type === "success" ? color = '#5cb85c' : color = '#d9534f';
    const msg = document.getElementById("msg");
    msg.style.display = "block"; // Afficher le message
    msg.style.backgroundColor = color; // Couleur du message
    msg.textContent = message;

    // Masquer le message après 3 secondes (3000 millisecondes)
    setTimeout(() => {
        msg.style.display = "none"; // Masquer le message après 3 secondes
    }, 3000); // 3000 millisecondes (3 secondes)
}


/*============================================================================
FONCTION : GENERER UNE FACTURE PDF
=============================================================================*/
// Fonction pour créer un fichier PDF à partir des données d'une facture
function createPDF(invoice) {
    const { jsPDF } = window.jspdf;
    // Créez une nouvelle instance de jsPDF
    const doc = new jsPDF();

    // Ajoutez le contenu au PDF
    doc.text(`Numéro de facture: ${invoice.number}`, 10, 10);
    doc.text(`Client: ${invoice.clientName}`, 10, 20);
    doc.text(`Email du client: ${invoice.clientEmail}`, 10, 30);
    doc.text(`Date de la facture: ${invoice.date}`, 10, 40);
    doc.text(`Prix de la facture: ${invoice.amount}`, 10, 50);

    // Enregistrez le PDF sous un nom de fichier
    const fileName = `Facture_${invoice.number}.pdf`;
    doc.save(fileName);
}

// Gérer le clic sur le bouton "Créer PDF" pour chaque facture
function pdfInvoice() {
    document.querySelectorAll(".create-pdf").forEach((button) => {
        button.addEventListener("click", (event) => {
            const index = event.target.getAttribute("data-index");
            const invoice = invoices[index];
            createPDF(invoice);
        });
    });
}


/*============================================================================
 FONCTION : CREATION D'UNE FACTURE
 ============================================================================*/

// Fonction pour afficher le message de confirmation de création de facture
function showCreateMessage() {
    console.log('rere');
    const createMessage = document.getElementById("createMessage");
    createMessage.style.display = "block"; // Afficher le message
    createMessage.textContent = "Facture crée avec succès !";

    // Masquer le message après 3 secondes (3000 millisecondes)
    setTimeout(() => {
        createMessage.style.display = "none"; // Masquer le message après 3 secondes
    }, 3000); // 3000 millisecondes (3 secondes)
}


function createInvoice(e) {

    e.preventDefault();

    // Récupérez les valeurs des champs du formulaire
    const invoiceNumber = document.getElementById("invoiceNumber").value;
    const clientName = document.getElementById("clientName").value;
    const clientEmail = document.getElementById("clientEmail").value;
    const invoiceDate = document.getElementById("invoiceDate").value;
    const invoiceAmount = document.getElementById("invoiceAmount").value;

    // Créez une nouvelle facture
    const newInvoice = {
        number: invoiceNumber,
        clientName: clientName,
        clientEmail: clientEmail,
        date: invoiceDate,
        amount: invoiceAmount
    };

    // Vérifiez si tous les champs sont vides ou contiennent des valeurs erronées
    if (
        invoiceNumber.trim() === "" ||
        clientName.trim() === "" ||
        clientEmail.trim === "" || // Vous pouvez définir une fonction isValidEmail() pour valider l'email
        invoiceDate.trim() === "" ||
        isNaN(parseFloat(invoiceAmount)) ||
        invoiceAmount.trim() === ""
    ) {
        // Affichez un message d'erreur si les champs ne sont pas valides
        console.log('Tous les champs doivent être remplis correctement.');
        message = 'Tous les champs doivent être remplis correctement !'
        showMessage('danger', message);

    }
    else {
        // Ajoutez la nouvelle facture au tableau des factures
        invoices.push(newInvoice);

        // Enregistrez la mise à jour du tableau dans le localStorage
        localStorage.setItem("invoices", JSON.stringify(invoices));

        // Effacez le formulaire après la création en réinitialisant le formulaire
        document.getElementById("invoiceForm").reset();

        // Affichez la liste des factures mise à jour
        //displayInvoices();

        // Affichez le message de création
        showCreateMessage();
    }

}

// Gérer l'événement pour la création de facture
//document.getElementById("createInvoice").addEventListener("click", createInvoice);
invoiceForm.addEventListener('submit', createInvoice);

/*============================================================================
 FONCTION : AFFICHER LA LISTE DES FACTURES
=============================================================================*/

function displayInvoices() {
    invoiceList.innerHTML = "<h2>Liste des factures</h2>";
    if (invoices.length === 0) {
        invoiceList.innerHTML += "<p>Aucune facture disponible.</p>";
    } else {

        // Triez les factures par date décroissante
        //invoices.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Pour afficher les données du tableau du dernier au premier élément
        invoices = invoices.slice().reverse();


        invoices.forEach((invoice, index) => {
            invoiceList.innerHTML += `
                <div class="invoice">
                    <p><strong>Facture n°:</strong> ${invoice.number}</p>
                    <p><strong>Client:</strong> ${invoice.clientName}</p>
                    <p><strong>Email:</strong> ${invoice.clientEmail}</p>
                    <p><strong>Date:</strong> ${invoice.date}</p>
                    <p><strong>Prix:</strong> ${invoice.amount}</p>
                    <button class="edit" data-index="${index}">Éditer</button>
                    <button class="delete" data-index="${index}">Supprimer</button>
                    <button class="create-pdf" data-index="${index}">Créer PDF</button>
                </div>
            `;
        });
    }
    invoiceList.style.display = "block";

    // Appeler la fonction pour attacher les écouteurs d'événements "Créer PDF"
    pdfInvoice();
}


/*============================================================================
 FONCTION : EDITER LA FACTURE
=============================================================================*/
function editInvoice(index) {

    const editInvoiceForm = document.getElementById("editInvoiceForm");
    const invoiceToEdit = invoices[index];

    // Cacher le boutton (Afficher/Cacher les factures)
    showInvoicesButton.style.display = "none";

    // Remplissez le formulaire d'édition avec les détails de la facture existante
    document.getElementById("editInvoiceNumber").value = invoiceToEdit.number;
    document.getElementById("editClientName").value = invoiceToEdit.clientName;
    document.getElementById("editClientEmail").value = invoiceToEdit.clientEmail;
    document.getElementById("editInvoiceDate").value = invoiceToEdit.date;
    document.getElementById("editInvoiceAmount").value = invoiceToEdit.amount;

    // Affichez le formulaire d'édition et masquez la liste des factures
    editForm.style.display = "block";
    document.getElementById("invoiceList").style.display = "none";

    // Gérez la mise à jour de la facture lorsque le bouton "Mettre à jour" est cliqué
    editInvoiceForm.addEventListener("submit", (e) => {

        // e.preventDefault() permet d'éviter la soumission du formulaire 
        e.preventDefault();

        // Mettez à jour les détails de la facture dans le tableau
        invoices[index] = {
            number: document.getElementById("editInvoiceNumber").value,
            clientName: document.getElementById("editClientName").value,
            clientEmail: document.getElementById("editClientEmail").value,
            date: document.getElementById("editInvoiceDate").value,
            amount: document.getElementById("editInvoiceAmount").value,
        };

        // Enregistrez la mise à jour dans le localStorage
        localStorage.setItem("invoices", JSON.stringify(invoices));

        // Affichez la liste des factures mise à jour
        displayInvoices();



        // Affichez le message de modification
        const modificationMessage = document.getElementById("modificationMessage");
        modificationMessage.style.display = "block";
        modificationMessage.textContent = "Facture modifiée avec succès !";


        // Masquez le message de modification après quelques secondes (facultatif)
        setTimeout(() => {
            modificationMessage.style.display = "none";
        }, 3000); // Masquez après 3 secondes (ajustez le délai selon vos besoins)

        // Masquez le formulaire d'édition
        editForm.style.display = "none";
        // Masquez lea liste des factures
        invoiceList.style.display = "none";
        // Affichez le boutton (Afficher/Cacher les factures)
        showInvoicesButton.style.display = "block";
        showInvoicesButton.textContent = "Afficher les factures";
        // Afficher le conteneur principal
        wrapper.style.display = "block";
        console.log('wrapper', wrapper);
        // Afficher le formulaire de création de factures
        invoiceForm.style.display = "block";
        console.log('invoiceForm', invoiceForm);

    });

    // Gérez l'annulation de l'édition lorsque le bouton "Annuler" est cliqué
    document.getElementById("cancelEdit").addEventListener("click", () => {
        // Masquez le formulaire d'édition et affichez la liste des factures
        editForm.style.display = "none";
        // Afficher la liste des factures
        document.getElementById("invoiceList").style.display = "block";
        // Afficher le boutton (Afficher/Cacher les factures)
        showInvoicesButton.style.display = "block";
    });
}


/*============================================================================
Gérer l'événement pour afficher la liste des factures
=============================================================================*/

showInvoicesButton.addEventListener("click", () => {
    const invoiceList = document.getElementById("invoiceList");

    // Vérifiez si la liste des factures est actuellement affichée
    if (invoiceList.style.display === "none" || invoiceList.style.display === "") {
        // Si elle est cachée, affichez-la et changez le texte du bouton
        invoiceList.style.display = "block";
        showInvoicesButton.textContent = "Cacher les factures";
        wrapper.style.display = 'none';
        displayInvoices();
    } else {
        // Sinon, cachez-la et changez le texte du bouton
        invoiceList.style.display = "none";
        showInvoicesButton.textContent = "Afficher les factures";
        wrapper.style.display = 'block';
    }
});



/*============================================================================
Gérer les événements de modification et de suppression de facture 
=============================================================================*/

// Fonction pour afficher la fenêtre modale de confirmation de suppression
function showDeleteModal(indexToDelete) {
    const modal = document.getElementById("deleteModal");
    modal.style.display = "block";

    // Ajoutez l'index de la facture à supprimer en tant qu'attribut "data-index"
    document.getElementById("confirmDelete").setAttribute("data-index", indexToDelete);
}

// Fonction pour masquer la fenêtre modale de confirmation de suppression
function hideDeleteModal() {
    const modal = document.getElementById("deleteModal");
    modal.style.display = "none";

    // Réinitialisez l'attribut "data-index" après la suppression
    document.getElementById("confirmDelete").removeAttribute("data-index");
}

// Fonction pour afficher le message de suppression
function showDeleteMessage() {
    const deleteMessage = document.getElementById("deleteMessage");
    deleteMessage.style.display = "block"; // Afficher le message
    deleteMessage.textContent = "Facture supprimée avec succès !";

    // Masquer le message après 3 secondes (3000 millisecondes)
    setTimeout(() => {
        deleteMessage.style.display = "none"; // Masquer le message après 3 secondes
    }, 3000); // 3000 millisecondes (3 secondes)
}

// Écouteur d'événement pour gérer les clics sur la liste des factures
invoiceList.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit")) {
        // Gestion de l'édition de facture (inchangée)
        const index = event.target.getAttribute("data-index");
        editInvoice(index); // Appeler la fonction d'édition avec l'index de la facture
    } else if (event.target.classList.contains("delete")) {
        // Gestion de la demande de suppression via la fenêtre modale
        const indexToDelete = event.target.getAttribute("data-index");

        // Afficher la fenêtre modale de confirmation
        showDeleteModal(indexToDelete);
    }
});

// Écouteur d'événement pour le clic sur le bouton "Supprimer" de la fenêtre modale
document.getElementById("confirmDelete").addEventListener("click", () => {
    // Récupérez l'index de la facture à supprimer à partir de l'attribut "data-index"
    const indexToDelete = document.getElementById("confirmDelete").getAttribute("data-index");

    // Insérez ici la logique pour effectuer la suppression réelle (comme décrit précédemment)
    if (indexToDelete !== null) {

        // Supprime la facture à la position indiquée de l'attribut "data-index" de l'objet invoices 
        invoices.splice(indexToDelete, 1);

        // Enregistrez la mise à jour dans le localStorage
        localStorage.setItem("invoices", JSON.stringify(invoices));

        // Afficher un message de suppression réussie
        showDeleteMessage("La facture a été supprimée avec succès.")

        // Masquer la fenêtre modale de confirmation
        hideDeleteModal();

        // Cacher la liste des factures
        document.getElementById("invoiceList").style.display = "none";

        // Actualiser le texte du bouton
        document.getElementById("showInvoices").innerText = 'Afficher les factures';

        // Masquez le formulaire d'édition
        editForm.style.display = "none";
        // Masquez lea liste des factures
        invoiceList.style.display = "none";
        // Affichez le boutton (Afficher/Cacher les factures)
        showInvoicesButton.style.display = "block";
        showInvoicesButton.textContent = "Afficher les factures";
        // Afficher le conteneur principal
        wrapper.style.display = "block";
        console.log('wrapper', wrapper);
        // Afficher le formulaire de création de factures
        invoiceForm.style.display = "block";
        console.log('invoiceForm', invoiceForm);
    }
});

// Écouteur d'événement pour le clic sur le bouton "Annuler" de la fenêtre modale
document.getElementById("cancelDelete").addEventListener("click", () => {
    // Masquer la fenêtre modale de confirmation sans effectuer de suppression
    hideDeleteModal();
});

// Écouteur d'événement pour le clic sur le bouton de fermeture de la fenêtre modale
document.getElementById("closeModal").addEventListener("click", () => {
    // Masquer la fenêtre modale de confirmation sans effectuer de suppression
    hideDeleteModal();
});
