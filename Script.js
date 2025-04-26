const Submit = document.getElementById('submit');
const Title = document.getElementById('title');
const Price = document.getElementById('price');
const Taxes = document.getElementById('taxes');
const Ads = document.getElementById('ads');
const Discount = document.getElementById('discount');
const Total = document.getElementById('total');
const Count = document.getElementById('count');
const Category = document.getElementById('category');
const Image = document.getElementById('image'); 
let btnAddEdit = 'add';
let temp = null;

let arrayProd = [];

function ShowData() {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    arrayProd.forEach((product, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td>${product.taxes}</td>
            <td>${product.ads}</td>
            <td>${product.discount}</td>
            <td>${product.total}</td>
            <td>${product.category}</td>
            <td><img src="${product.image}" alt="Product Image" width="50"></td>            
            <td><button onclick="editProduct(${index})">Edit</button> </td>                
            <td><button onclick="deleteProduct(${product.id})">Delete</button> </td>
        `;

        tbody.appendChild(row);
    });
}

async function deleteProduct(id) {
    try {
        const response = await fetch(`api.php?action=delete&id=${id}`, { method: 'GET' });
        const result = await response.json();

        if (result.success) {
            fetchProducts();
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

function editProduct(index) {
    const product = arrayProd[index];

    Title.value = product.title;
    Price.value = product.price;
    Taxes.value = product.taxes;
    Ads.value = product.ads;
    Discount.value = product.discount;
    Total.innerHTML = product.total;
    Count.style.display = 'none';
    Category.value = product.category;
    Image.value = ''; 

    btnAddEdit = 'edit';
    temp = product.id;
    Submit.innerHTML = 'Update';
}

async function fetchProducts() {
    try {
        const response = await fetch('api.php?action=get');
        arrayProd = await response.json();
        ShowData();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

Submit.onclick = async function () {
    const formData = new FormData();
    formData.append('Title', Title.value.toLowerCase());
    formData.append('Price', Price.value);
    formData.append('Taxes', Taxes.value);
    formData.append('Ads', Ads.value);
    formData.append('Discount', Discount.value);
    formData.append('Total', Total.innerHTML);
    formData.append('Count', Count.value);
    formData.append('Category', Category.value.toLowerCase());
    formData.append('Image', Image.files[0]); // إضافة الصورة

    if (Title.value !== '' && Category.value !== '') {
        try {
            let response;
            if (btnAddEdit === 'add') {
                response = await fetch('api.php?action=add', {
                    method: 'POST',
                    body: formData,
                });
            } else if (btnAddEdit === 'edit') {
                formData.append('id', temp); // إرسال id مع الطلب
                response = await fetch('api.php?action=update', {
                    method: 'POST',
                    body: formData,
                });
                Submit.innerHTML = 'Add';
                btnAddEdit = 'add';
                Count.style.display = 'block';
            }

            const result = await response.json();
            if (result.success) {
                fetchProducts();
                clearInput();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        clearInput();
    }
};

function clearInput() {
    Title.value = '';
    Price.value = '';
    Taxes.value = '';
    Ads.value = '';
    Discount.value = '';
    Total.innerHTML = '0';
    Count.value = '';
    Category.value = '';
    Image.value = '';
}

document.addEventListener('DOMContentLoaded', fetchProducts);

const Search = document.getElementById('search');
const SearchType = document.getElementById('searchType');
const SearchBtn = document.getElementById('searchBtn');

SearchBtn.onclick = async function () {
    const query = Search.value.trim();
    const type = SearchType.value;

    if (query !== '') {
        try {
            const response = await fetch(`api.php?action=search&search=${query}&type=${type}`);
            const result = await response.json();

            if (Array.isArray(result)) {
                arrayProd = result; // تحديث البيانات المعروضة
                ShowData();
            } else {
                console.error('Search failed:', result.error);
            }
        } catch (error) {
            console.error('Error during search:', error);
        }
    } else {
        fetchProducts(); 
    }
};

function GetTotal() {
    // الحصول على القيم من الحقول
    const price = parseFloat(Price.value) || 0;
    const taxes = parseFloat(Taxes.value) || 0;
    const ads = parseFloat(Ads.value) || 0;
    const discount = parseFloat(Discount.value) || 0;

    // حساب المجموع
    const total = price + taxes + ads - discount;

    // تحديث عنصر Total
    if (total >= 0) {
        Total.innerHTML = total.toFixed(2); 
        Total.style.color = "green"; 
    } else {
        Total.innerHTML = "0.00"; 
        Total.style.color = "red"; 
    }
}