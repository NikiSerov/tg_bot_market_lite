let state = 'shop';
let isLoading = false;

const getProducts = async () => {
  isLoading = true;
  const resp = await fetch(`https://lite-bot-backend.vercel.app/categories/1/products/`);
  const products = await resp.json();
  isLoading = false;
  return products;
};

const createCardHTML = ({ id, name, price, description, image }) => {
  return `<div class="card" id="${id}">
    <div class="card-main">
        <div class="card-image-wrapper">
            <img class="card-image" src="${image}" alt="shkaf" />
        </div>
        <div class="card-info">
            <h2 class="card-name">${name}</h2>
            <span class="card-price">от ${price}₽</span>
        </div>
    </div>
    <p class="card-desc">${description}₽</p>
    <div class="card-foot">
        <button class="add-btn" data-id="${id}">Добавить</button>
    </div>
</div>`;
};

const createOrderCardHTML = ({ id, name, price, image }) => {
  return `<div class="orderCard" id="${id}">
    <div class="orderCard-image-wrapper">
        <img class="orderCard-image" src="${image}" alt="shkaf" />
    </div>
    <h2 class="orderCard-name">${name}</h2>
    <span class="orderCard-price">${price}₽</span>
</div>`;
};

// LS - localStorage

const setProductInLS = async (id) => {
  const ls = localStorage.getItem('cart');

  if (ls) {
    const localCart = JSON.parse(ls);
    const newLocalCart = JSON.stringify([...localCart, id]);
    localStorage.setItem('cart', newLocalCart);
  } else {
    const localCart = JSON.stringify([id]);
    localStorage.setItem('cart', localCart);
  }
};

const removeProductFromLS = (id) => {
  const localCart = JSON.parse(localStorage.getItem('cart'));
  const newLocalCart = localCart.filter((productId) => productId !== id);
  localStorage.setItem('cart', JSON.stringify(newLocalCart));
};

const renderCart = async () => {
  const cart = document.querySelector('.cart');
  const productCart = JSON.parse(localStorage.getItem('cart'));
  const products = await getProducts();
  const cartProducts = products.filter((product) => productCart.includes(product.id.toString()));
  const orderCardsHTML = cartProducts.reduce((acc, cv) => {
    return acc + createOrderCardHTML({ ...cv });
  }, '');
  cart.innerHTML = orderCardsHTML;
};

const handleAddClick = (e) => {
  const btn = e.target;
  const id = btn.getAttribute('data-id');
  Telegram.WebApp.HapticFeedback.impactOccurred('medium');

  if (btn.classList.contains('remove')) {
    removeProductFromLS(id);
    btn.classList.add('animateClick');
    btn.classList.remove('remove');
    btn.textContent = 'Добавить';
    setTimeout(() => {
      btn.classList.remove('animateClick');
    }, 310);
  } else {
    setProductInLS(id);
    btn.classList.add('remove', 'animateClick');
    btn.textContent = 'Убрать';
    setTimeout(() => {
      btn.classList.remove('animateClick');
    }, 310);
  }
};

const shopBtnHanlder = () => {
  document.querySelector('.body').classList.add('isOrder');
  renderCart();
  state = 'isOrder';
  getMainButton();
  Telegram.WebApp.BackButton.show();
  Telegram.WebApp.HapticFeedback.impactOccurred('medium');
};

const orderBtnHandler = async () => {
  const cart = JSON.parse(localStorage.getItem('cart'));
  const products = await getProducts();
  const cartProducts = products.filter((product) => cart.includes(product.id));
  const organiztionName = document.getElementById('organization-name').value;
  const contactName = document.getElementById('contact-name').value;
  const contactNumber = document.getElementById('contact-number').value;
  const data = {
    cartProducts,
    organiztionName,
    contactName,
    contactNumber
  };
  Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
  Telegram.WebApp.sendData(JSON.stringify(data));
};

const getMainButton = () => {
  if (state === 'isOrder') {
    Telegram.WebApp.MainButton.offClick(shopBtnHanlder);
    Telegram.WebApp.MainButton.setText('Оформить заказ').show();
    Telegram.WebApp.MainButton.onClick(orderBtnHandler);
  } else {
    Telegram.WebApp.MainButton.offClick(orderBtnHandler);
    Telegram.WebApp.MainButton.setText('Мой заказ').show();
    Telegram.WebApp.MainButton.onClick(shopBtnHanlder);
  }
};

const initTG = () => {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();

  localStorage.setItem('cart', []);

  Telegram.WebApp.BackButton.onClick(() => {
    state = 'main';
    getMainButton();
    document.querySelector('.body').classList.remove('isOrder');
    Telegram.WebApp.BackButton.hide();
    Telegram.WebApp.HapticFeedback.impactOccurred('soft');
  });

  getMainButton();
};

const initWebApp = async () => {
  const products = await getProducts();

  const cardsContainer = document.querySelector('.cards-container');

  const cardsHTML = products.reduce((acc, cv) => {
    return acc + createCardHTML({ ...cv });
  }, '');

  cardsContainer.innerHTML = cardsHTML;

  const addBtns = document.querySelectorAll('.add-btn');

  addBtns.forEach((btn) => {
    btn.addEventListener('click', handleAddClick);
  });

  initTG();
};

initWebApp();
