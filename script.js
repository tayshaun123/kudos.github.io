const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

const cartContent = document.querySelector(".cart-content");


// I put comments to the codes that I update, so my cart is still there even if I refresh it

//  Load saved cart when page reloads
window.addEventListener("load", () => {
    const savedCart = localStorage.getItem("cartHTML");
    const savedCount = localStorage.getItem("cartCount");
  if (savedCart) {
    cartContent.innerHTML = savedCart;
    cartItemCount = parseInt(savedCount) || 0;
    updateCartCount(0);
    updateTotalPrice();
    restoreCartEvents(); // Reattach event listeners to buttons
  }
});

const addCartButtons = document.querySelectorAll(".add-cart");
addCartButtons.forEach(button => {
     button.addEventListener("click", event => {
    const productBox = event.target.closest(".product-box");
    addToCart(productBox);
  });
});

const addToCart = productBox => {
    const productImgSrc = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    const productPrice = productBox.querySelector(".price").textContent;

    const cartItems = cartContent.querySelectorAll(".cart-product-title");    
  for (let item of cartItems) {
    if (item.textContent === productTitle) {
      alert("This item is already in the cart.");
      return;
    }
  }

    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.innerHTML = `
        <img src="${productImgSrc}" class="cart-img">
        <div class="cart-detail">
                <h2 class="cart-product-title">${productTitle}</h2>
                <span class="cart-price">${productPrice}</span>
            <div class="cart-quantity">
                <button id="minus">-</button>
                <span class="number">1</span>
                <button id="plus">+</button>
            </div>
        </div>
    <i class="fa-solid fa-trash cart-remove"></i>
  `;

    cartContent.appendChild(cartBox);
    attachCartBoxEvents(cartBox);

    updateCartCount(1);
    updateTotalPrice();
    saveCart(); // Save to localStorage
};

//  Handle events for each cart box (remove / quantity)
    function attachCartBoxEvents(cartBox) {
        cartBox.querySelector(".cart-remove").addEventListener("click", () => {
        cartBox.remove();
        updateCartCount(-1);
        updateTotalPrice();
        saveCart();
  });

    cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
        const numberElement = cartBox.querySelector(".number");
        const minusButton = cartBox.querySelector("#minus");
        let quantity = parseInt(numberElement.textContent);

    if (event.target.id === "minus" && quantity > 1) {
      quantity--;
      if (quantity === 1) {
        minusButton.style.color = "#fff";
      }
    } else if (event.target.id === "plus") {
      quantity++;
      minusButton.style.color = "#fff";
    }

    numberElement.textContent = quantity;
    updateTotalPrice();
    saveCart();
  });
}

//  Reattach events when loading from localStorage
    function restoreCartEvents() {
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    cartBoxes.forEach(cartBox => attachCartBoxEvents(cartBox));
}

//  Save cart data to localStorage
    function saveCart() {
  localStorage.setItem("cartHTML", cartContent.innerHTML);
  localStorage.setItem("cartCount", cartItemCount);
}

    const updateTotalPrice = () => {
  const totalPriceElement = document.querySelector(".total-price");
  const cartBoxes = cartContent.querySelectorAll(".cart-box");
  let total = 0;
  cartBoxes.forEach(cartBox => {
    const priceElement = cartBox.querySelector(".cart-price");
    const quantityElement = cartBox.querySelector(".number");
    const price = parseFloat(priceElement.textContent.replace("₱",""));
    const quantity = parseInt(quantityElement.textContent);
    total += price * quantity;
  });
  totalPriceElement.textContent = `₱${total}`;
};

    let cartItemCount = 0;
const updateCartCount = change => {
  const cartItemCountBadge = document.querySelector(".cart-item-count");
  cartItemCount += change;
  if (cartItemCount > 0 ){
      cartItemCountBadge.style.visibility = "visible";
      cartItemCountBadge.textContent = cartItemCount;
  } else {
       cartItemCountBadge.style.visibility = "hidden";
       cartItemCountBadge.textContent = "";
  }
};

    const buyNowButton = document.querySelector(".btn-buy");
buyNowButton.addEventListener("click", () => {
  const cartBoxes = cartContent.querySelectorAll(".cart-box");
  if (cartBoxes.length === 0) {
      alert("Your Cart is empty. Please add first to your cart before buying");
      return;
  }

    cartBoxes.forEach(cartBox => cartBox.remove());
    cartItemCount = 0;
    updateCartCount(0);
    updateTotalPrice();

  //  Clear localStorage after checkout
  localStorage.removeItem("cartHTML");
  localStorage.removeItem("cartCount");

  alert("Thank You Ma'am/Sir for your purchase!!");
});



