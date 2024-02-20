export class FormInput{

    form: HTMLFormElement; 
    type: HTMLSelectElement
    FirstName: HTMLInputElement
    lastName:HTMLInputElement
    address:HTMLInputElement
    country:HTMLInputElement
    town:HTMLInputElement
    zip:HTMLInputElement
    product:HTMLInputElement
    price:HTMLInputElement
    quantity:HTMLInputElement
    tva:HTMLInputElement
    //constructeur

    constructor() {
        this.form = document.getElementById("form") as HTMLFormElement;
        this.type = document.getElementById("type") as HTMLSelectElement;
        this.FirstName = document.getElementById("firstName") as HTMLInputElement;
        this.lastName = document.getElementById("lastName") as HTMLInputElement;
        this.address = document.getElementById("address") as HTMLInputElement;
        this.country = document.getElementById("country") as HTMLInputElement;
        this.town = document.getElementById("town") as HTMLInputElement;
        this.zip = document.getElementById("zip") as HTMLInputElement;
        this.product = document.getElementById("product") as HTMLInputElement;
        this.price = document.getElementById("price") as HTMLInputElement;
        this.quantity = document.getElementById("quantity") as HTMLInputElement;
        this.tva = document.getElementById("tva") as HTMLInputElement
        //listener
        this.submitFormListener();
    }

    private submitFormListener(): void {
        this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    private handleFormSubmit(e: Event) {
        e.preventDefault();

        const inputs = this.inputDatas();

        if (Array.isArray(inputs)){
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

    private inputDatas(): [string, string, string, string, string, string, number, string, number, number, number]|void{
        
        const type = this.type.value;
        const FirstName = this.FirstName.value;
        const lastName = this.lastName.value;
        const address =  this.address.value;
        const country = this.country.value;
        const town =  this.town.value;
        const zip =  this.zip.valueAsNumber;
        const product =  this.product.value;
        const price = this.price.valueAsNumber;
        const quantity = this.quantity.valueAsNumber;
        const tva = this.tva.valueAsNumber;
        
        if(zip>0 && price >0 && quantity >0 && tva >0 ){
        return [type, FirstName, lastName, address, country, town, zip, product, price, quantity, tva]}
        else{
            alert("les valeurs numérique doivent etre positives");
            return;
        }}
    }
