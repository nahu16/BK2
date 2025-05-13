const socket = io();

const productsContainer = document.getElementById("products-list");
const productForm = document.getElementById("product-form");
const errorMessage = document.getElementById("error-message");
const inputProductId = document.getElementById("input-product-id");
const btnDeletedProduct = document.getElementById("btn-deleted-product");
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

        const productStatus = document.createElement("p");
        productStatus.textContent = `Estado: ${producto.status}`;       


        card.appendChild(productId);
        card.appendChild(productName);
        card.appendChild(productDescription);
        card.appendChild(productCode);
        card.appendChild(productPrice);

        card.appendChild(productStatus);

        productsContainer.appendChild(card);
    });
});

/* productForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const form = event.target;
    const formdata = new FormData(form);

    errorMessage.innerHTML = "";
    form.reset();

    socket.emit("insert-product", {
        title: formdata.get("title"),
        description: formdata.get("description"),
        code: formdata.get("code"),
        price: parseFloat(formdata.get("price"))
    });
}); */

socket.on("product-created", () => {
    // Vuelvo a pedir el listado actualizado
    socket.emit("refresh-products");
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

