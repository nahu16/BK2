const socket = io();

const btnCartProducts = document.getElementById("btn-cart-products");
const productsContainer = document.getElementById("products-list");


const loadProductsList = async () => {
    const response = await fetch(`/products`, { method: "GET" });
    const products = await response.json();
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

        agregarAlCarrito.onclick = async () => {
            try {
                const response = await fetch(`cart/products/${prod._id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Error al agregar producto al carrito");
                }

                alert("Producto agregado al carrito!");
            } catch (error) {
                console.error("Error al agregar al carrito:", error);
                alert("Hubo un error al agregar el producto al carrito.");
            }
        };


        const descripcionId = document.createElement("p");
        descripcionId.innerHTML = `descripcionId: ${prod.description}`;

        const productImage = document.createElement("img");
        productImage.src = `/image/product/${prod.image || "default.png"}`
        productImage.alt = `Imagen de ${prod.title}`;
        productImage.classList.add("product-image");

        card.appendChild(productImage);
        card.appendChild(productId);
        card.appendChild(productName);
        card.appendChild(descripcionId)
        card.appendChild(productPrice);
        card.appendChild(agregarAlCarrito);

        productsContainer.appendChild(card);
    });
};

btnCartProducts.addEventListener("click", () => {
    window.location.href = '/carrito';
});

loadProductsList();

socket.on("products-list", ({ products }) => {
    renderProducts(products);
});