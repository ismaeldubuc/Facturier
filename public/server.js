import Express from "express";
import { join } from 'path';
import cors from "cors";
import PDFDocument from "pdfkit";
import mysql from 'mysql';
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'factures',
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});
const PORT = process.env.PORT || 5050;
const app = Express();
//Pour que mon front-end puisse communiquer avec mon API
app.use(cors());
app.use(Express.json());
app.get('/', (request, response, next) => {
    response.send("");
});
app.post('/', (request, response) => {
    const pdf = new PDFDocument();
    const nomFichier = `Facture-${Date.now()}.pdf`;
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename="${nomFichier}"`);
    //Titre 
    pdf.fontSize(30).text('Facture', { align: 'center' });
    pdf.moveDown();
    //Info client
    pdf.fontSize(12).text(`Nom: ${request.body.lastName} ${request.body.FirstName}`);
    pdf.moveDown();
    pdf.text(`Adresse: ${request.body.address}, ${request.body.zip} ${request.body.town}, ${request.body.country}`);
    pdf.moveDown();
    //Commande 
    pdf.text(`Produit: ${request.body.product}`);
    pdf.text(`Quantité: ${request.body.quantity}`);
    pdf.text(`Prix unitaire: ${request.body.price} €`);
    pdf.moveDown();
    pdf.text(`TVA: ${request.body.tva}%`);
    const prixTot = request.body.quantity * request.body.price;
    const tvaTot = prixTot * (request.body.tva / 100);
    pdf.text(`Total HT: ${prixTot} €`);
    pdf.text(`Montant TVA: ${tvaTot.toFixed(2)} €`);
    pdf.moveDown();
    pdf.fontSize(15).text(`Total TTC: ${(prixTot + tvaTot).toFixed(2)} €`, { underline: true });
    pdf.pipe(response);
    pdf.end();
    const prenom = `${request.body.FirstName}`;
    const nom = `${request.body.lastName}`;
    const adresse = `${request.body.address}`;
    const pays = `${request.body.country}`;
    const commune = `${request.body.town}`;
    const codePostal = `${request.body.zip}`;
    const produit = `${request.body.product}`;
    const prix = `${request.body.price}`;
    const quantite = `${request.body.quantity}`;
    const tva = `${request.body.tva}`;
    const query = 'INSERT INTO facture (id_user, prenom, nom, adresse, pays, commune, codePostal, produit, prix, quantite, tva) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, ["5", prenom, nom, adresse, pays, commune, codePostal, produit, prix, quantite, tva], (err, result) => {
        if (err)
            throw err;
        console.log('Données insérées avec succès dans la base de données');
    });
});
// -- 
app.use(Express.urlencoded({ extended: true }));
app.post('/inscription', (req, res) => {
    const { firstName, secondName, email, mdp } = req.body;
    const query = 'INSERT INTO users (prenom, nom, email, mdp) VALUES (?, ?, ?, ?)';
    connection.query(query, [firstName, secondName, email, mdp], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion dans la base de données:', err);
            return res.status(500).send('Erreur lors de l\'inscription');
        }
        console.log('Utilisateur inscrit avec succès');
        res.send('Inscription réussie');
    });
});
// --
app.use('/public', Express.static(join('assets')));
app.listen(PORT, () => {
    console.info("API Listening on port " + PORT);
});
