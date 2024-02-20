<?php
session_start();
$bdd = new PDO('mysql:host=localhost;dbname=factures;charset=utf8', 'root', 'root');

if (isset($_POST['se_connecter'])) {
    if (!empty($_POST['email']) && !empty($_POST['mdp'])) {
        $identifiant = htmlspecialchars($_POST['email']);
        $mdp = htmlspecialchars($_POST['mdp']);

        $req = $bdd->prepare('SELECT * FROM users WHERE email = :email');
        $req->execute(array('email' => $identifiant));
        $user = $req->fetch();

        if ($user && password_verify($mdp, $user['mdp'])) {
            $_SESSION['user_id'] = $user['id'];
            header('Location: index.php');
            exit();
        } else {
            echo "Identifiant ou mot de passe incorrect";
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
        <h1 class="mb-3">Connexion</h1>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="email">adresse mail</label>
                <input type="email" class="form-control" id="email" name="email" placeholder="" value="" required autoComplete="nope">

                <label for="mdp">mot de passe</label>
                <input type="password" class="form-control" id="mdp" name="mdp" placeholder="" value="" required autoComplete="nope">
            </div>

            <button class="btn btn-primary" type="submit" name="se_connecter">Se connecter</button>
            <button type="button" id="retour" onclick="toRedirection()">Retour</button>
        </div>
    </form>
</body>
</html>