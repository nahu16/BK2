const socket = io();

const productsContainer = document.getElementById("products-list");
const productForm = document.getElementById("product-form");
const errorMessage = document.getElementById("error-message");
const inputProductId = document.getElementById("input-product-id");
const btnDeletedProduct = document.getElementById("btn-deleted-product");
const btnUpdateProduct = document.getElementById("update-product");
const btnBackMenu = document.getElementById("btn-back-menu");

socket.on("products-list", (data) => {
    const products = data.products || [];
    productsContainer.innerHTML = "";

    products.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const productId = document.createElement("p");
        productId.textContent = `Id: ${producto._id}`;

        const productName = document.createElement("h4");
        productName.textContent = `Nombre: ${producto.title}`;

        const productDescription = document.createElement("p");
        productDescription.textContent = `Descripción: ${producto.description}`;

        const productCode = document.createElement("p");
        productCode.textContent = `Codigo: ${producto.code}`;

        const productPrice = document.createElement("p");
        productPrice.textContent = `Precio: $ ${producto.price}`;

        const productStock = document.createElement("p");
        productStock.textContent = `Stock: ${producto.stock}`;       


        card.appendChild(productId);
        card.appendChild(productName);
        card.appendChild(productDescription);
        card.appendChild(productCode);
        card.appendChild(productPrice);
        card.appendChild(productStock);

        productsContainer.appendChild(card);
    });
});

btnUpdateProduct.addEventListener("click", async (e) => {
    e.preventDefault();

    const id = document.getElementById("input-product-id").value;
    const form = document.getElementById("form-update-product");
    const formData = new FormData(form);

    const productData = Object.fromEntries(formData.entries());
    Object.keys(productData).forEach(key => {
        if(productData[key]===""){
            delete productData[key]
        }
    })
    socket.emit("update-product", {
        id,
        productData});
});


btnDeletedProduct.addEventListener("click", ()=>{
    const id = inputProductId.value;
    inputProductId.innerHTML="";
    errorMessage.innerHTML = "";
    if (id && id.trim() !==""){
        socket.emit("delete-product", { id });
    }
});

btnBackMenu.addEventListener("click", ()=>{
    window.location.href = '/home';
    console.log("hace click?")
});
socket.on("error-message", (data) => {
    errorMessage.innerHTML = data.message;
});

