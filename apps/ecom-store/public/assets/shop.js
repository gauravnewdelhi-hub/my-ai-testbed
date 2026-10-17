const products = [
  { id: "mug", name: "Daybreak Ceramic Mug", price: 18, icon: "☕", description: "A fictional stoneware mug for an unhurried cup.", detail: "Made-up glazed ceramic, 12 oz. This item is for demonstration only." },
  { id: "tote", name: "Market Day Canvas Tote", price: 24, icon: "👜", description: "A fictional sturdy carry-all for everyday errands.", detail: "Made-up recycled canvas, roomy enough for imaginary groceries." },
  { id: "journal", name: "Field Notes Journal", price: 14, icon: "📓", description: "A fictional paper notebook for ideas and lists.", detail: "Made-up recycled paper with a soft cover. No real goods are sold." }
];
const cart = new Map();
const productGrid = document.querySelector("#products");
const cartItems = document.querySelector("#cart-items");
const money = (amount) => `$${amount.toFixed(2)}`;

for (const product of products) {
  const card = document.createElement("article");
  card.className = "product-card";
  const art = document.createElement("div");
  art.className = "product-art";
  art.setAttribute("aria-hidden", "true");
  art.textContent = product.icon;
  const copy = document.createElement("div");
  copy.className = "product-copy";
  const name = document.createElement("h3");
  name.textContent = product.name;
  const description = document.createElement("p");
  description.textContent = product.description;
  const actions = document.createElement("div");
  actions.className = "product-actions";
  const price = document.createElement("strong");
  price.textContent = money(product.price);
  const controls = document.createElement("div");
  const detail = document.createElement("button");
  detail.type = "button";
  detail.textContent = "Details";
  detail.addEventListener("click", () => {
    const panel = document.querySelector("#product-detail");
    panel.hidden = false;
    panel.replaceChildren();
    const title = document.createElement("h3");
    title.textContent = product.name;
    const text = document.createElement("p");
    text.textContent = product.detail;
    panel.append(title, text);
    panel.focus();
  });
  const add = document.createElement("button");
  add.type = "button";
  add.textContent = "Add to demo cart";
  add.setAttribute("aria-label", `Add ${product.name} to demo cart`);
  add.addEventListener("click", () => {
    cart.set(product.id, (cart.get(product.id) ?? 0) + 1);
    renderCart();
  });
  controls.append(detail, add);
  actions.append(price, controls);
  copy.append(name, description, actions);
  card.append(art, copy);
  productGrid.append(card);
}

function renderCart() {
  const entries = [...cart.entries()];
  document.querySelector("#cart-count").textContent = String(entries.reduce((total, [, count]) => total + count, 0));
  cartItems.replaceChildren();
  if (entries.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Your demo cart is empty.";
    cartItems.append(empty);
  } else {
    const list = document.createElement("ul");
    for (const [id, count] of entries) {
      const product = products.find((candidate) => candidate.id === id);
      const item = document.createElement("li");
      item.textContent = `${product.name} × ${count} — ${money(product.price * count)}`;
      list.append(item);
    }
    cartItems.append(list);
  }
  const total = entries.reduce((sum, [id, count]) => sum + products.find((product) => product.id === id).price * count, 0);
  document.querySelector("#cart-total").textContent = `Demo total: ${money(total)}`;
}

document.querySelector("#clear-cart").addEventListener("click", () => {
  cart.clear();
  renderCart();
});
