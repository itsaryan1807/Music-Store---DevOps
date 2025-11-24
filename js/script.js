// Simple two-view music store
const PRODUCTS = [
  {id:1, name:'Neon Beats — Album', price:12.99},
  {id:2, name:'Acoustic Dreams — Album', price:9.99},
  {id:3, name:'Classic Guitar', price:249.00},
  {id:4, name:'Studio Headphones', price:129.50}
];

// Cart helpers (localStorage)
function getCart(){ try{ return JSON.parse(localStorage.getItem('ms_cart')||'[]'); }catch(e){return []} }
function saveCart(c){ localStorage.setItem('ms_cart', JSON.stringify(c)); updateCartCount(); }
function addToCart(id){ const cart=getCart(); const it=cart.find(x=>x.id===id); if(it) it.qty++; else cart.push({id,qty:1}); saveCart(cart); }
function removeFromCart(id){ const cart=getCart().filter(x=>x.id!==id); saveCart(cart); }
function clearCart(){ localStorage.removeItem('ms_cart'); updateCartCount(); }

function updateCartCount(){ const count = getCart().reduce((s,i)=>s+i.qty,0); const el=document.getElementById('cart-count'); if(el) el.textContent=count; }

// Render
function renderProducts(){
  const root=document.getElementById('product-list'); if(!root) return; root.innerHTML='';
  PRODUCTS.forEach(p=>{
    const el=document.createElement('div'); el.className='card';
    el.innerHTML = `
      <div class="thumb">${p.name.split(' ')[0][0]||'M'}</div>
      <h4>${p.name}</h4>
      <div class="meta">
        <div>$${p.price.toFixed(2)}</div>
        <div>
          <button class="btn" data-id="${p.id}">Add</button>
        </div>
      </div>
    `;
    el.querySelector('button').addEventListener('click', ()=>{ addToCart(p.id); alert('Added to cart'); });
    root.appendChild(el);
  });
}

function renderCart(){
  const root=document.getElementById('cart-contents'); if(!root) return; const cart=getCart();
  if(cart.length===0){ root.innerHTML='<p>Your cart is empty.</p>'; document.getElementById('cart-total').textContent=''; return; }
  root.innerHTML = '';
  cart.forEach(item=>{
    const p = PRODUCTS.find(x=>x.id===item.id) || {name:'Unknown',price:0};
    const el=document.createElement('div'); el.className='card'; el.style.marginBottom='8px';
    el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
      <div><strong>${p.name}</strong><div style="color:#666">Qty: ${item.qty} × $${p.price.toFixed(2)}</div></div>
      <div style="text-align:right"><div>$${(p.price*item.qty).toFixed(2)}</div><div style="margin-top:8px"><button class='btn remove' data-id='${p.id}'>Remove</button></div></div>
    </div>`;
    el.querySelector('.remove').addEventListener('click', ()=>{ removeFromCart(p.id); renderCart(); });
    root.appendChild(el);
  });
  const total = cart.reduce((s,i)=>{ const p = PRODUCTS.find(x=>x.id===i.id)||{price:0}; return s + p.price * i.qty; },0);
  document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
}

// Simple view switcher
function showView(name){ document.querySelectorAll('.view').forEach(v=>v.style.display='none'); const el=document.getElementById('view-'+name); if(el) el.style.display='block'; }

// Setup
document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts(); updateCartCount();
  document.querySelectorAll('.nav-btn').forEach(b=> b.addEventListener('click', ()=>{
    const view=b.getAttribute('data-view'); showView(view); if(view==='cart') renderCart();
  }));
  document.getElementById('checkout').addEventListener('click', ()=>{ alert('Demo checkout — thank you!'); clearCart(); renderCart(); });
  document.getElementById('clear-cart').addEventListener('click', ()=>{ clearCart(); renderCart(); });
});
