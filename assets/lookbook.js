document.addEventListener('DOMContentLoaded', () => {
  const popup = document.querySelector('.lookbook-popup');
  const openBtn = document.querySelector('.lookbook__preview');
  const closeBtn = popup.querySelector('.lookbook-popup__close');
  const overlay = popup.querySelector('.lookbook-popup__overlay');

  openBtn?.addEventListener('click', () => {
    popup.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });

  const closePopup = () => {
    popup.classList.add('hidden');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closePopup);
  overlay?.addEventListener('click', closePopup);
});

document.querySelectorAll('.lookbook-product__buy').forEach(button => {
  button.addEventListener('click', async e => {
    const productCard = e.target.closest('.lookbook-product');
    const variantSelect = productCard.querySelector('.lookbook-product__variant');
    const variantId = variantSelect.value;

    button.disabled = true;
    button.textContent = 'Adding...';

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
      });

      if (response.ok) {
        button.textContent = 'Added ✓';
        await updateCartCount();
      } else {
        button.textContent = 'Error';
      }
    } catch (err) {
      console.error(err);
      button.textContent = 'Error';
    }

    setTimeout(() => {
      button.disabled = false;
      button.textContent = 'Add to bag';
    }, 1500);
  });
});

async function updateCartCount() {
  try {
    const res = await fetch('/cart.js');
    if (!res.ok) return;
    const cart = await res.json();
    const count = cart.item_count || 0;

    let updated = false;
    const updBubble = () => {
      const bubbleElement = document.querySelector(".cart-count-bubble span");
      if (!!bubbleElement) {
        bubbleElement.textContent = count;
        updated = true;
      }
    }
    updBubble();

    if (!updated) {
      const cartIcon = document.querySelector('.icon-cart-empty');
      const cartAnchor = document.querySelector('#cart-icon-bubble');
      let bubble = cartAnchor.querySelector('.cart-count-bubble');
      bubble = document.createElement('span');
      bubble.classList.add('cart-count-bubble');
      const inner = document.createElement('span');
      inner.textContent = count;
      bubble.appendChild(inner);
      cartAnchor.appendChild(bubble);
      updated = true;
    }
  } catch (err) {
    console.error('Cart update error', err);
  }
}