const socket = io();

const productsCart = document.getElementById("products-cart");
const btnBackMenu = document.getElementById("btn-back-menu");
const totalCard = document.getElementById("total-cart");
const generateTicket = document.getElementById("generate-ticket");

if (!CART_ID) {
  CART_ID = localStorage.getItem("carrito");
}
let userId = null;

const getCartId = async () => {
    try {
        const response = await fetch(`/cart/${CART_ID}`, { method: "GET" });
        const data = await response.json();
        const productsId = data.data._id;
        return productsId;
    } catch (error) {
        console.error("Error al obtener el ID del carrito:", error);
    }
};
getCartId().then((id) => {
    console.log("ID del carrito:", id);
});

const carritoCompras = async () => {
    const response = await fetch(`/cart/${CART_ID}`, { method: "GET" });
    const data = await response.json();

    const products = data.data.products;
    renderCarts(products);
};

const getCurrentUser = async () => {
  const res = await fetch("/api/current-user");
  
  if (res.ok) {
    return await res.json();
  }
  return null;
};
const userCurrent = getCurrentUser().then((user) => {
userId = user._id;});

function renderCarts(products) {
    productsCart.innerHTML = "";

    products.forEach((cart) => {
        const product = cart.product;
        if (!product) {
            console.warn("Producto nulo en el carrito", cart);
            return;
        }

        let precioFinal = product.price * cart.quantity;

        const card = document.createElement("div");
        card.classList.add("card");


        const productName = document.createElement("h4");
        productName.textContent = `Nombre: ${product.title}`;

        const productImage = document.createElement("img");
        productImage.src = `/image/product/${product.image || "default.png"}`
        productImage.alt = `Imagen de ${product.title}`;
        productImage.classList.add("product-image");

        const productQuantity = document.createElement("p");
        productQuantity.textContent = `Cantidad: ${cart.quantity}`;

        const oneMoreProduct = document.createElement("button");
        oneMoreProduct.innerHTML = "+"
        oneMoreProduct.onclick = async () => {
            if (cart.quantity >= product.stock) {
                alert("No hay suficiente stock");
                return;
            };
            try {
                const id = await getCartId();
                const productId = product._id;
                const quantity = cart.quantity + 1;
                socket.emit("add-product", { id, productId, quantity });
                socket.emit("update-price", { id, productId, precioFinal });
                setTimeout(() => {
                    carritoCompras();
                }, 300);
            } catch (error) {
                console.error("Error al agregar producto:", error);
            }
        }

        const oneLessProduct = document.createElement("button");
        oneLessProduct.innerHTML = "-"
        oneLessProduct.onclick = async () => {
            if (cart.quantity === 0) {
                alert("Borra el producto");
                return;
            };
            try {
                const id = await getCartId();
                const productId = product._id;
                const quantity = cart.quantity - 1;
                socket.emit("add-product", { id, productId, quantity });
                socket.emit("update-price", { id, productId, precioFinal });
                setTimeout(() => {
                    carritoCompras();
                }, 300);
            } catch (error) {
                console.error("Error al agregar producto:", error);
            }
        }

        const productPrice = document.createElement("p");
        productPrice.textContent = `Precio: $${precioFinal}`;

        const generateTicket = document.createElement("button");
        generateTicket.innerHTML = "Generar ticket";

        const btnDeleteProduct = document.createElement("button");
        btnDeleteProduct.innerHTML = "Eliminar producto";
        btnDeleteProduct.onclick = async () => {
            const id = await getCartId();
            const productId = product._id;
            socket.emit("delete-product", { id, productId });
            setTimeout(() => {
                carritoCompras();
            }, 300);
        };


        card.appendChild(productName);
        card.appendChild(productImage);
        card.appendChild(productQuantity);
        card.appendChild(oneMoreProduct);
        card.appendChild(oneLessProduct);
        card.appendChild(productPrice);
        card.appendChild(btnDeleteProduct);
        productsCart.appendChild(card);
    });


    const totalPrice = products.reduce((acc, cart) => {
        const item = cart.product;

        if (!item) {
            console.warn("Producto nulo en el carrito", cart);
            return acc;
        }
        return acc + (item.price * cart.quantity);
    }, 0);
    totalCard.textContent = totalPrice;

    btnDeletedCart.onclick = async () => {
        const id = await getCartId();
        const user = userId;

        socket.emit("clear-cart", { id , user });
        localStorage.removeItem("carrito");
        productsCart.innerHTML = ""; 
    };
}

btnBackMenu.addEventListener("click", () => {
    window.location.href = "/home";
});

carritoCompras();

socket.on("new-cart", async ({ cartId }) => {
    localStorage.setItem("carrito", cartId);
    CART_ID = cartId;

    carritoCompras();
});