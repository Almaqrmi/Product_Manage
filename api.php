<?php
header('Content-Type: application/json');
require 'db.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'add':
        addProduct();
        break;
    case 'get':
        getProducts();
        break;
    case 'update':
        updateProduct();
        break;
    case 'delete':
        deleteProduct();
        break;
    case 'deleteAll':
        deleteAllProducts();
        break;
    case 'search':
        searchProducts();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

function addProduct() {
    global $conn;

    $title = $_POST['Title'];
    $price = $_POST['Price'];
    $taxes = $_POST['Taxes'];
    $ads = $_POST['Ads'];
    $discount = $_POST['Discount'];
    $total = $_POST['Total'];
    $category = $_POST['Category'];

    // معالجة الصورة
    $image = '';
    if (isset($_FILES['Image']) && $_FILES['Image']['error'] === UPLOAD_ERR_OK) {
        $image = 'uploads/' . basename($_FILES['Image']['name']);
        move_uploaded_file($_FILES['Image']['tmp_name'], $image);
    }

    $stmt = $conn->prepare("INSERT INTO products (title, price, taxes, ads, discount, total, category, image) 
                           VALUES (:title, :price, :taxes, :ads, :discount, :total, :category, :image)");
    $result = $stmt->execute([
        ':title' => $title,
        ':price' => $price,
        ':taxes' => $taxes,
        ':ads' => $ads,
        ':discount' => $discount,
        ':total' => $total,
        ':category' => $category,
        ':image' => $image,
    ]);

    echo json_encode(['success' => $result]);
}

function getProducts() {
    global $conn;
    
    $stmt = $conn->query("SELECT * FROM products ORDER BY id DESC");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($products);
}

function updateProduct() {
    global $conn;

    $id = $_POST['id'];
    $title = $_POST['Title'];
    $price = $_POST['Price'];
    $taxes = $_POST['Taxes'];
    $ads = $_POST['Ads'];
    $discount = $_POST['Discount'];
    $total = $_POST['Total'];
    $category = $_POST['Category'];

    $image = '';
    if (isset($_FILES['Image']) && $_FILES['Image']['error'] === UPLOAD_ERR_OK) {
        $image = 'uploads/' . basename($_FILES['Image']['name']);
        move_uploaded_file($_FILES['Image']['tmp_name'], $image);
    }

    $stmt = $conn->prepare("UPDATE products SET 
                           title = :title, 
                           price = :price, 
                           taxes = :taxes, 
                           ads = :ads, 
                           discount = :discount, 
                           total = :total, 
                           category = :category, 
                           image = IF(:image != '', :image, image) 
                           WHERE id = :id");

    $result = $stmt->execute([
        ':title' => $title,
        ':price' => $price,
        ':taxes' => $taxes,
        ':ads' => $ads,
        ':discount' => $discount,
        ':total' => $total,
        ':category' => $category,
        ':image' => $image,
        ':id' => $id
    ]);

    echo json_encode(['success' => $result]);
}

function deleteProduct() {
    global $conn;
    
    $id = $_GET['id'];
    
    $stmt = $conn->prepare("DELETE FROM products WHERE id = :id");
    $result = $stmt->execute([':id' => $id]);
    
    echo json_encode(['success' => $result]);
}

function deleteAllProducts() {
    global $conn;
    
    $stmt = $conn->prepare("TRUNCATE TABLE products");
    $result = $stmt->execute();
    
    echo json_encode(['success' => $result]);
}

function searchProducts() {
    global $conn;

    $search = $_GET['search'] ?? '';
    $type = $_GET['type'] ?? 'title';

    if ($type === 'title') {
        $stmt = $conn->prepare("SELECT * FROM products WHERE title LIKE :search ORDER BY id DESC");
    } else {
        $stmt = $conn->prepare("SELECT * FROM products WHERE category LIKE :search ORDER BY id DESC");
    }

    $stmt->execute([':search' => "%$search%"]);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);
}
?>