<?php
$servername = "localhost";
$username = "root";
$password = "admin";
$dbname = "nome_do_banco";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifique a conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}
?>


<?php
$servername = "localhost";
$username = "root";
$password = "admin";
$dbname = "nome_do_banco";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifique a conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}
?>


<?php
session_start();
include 'db_connect.php'; // Inclua o arquivo de conexão com o banco de dados

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepare a declaração SQL
    $stmt = $conn->prepare("SELECT id, senha FROM usuarios WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($id, $hashed_password);
    
    if ($stmt->num_rows > 0) {
        $stmt->fetch();
        // Verifique a senha
        if (password_verify($password, $hashed_password)) {
            // Login bem-sucedido
            $_SESSION['user_id'] = $id;
            header("Location: dashboard.php"); // Redirecionar para a página principal
            exit();
        } else {
            // Senha incorreta
            echo "Senha incorreta.";
        }
    } else {
        // Usuário não encontrado
        echo "Usuário não encontrado.";
    }
    
    $stmt->close();
    $conn->close();
}
?>