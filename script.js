// Tienda Sofía - carrito por peso (kg/lb)
// Guardar: script.js

(() => {
  const LB_TO_KG = 0.45359237;
  const cart = {}; // key: product id -> {name, pricePerKg, weightKg}

  // util: format currency
  function money(v) {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(v);
  }

  // abrir/cerrar panel carrito
  const cartPanel = document.getElementById('cart-panel');
  document.getElementById('view-cart').addEventListener('click', ()=> {
    cartPanel.classList.remove('hidden');
    renderCart();
  });
  document.getElementById('close-cart').addEventListener('click', ()=> {
    cartPanel.classList.add('hidden');
  });

  // agregar event listeners a botones Agregar
  document.querySelectorAll('.product-card').forEach(card => {
    const btn = card.querySelector('.add-to-cart');
    btn.addEventListener('click', ()=> {
      const id = card.dataset.id;
      const name = card.dataset.name;
      const pricePerKg = parseFloat(card.dataset.pricePerKg);
      const weightInput = card.querySelector('.weight-input');
      const unitSelect = card.querySelector('.unit-select');

      let weight = parseFloat(weightInput.value) || 0;
      const unit = unitSelect.value; // "kg" o "lb"
      if (weight <= 0){
        alert('Ingresa una cantidad válida.');
        return;
      }
      // convertir a kg si viene en lb
      const weightKg = unit === 'lb' ? weight * LB_TO_KG : weight;

      // sumar al carrito si ya existe
      if (!cart[id]) cart[id] = { name, pricePerKg, weightKg };
      else cart[id].weightKg += weightKg;

      renderCart();
      cartPanel.classList.remove('hidden');
    });
  });

  // render tabla
  function renderCart(){
    const tbody = document.querySelector('#cart-table tbody');
    tbody.innerHTML = '';
    let total = 0;
    for (const id in cart){
      const item = cart[id];
      const subtotal = item.pricePerKg * item.weightKg;
      total += subtotal;

      const tr = document.createElement('tr');

      const tdName = document.createElement('td');
      tdName.textContent = item.name;

      const tdPrice = document.createElement('td');
      tdPrice.textContent = money(item.pricePerKg) + ' /kg';

      const tdQty = document.createElement('td');
      // mostrar cantidad en kg con 3 decimales y en lb entre paréntesis
      const qtyText = `${item.weightKg.toFixed(0)} kg (${(item.weightKg / LB_TO_KG).toFixed(0)} lb)`;
      tdQty.textContent = qtyText;

      const tdActions = document.createElement('td');
      // botón eliminar
      const rem = document.createElement('button');
      rem.textContent = 'Eliminar';
      rem.className = 'btn-light';
      rem.style.padding = '6px';
      rem.addEventListener('click', ()=> {
        delete cart[id];
        renderCart();
      });
      tdActions.appendChild(rem);

      tr.appendChild(tdName);
      tr.appendChild(tdPrice);
      tr.appendChild(tdQty);
      tr.appendChild(tdActions);

      tbody.appendChild(tr);
    }

    document.getElementById('cart-total').textContent = money(total);
  }

  // Vaciar carrito
  document.getElementById('clear-cart').addEventListener('click', ()=>{
    if (Object.keys(cart).length === 0) return;
    if (!confirm('¿Vaciar el carrito?')) return;
    for (const k in cart) delete cart[k];
    renderCart();
  });

  // Checkout (simulado)
  document.getElementById('checkout').addEventListener('click', ()=>{
    if (Object.keys(cart).length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    // generar resumen simple
    let mensaje = 'Resumen de pedido:\n\n';
    let total = 0;
    for (const id in cart){
      const it = cart[id];
      const sub = it.pricePerKg * it.weightKg;
      mensaje += `${it.name} — ${it.weightKg.toFixed(3)} kg — ${money(sub)}\n`;
      total += sub;
    }
    mensaje += `\nTotal: ${money(total)}\n\nGracias por comprar`;
    alert(mensaje);

    // limpiar carrito
    for (const k in cart) delete cart[k];
    renderCart();
    cartPanel.classList.add('hidden');
  });

  // inicial render
  renderCart();

})();
