let state = 'shop';

const products = [
    {
        name: '1800х450х450 IP31 без бок панелей RAL7035',
        price: '13.900',
        id: 'product1'
    },
    {
        name: '1800х600х450 IP31 без бок панелей RAL7035',
        price: '14.600',
        id: 'product2'
    },
    {
        name: '1800х800х450 IP31 без бок панелей RAL7035',
        price: '14.800',
        id: 'product3'
    },
    {
        name: '1800х1000х450 IP31 без бок панелей RAL7035',
        price: '15.800',
        id: 'product4'
    },
    {
        name: '2000х450х450 IP31 без бок панелей RAL7035',
        price: '15.100',
        id: 'product5'
    },
    {
        name: '2000х600х600 IP31 без бок панелей RAL7035',
        price: '16.700',
        id: 'product6'
    },
    {
        name: '2000х600х450 IP31 без бок панелей RAL7035',
        price: '15.900',
        id: 'product7'
    },
    {
        name: '2000х800х600 IP31 без бок панелей RAL7035',
        price: '18.560',
        id: 'product8'
    },
    {
        name: '2000х800х450 IP31 без бок панелей RAL7035',
        price: '17.840',
        id: 'product9'
    },
    {
        name: '2000х1000х450. IP31 без бок панелей RAL7035',
        price: '18.900',
        id: 'product10'
    },
    {
        name: '1800х450х450. IP54 без бок панелей RAL7035',
        price: '15.900',
        id: 'product11'
    },
    {
        name: '1800х600х450. IP54 без бок панелей RAL7035',
        price: '16.700',
        id: 'product12'
    },
    {
        name: '1800х800х450. IP54 без бок панелей RAL7035',
        price: '17.400',
        id: 'product13'
    },
    {
        name: '1800х1000х450. IP54 без бок панелей RAL7035',
        price: '19.500',
        id: 'product14'
    },
    {
        name: '2000х450х450. IP54 без бок панелей RAL7035',
        price: '16.900',
        id: 'product15'
    },
    {
        name: '2000х600х450. IP54 без бок панелей RAL7035',
        price: '17.900',
        id: 'product16'
    },
    {
        name: '2000х800х450. IP54 без бок панелей RAL7035',
        price: '18.400',
        id: 'product17'
    },
    {
        name: '2000х1000х450. IP54 без бок панелей RAL7035',
        price: '19.600',
        id: 'product18'
    },
    {
        name: '2000х1000х600. IP54 без бок панелей RAL7035',
        price: '20.900',
        id: 'product19'
    }
]


const createCardHTML = ({id, name, price}) => {
    return `<div class="card" id="${id}">
    <div class="card-image-wrapper">
        <img class="card-image" src="https://i.ibb.co/87MgLXd/shkaf.webp" alt="shkaf" />
    </div>
    <div class="card-main">
        <h2 class="card-name">${name}</h2>
        <span class="card-price">${price}₽</span>
    </div>
    <div class="card-foot">
        <button class="add-btn" data-id="${id}">Добавить</button>
    </div>
</div>`;
}

const createOrderCardHTML = ({id, name, price}) => {
    return `<div class="orderCard" id="${id}">
    <div class="orderCard-image-wrapper">
        <img class="orderCard-image" src="https://i.ibb.co/87MgLXd/shkaf.webp" alt="shkaf" />
    </div>
    <h2 class="orderCard-name">${name}</h2>
    <span class="orderCard-price">${price}₽</span>
</div>`;
}

// LS - localStorage

const setProductInLS = (id) => {
    const product = products.find(product => product.id === id);
    const ls = localStorage.getItem('cart');
    
    if (ls) {
        const localCart = JSON.parse(ls);
        const newLocalCart = JSON.stringify([...localCart, product]);
        localStorage.setItem('cart', newLocalCart)
    } else {
        const localCart = JSON.stringify([product]);
        localStorage.setItem('cart', localCart)
    }
}

const removeProductFromLS = (id) => {
    const localCart = JSON.parse(localStorage.getItem('cart'));
    const newLocalCart = localCart.filter(product => product.id !== id);
    localStorage.setItem('cart', JSON.stringify(newLocalCart));
}

const renderCart = () => {
    const cart = document.querySelector('.cart');
    const productCart = JSON.parse(localStorage.getItem('cart'));
    const orderCardsHTML = productCart.reduce((acc, cv) => {
        return acc + createOrderCardHTML({...cv});
    }, '');
    cart.innerHTML = orderCardsHTML;
}

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
            btn.classList.remove('animateClick')
        }, 310);
   } else {
        setProductInLS(id)
        btn.classList.add('remove', 'animateClick');
        btn.textContent = 'Убрать';
        setTimeout(() => {
            btn.classList.remove('animateClick')
        }, 310);
   }
}

const shopBtnHanlder = () => {
    document.querySelector('.body').classList.add('isOrder');
    renderCart();
    state = 'isOrder';
    getMainButton();
    Telegram.WebApp.BackButton.show()
    Telegram.WebApp.HapticFeedback.impactOccurred('medium');
}

const orderBtnHandler = () => {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const organiztionName = document.getElementById('organization-name').value;
    const contactName = document.getElementById('contact-name').value;
    const contactNumber = document.getElementById('contact-number').value;
    const data = {
        cart,
        organiztionName,
        contactName,
        contactNumber
    }
    Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    Telegram.WebApp.sendData(JSON.stringify(data));
}

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
}

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
    })

    getMainButton();
}

const renderCards = async () => {
    const cardsContainer = document.querySelector('.cards-container');
    const cardsHTML = await products.reduce((acc, cv) => {
        return acc + createCardHTML({...cv});
    }, '');

    cardsContainer.innerHTML = cardsHTML;

    const addBtns = document.querySelectorAll(".add-btn");
    
    addBtns.forEach((btn) => {
        btn.addEventListener('click', handleAddClick);
    });

    initTG();
}

renderCards();

