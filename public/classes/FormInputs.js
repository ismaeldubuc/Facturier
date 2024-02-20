export class FormInput {
    form;
    type;
    FirstName;
    lastName;
    address;
    country;
    town;
    zip;
    product;
    price;
    quantity;
    tva;
    //constructeur
    constructor() {
        this.form = document.getElementById("form");
        this.type = document.getElementById("type");
        this.FirstName = document.getElementById("firstName");
        this.lastName = document.getElementById("lastName");
        this.address = document.getElementById("address");
        this.country = document.getElementById("country");
        this.town = document.getElementById("town");
        this.zip = document.getElementById("zip");
        this.product = document.getElementById("product");
        this.price = document.getElementById("price");
        this.quantity = document.getElementById("quantity");
        this.tva = document.getElementById("tva");
        //listener
        this.submitFormListener();
    }
    submitFormListener() {
        this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
    }
    handleFormSubmit(e) {
        e.preventDefault();
        const inputs = this.inputDatas();
        if (Array.isArray(inputs)) {
            const [type, FirstName, lastName, address, country, town, zip, product, price, quantity, tva] = inputs;
            fetch('http://localhost:5050/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    FirstName,
                    lastName,
                    address,
                    country,
                    town,
                    zip,
                    product,
                    price,
                    quantity,
                    tva
                })
            })
                .then(response => response.blob())
                .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                const nomFichier = `Facture-${Date.now()}.pdf`;
                a.download = nomFichier;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
                .catch(error => console.error('Erreur lors du téléchargement du PDF:', error));
        }
    }
    inputDatas() {
        const type = this.type.value;
        const FirstName = this.FirstName.value;
        const lastName = this.lastName.value;
        const address = this.address.value;
        const country = this.country.value;
        const town = this.town.value;
        const zip = this.zip.valueAsNumber;
        const product = this.product.value;
        const price = this.price.valueAsNumber;
        const quantity = this.quantity.valueAsNumber;
        const tva = this.tva.valueAsNumber;
        if (zip > 0 && price > 0 && quantity > 0 && tva > 0) {
            return [type, FirstName, lastName, address, country, town, zip, product, price, quantity, tva];
        }
        else {
            alert("les valeurs numérique doivent etre positives");
            return;
        }
    }
}
