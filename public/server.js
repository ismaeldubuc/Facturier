import Express from "express";
import { join } from 'path';
import cors from "cors";
import PDFDocument from "pdfkit";
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
});
app.use('/public', Express.static(join('assets')));
app.listen(PORT, () => {
    console.info("API Listening on port " + PORT);
});
