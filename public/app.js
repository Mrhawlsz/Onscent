const $ = s => document.querySelector(s);
const peso = n => '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });
const cart = {};      // { product_id: quantity }
let products = [];

const card = p => `<article class="card">
  <svg viewBox="0 0 60 90" aria-hidden="true"><rect x="22" y="4" width="16" height="14" rx="2"/><rect x="26" y="18" width="8" height="8"/><rect x="8" y="26" width="44" height="58" rx="8"/></svg>
  <h3>${p.name}</h3><p>${p.notes}</p><p class="price">${peso(p.price)}</p>
  <button data-add="${p.product_id}" ${p.stock < 1 ? 'disabled' : ''}>${p.stock < 1 ? 'Sold out' : 'Add to order'}</button></article>`;

async function load() {
  try { products = await (await fetch('/api/products')).json(); }   // front end -> Express -> MySQL
  catch { $('#men-grid').textContent = 'Could not load products. Is the server running?'; return; }
  for (const line of ['men', 'women'])
    $('#' + line + '-grid').innerHTML = products.filter(p => p.line === line).map(card).join('');
  renderCart();
}

function renderCart() {
  const ids = Object.keys(cart);
  $('#cart').innerHTML = ids.length ? ids.map(id => {
    const p = products.find(x => x.product_id == id);
    return `<li><span>${p.name} × ${cart[id]}</span><b>${peso(p.price * cart[id])}</b>
      <button data-dec="${id}" aria-label="Remove one ${p.name}">−</button>
      <button data-add="${id}" aria-label="Add one ${p.name}">+</button></li>`;
  }).join('') : '<li>Your order is empty. Pick a scent above.</li>';
  $('#total').textContent = peso(ids.reduce((t, id) => t + products.find(x => x.product_id == id).price * cart[id], 0));
}

document.addEventListener('click', e => {
  const add = e.target.dataset.add, dec = e.target.dataset.dec;
  if (add) {
    const p = products.find(x => x.product_id == add);
    if ((cart[add] || 0) < p.stock) cart[add] = (cart[add] || 0) + 1;
  }
  if (dec && --cart[dec] < 1) delete cart[dec];
  if (add || dec) renderCart();
});

$('#order-form').addEventListener('submit', async e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  f.items = Object.entries(cart).map(([product_id, quantity]) => ({ product_id: +product_id, quantity }));
  const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
  const data = await res.json();
  const msg = $('#msg');
  if (!res.ok) { msg.textContent = data.error; msg.className = 'err'; return; }
  msg.textContent = `Order #${data.order_id} placed. We will message you to confirm.`; msg.className = 'ok';
  for (const k in cart) delete cart[k];
  e.target.reset(); load();
});
load();
