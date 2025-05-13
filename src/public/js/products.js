/*const socket = io();

const btnCartProducts = document.getElementById("btn-cart-products");
const productsContainer = document.getElementById("products-list");

let sortDirection = "asc";

const loadProductsList = async()=>{
    const response = await fetch(`/products`, { method:"GET" });
    const data = await response.json();
    const products = data.payload || [];
    //const pagination = data.pagination || [];

    productsContainer.innerHTML = "";

    products.forEach((prod) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const productId = document.createElement("p");
        productId.textContent = `Id: ${prod._id}`;

        const productName = document.createElement("h4");
        productName.textContent = `Nombre: ${prod.title}`;

        const productPrice = document.createElement("p");
        productPrice.textContent = `Precio: $ ${prod.price}`;

        const agregarAlCarrito = document.createElement("button");
        agregarAlCarrito.innerHTML = "Agregar al carrito";
        agregarAlCarrito.onclick = ()=>{
            const cartId = JSON.parse(localStorage.getItem("carrito"));

            const products = [{ product: prod._id, quantity: 1 }];
            if(cartId){
                socket.emit("cart", { cartId, products });

            }else{
                socket.emit("add-cart", { products });
            }
        };

        const descripcionId = document.createElement("button");
        descripcionId.innerHTML = "Ver más...";
        descripcionId.addEventListener("click", ()=>{
            window.location.href =`/descripcionId/${prod._id}`;
        });

        card.appendChild(productId);
        card.appendChild(productName);
        card.appendChild(productPrice);
        card.appendChild(agregarAlCarrito);
        card.appendChild(descripcionId);
        productsContainer.appendChild(card);
    });
    paginationContainer.innerHTML = "";
    const totalPages = pagination.totalPages || 1;

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");
        button.textContent = page;
        button.addEventListener("click", () => {
            currentPage = page;
            loadProductsList();
        });
        paginationContainer.appendChild(button);
    } 
}*/

const socket = io();

const btnCartProducts = document.getElementById("btn-cart-products");
const productsContainer = document.getElementById("products-list");

let sortDirection = "asc";

const loadProductsList = async () => {
    const response = await fetch(`/products`, { method: "GET" });
    const products = await response.json(); // ahora `products` es el array directamente
    renderProducts(products);
};

function renderProducts(products) {
    productsContainer.innerHTML = "";

    products.forEach((prod) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const productId = document.createElement("p");
        productId.textContent = `Id: ${prod._id}`;

        const productName = document.createElement("h4");
        productName.textContent = `Nombre: ${prod.title}`;

        const productPrice = document.createElement("p");
        productPrice.textContent = `Precio: $ ${prod.price}`;

        const agregarAlCarrito = document.createElement("button");
        agregarAlCarrito.innerHTML = "Agregar al carrito";
        agregarAlCarrito.onclick = () => {
            const cartId = JSON.parse(localStorage.getItem("carrito"));
            const products = [{ product: prod._id, quantity: 1 }];
            if (cartId) {
                socket.emit("cart", { cartId, products });
            } else {
                socket.emit("add-cart", { products });
            }
        };

        const descripcionId = document.createElement("button");
        descripcionId.innerHTML = "Ver más...";
        descripcionId.addEventListener("click", () => {
            window.location.href = `/descripcionId/${prod._id}`;
        });

        const productImage = document.createElement("img");
            productImage.src = `/image/product/${prod.image || "default.png"}`
            //`image/product/${uniqueName}` || "/image/product/default.png"; // en caso de que no tenga imagen
            productImage.alt = `Imagen de ${prod.title}`;
            productImage.classList.add("product-image");

        card.appendChild(productImage);
        card.appendChild(productId);
        card.appendChild(productName);
        card.appendChild(productPrice);
        card.appendChild(agregarAlCarrito);
        card.appendChild(descripcionId);
        productsContainer.appendChild(card);
    });
    };

btnCartProducts.addEventListener("click", ()=>{
    window.location.href = '/carrito';
});

const sortAscButton = document.getElementById("sort-asc");
const sortDescButton = document.getElementById("sort-desc");

sortAscButton.addEventListener("click", () => {
    sortDirection = "asc";
    loadProductsList();
});

sortDescButton.addEventListener("click", () => {
    sortDirection = "desc";
    loadProductsList();
});

loadProductsList();

socket.on("products-list", ({ products }) => {
    renderProducts(products);
});