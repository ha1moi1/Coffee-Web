// Popup & thêm sản phẩm vào giỏ hàng
const overlay = document.getElementById('popup-overlay');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('close-popup');
const addToCartBtn = document.getElementById('add-to-cart');
const productList = document.getElementById('product-list');
let currentProduct = null;

// Mở popup khi nhấn Mua ngay
if (productList) {
  productList.addEventListener('click', e => {
    if (e.target.classList.contains('buy-btn')) {
      const product = e.target.closest('.product');
      const name = product.dataset.name;
      const price = parseFloat(product.dataset.price); 
      const image = product.dataset.image;

      document.getElementById('popup-name').textContent = name;
      document.getElementById('popup-price').textContent = price.toFixed(2);
      document.getElementById('popup-image').src = image;
      document.getElementById('quantity').value = 1;

      currentProduct = { name, price, image };
      overlay.classList.remove('hidden');
      popup.classList.remove('hidden');
    }
  });
}

// Đóng popup
if (closePopup) {
  closePopup.onclick = () => {
    popup.classList.add('hidden');
    overlay.classList.add('hidden');
  };
}

// Tăng giảm số lượng
const increase = document.getElementById('increase');
const decrease = document.getElementById('decrease');
const qtyInput = document.getElementById('quantity');

if (increase && decrease && qtyInput) {
  increase.onclick = () => qtyInput.value = parseFloat(qtyInput.value) + 1;
  decrease.onclick = () => {
    if (qtyInput.value > 1) qtyInput.value = parseFloat(qtyInput.value) - 1;
  };
}

// Thêm vào giỏ hàng
if (addToCartBtn) {
  addToCartBtn.onclick = () => {
    const quantity = parseFloat(qtyInput.value);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.name === currentProduct.name);

    if (existing) existing.quantity += quantity;
    else cart.push({ ...currentProduct, quantity });

    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = '../html/cart.html';
  };
}

// Hiển thị giỏ hàng
const cartContainer = document.getElementById('cart-items'); 
if (cartContainer) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;
  cartContainer.innerHTML = '';

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
    <div class="cart-product-info">
      <img src="${item.image}" alt="${item.name}">
      <span class="cart-name">${item.name}</span>
    </div>
    <span class="cart-price">$${item.price.toFixed(2)}</span>
    <span class="cart-qty">${item.quantity}</span>
    <span class="cart-total">$${(item.price * item.quantity).toFixed(2)}</span>
    <button class="remove-btn" data-index="${index}">🗑</button>`;

    cartContainer.appendChild(div);
    total += item.price * item.quantity;
  });

  document.getElementById('total').textContent = `Tổng tiền: $${total.toFixed(2)}`; 

  // Xóa từng sản phẩm
  cartContainer.addEventListener('click', e => {
    if (e.target.classList.contains('remove-btn')) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      location.reload();
    }
  });

  // Xóa tất cả
  document.getElementById('clear-cart').onclick = () => {
    localStorage.removeItem('cart');
    location.reload();
  };
}

