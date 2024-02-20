<?php
session_start();
$bdd = new PDO('mysql:host=localhost;dbname=factures;charset=utf8', 'root', 'root');

if (isset($_POST['envoi'])) {
    if (!empty($_POST['firstName']) && !empty($_POST['secondName']) && !empty($_POST['email']) && !empty($_POST['mdp'])) {
        $firstName = htmlspecialchars($_POST['firstName']);
        $secondName = htmlspecialchars($_POST['secondName']);
        $email = htmlspecialchars($_POST['email']);
        $mdp = password_hash($_POST['mdp'], PASSWORD_DEFAULT);

        $req = $bdd->prepare('INSERT INTO users (prenom, nom, email, mdp) VALUES (:prenom, :nom, :email, :mdp)');
        $success = $req->execute(array(
            'prenom' => $firstName,
            'nom' => $secondName,
            'email' => $email,
            'mdp' => $mdp
        ));

        if ($success) {
            $_SESSION['user_id'] = $bdd->lastInsertId();
            header('Location: index.php');
            exit();
        } else {
            echo "Erreur lors de l'inscription";
        }
    } else {
        echo "Veuillez compléter tous les champs...";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion</title>
    <script src="redirection.js" defer></script>
</head>
<body>
    <form id="connectForm" method="post">
        <h1 class="mb-3">Inscription</h1>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="firstName">Prénom</label>
                            <input type="text" class="form-control" id="firstName" name="firstName" placeholder="" value="" required
                                autoComplete="nope">

                            <label for="secondName">Nom</label>
                            <input type="text" class="form-control" id="secondName" name="secondName" placeholder="" value="" required
                                autoComplete="nope">
                            
                            <label for="email">Email</label>
                            <input type="email" class="form-control" id="email" name="email" placeholder="" value="" required autoComplete="nope">

                            <label for="mdp">mot de passe</label>
                            <input type="password" class="form-control" id="mdp" name="mdp" placeholder="" value="" required
                                autoComplete="nope">
                        </div>

                        <button class="btn btn-primary" type="submit" name="envoi">S'inscrire</button>
                        <button id="retour" onclick="toRedirection()">Retour</button>
                    </div>
    </form>
</body>
</html>