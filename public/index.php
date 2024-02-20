<?php
session_start();

if(isset($_POST['envoyer'])) { 
    try {
        $bdd = new PDO('mysql:host=localhost;dbname=factures;charset=utf8', 'root', 'root');
    } catch(Exception $e) {
        die('Impossible de se connecter à la base de donnée : '.$e->getMessage());
    }
   
    $userId = $_SESSION['user_id'] ?? null; 
    
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $adresse = $_POST['address'];
    $country = $_POST['country'];
    $town = $_POST['town'];
    $zip = $_POST['zip'];
    $product = $_POST['product'];
    $price = $_POST['price'];
    $quantity = $_POST['quantity'];
    $tva = $_POST['tva'];
    
    if($userId) {
        $req = $bdd->prepare('INSERT INTO factures (user_id, prenom, nom, adresse, pays, commune, codePostal, produit, prix, quantite, tva) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $success = $req->execute([$userId, $firstName, $lastName, $adresse, $country, $town, $zip, $product, $price, $quantity, $tva]);
    }}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description"
        content="Générateur de facture en pdf" />
    <meta name="author" content="Ismael Dubuc" />
    <title>Facturier</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
        integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous" />
</head>

<body class="bg-light">
    <div class="container">
        <div class="py-5 text-center">
            <h1 class="display-2" id="logo">Facturier</h1>
            <p class="lead">Le générateur de factures</p>
        </div>

        <div class="row" id="form-container">
            <div class="col-md-10 offset-md-1">

                <form id="form" method="post">
                    <h4 class="mb-3">Type de document</h4>
                    <div class="row">
                        <div class="col-md-5 mb-3">
                            <select class="custom-select d-block w-100" id="type" required autoComplete="nope">
                                <option value="invoice">Facture</option>
                            </select>
                        </div>
                    </div>

                    <hr class="mb-4">

                    <h4 class="mb-3">Informations du client</h4>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="firstName">Prénom</label>
                            <input type="text" class="form-control" id="firstName" name="firstName" placeholder="" value="" required
                                autoComplete="nope">
                        </div>

                        <div class="col-md-6 mb-3">
                            <label for="lastName">Nom</label>
                            <input type="text" class="form-control" id="lastName" name="lastName" placeholder="" value="" required
                                autoComplete="nope">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="address">Adresse</label>
                        <input type="text" class="form-control" id="address" name="address" placeholder="" required
                            autoComplete="nope">
                    </div>

                    <div class="row">
                        <div class="col-md-5 mb-3">
                            <label for="country">Pays</label>
                            <input type="text" class="form-control" id="country" name="country" placeholder="" required
                                autoComplete="nope">
                        </div>

                        <div class="col-md-4 mb-3">
                            <label for="town">Commune</label>
                            <input type="text" class="form-control" id="town" name="town" placeholder="" required
                                autoComplete="nope">
                        </div>

                        <div class="col-md-3 mb-3">
                            <label for="zip">Code Postal</label>
                            <input type="number" class="form-control" id="zip" name="zip" placeholder="" required
                                autoComplete="nope">
                        </div>
                    </div>

                    <hr class="mb-4">
                    <h4 class="mb-3">Informations du produit /service</h4>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="product">Nom du produit/service</label>
                            <input type="text" class="form-control" id="product" name="product" placeholder="" required
                                autoComplete="nope">
                        </div>

                        <div class="col-md-2 mb-3">
                            <label for="price">Prix</label>
                            <input type="number" class="form-control" id="price" name="price" placeholder="" required
                                autoComplete="nope">
                        </div>

                        <div class="col-md-2 mb-3">
                            <label for="quantity">Quantité</label>
                            <input type="number" class="form-control" id="quantity" name="quantity" placeholder="" required
                                autoComplete="nope">
                        </div>

                        <div class="col-md-2 mb-3">
                            <label for="tva">TVA</label>
                            <input type="number" class="form-control" id="tva" name="tva" placeholder="" required
                                autoComplete="nope">
                        </div>
                    </div>

                    <div class="text-right">
                        <hr class="mb-4">
                        <button id="btnModal" type="button" class="btn btn-info invisible" data-toggle="modal"
                            data-target="#exampleModal">
                            Voir le document
                        </button>
                        <button class="btn btn-primary" type="submit" name="envoyer">Valider</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="col-12 mt-5 mb-5 text-center">
            <button type="button" class="btn btn-warning" id="historique">Voir son historique de facture pdf</button>
            <div id="stored-data" class="card mt-5"></div>
        </div>

    </div>
    <footer class="my-5 pt-5 text-muted text-center text-small">
        <p class="mb-1">&copy; 2024 Ismael Dubuc</p>
    </footer>
    </div>


    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
        integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"
        integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js"
        integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s"
        crossorigin="anonymous"></script>

    <script type="module" src="script.js"></script>
</body>

</html>