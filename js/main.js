'use strict';   //відловлювання прогавлених констант


const cartButton = document.getElementById("cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('gloDelivery'); //збереження користувача після оновлення сторінки

const cart = JSON.parse(localStorage.getItem('gloDeliveryCart'))||[];   //parse переводимо дані в масив з великого рядка

const saveCart = function() {
  localStorage.setItem('gloDeliveryCart', JSON.stringify(cart));   //прибирає object object

}

const getData = async function(url) {    //виконання функції тільки після виконання
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error address ${url}, error status ${response.status}!`) //створення своеї помилки
  }
  return await response.json();
};

// console.log(getData('./db/partners.json'));

const toggleModal = function() {
  modal.classList.toggle("is-open");
};


const toogleModalAuth = function() {
  modalAuth.classList.toggle('is-open');
  wrongLogin.style.display = 'none';
  loginInput.style.backgroundColor = ''; //очищення червоного поля пусте поле
};



function authorized() {

  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery'); //відалення інформація за локального сервера після виходу
    localStorage.removeItem('gloDeliveryCart'); //відалення інформація за локального сервера після виходу
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    chekAuth();
  }
  console.log('Authorized');

  userName.textContent = login; //запис в спан імя


  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut)
}

function notAuthorized () {
  console.log('Not authorized');
  function logIn(event) {
    event.preventDefault();  //блокування перезавантаження сторінки
    if(loginInput.value.trim()) { //перевірка на пробіли в логін
      login = loginInput.value;
      localStorage.setItem('gloDelivery', login) //збереження даних на локальному сховищі
      localStorage.setItem('gloDeliveryCart', []) //збереження даних на локальному сховищі
      toogleModalAuth();
      buttonAuth.removeEventListener('click', toogleModalAuth) //відкрити вікно авторизації
      closeAuth.removeEventListener('click', toogleModalAuth) //зачинити вікно авторизації
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset(); // очищення поля логин
      chekAuth();
      // console.log('login');
      // console.log(loginInput.value);
    } else {
      wrongLogin.style.display = 'flex';
      loginInput.style.backgroundColor = 'red'; //фон червоний коли логін пустий
    }
  
  }

  buttonAuth.addEventListener('click', toogleModalAuth) //відкрити вікно авторизації
  closeAuth.addEventListener('click', toogleModalAuth) //зачинити вікно авторизації
  logInForm.addEventListener('submit', logIn);
}

function chekAuth() {
  if(login) {
    authorized();
  } else {
    notAuthorized();
  }  
}


function createCardRestaurant(restaurant) { //створення картки
  
  // console.log(restaurant);

  const { image, 
          kitchen, 
          name, 
          price, 
          stars, 
          products, 
          time_of_delivery: timeOfDelivery // зміна змінної
        } = restaurant;
        
  const card = `<a class="card card-restaurant" data-products="${products}"
                  data-info="${[name, price, stars, kitchen]}"
                  >
                  <img src="${image}" alt="image" class="card-image"/>
                  <div class="card-text">
                    <div class="card-heading">
                      <h3 class="card-title">${name}</h3>
                      <span class="card-tag tag">${timeOfDelivery} min</span>
                    </div>
                    <div class="card-info">
                      <div class="rating">
                        ${stars}
                      </div>
                      <div class="price">From ${price} $</div>
                      <div class="category">${kitchen}</div>
                    </div>
                  </div>
                </a>`;
  
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}


function createCardGood({ description, image, name, price, id }) {//реструктурування даних

  const card = document.createElement('div');
  card.className = 'card';
  // card.id = id;   //Fromримати від картки ІД замовлення
  card.insertAdjacentHTML('beforeend', `
  <img src="${image}" alt="${name}" class="card-image"/>
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title card-title-reg">${name}</h3>
    </div>
    <!-- /.card-heading -->
    <div class="card-info">
      <div class="ingredients">${description}
      </div>
    </div>
    <!-- /.card-info -->
    <div class="card-buttons">
      <button class="button button-primary button-add-cart" id="${id}">
        <span class="button-card-text">Add to cart</span>
        <span class="button-cart-svg"></span>
      </button>
      <strong class="card-price card-price-bold">${price} $</strong>
    </div>
  </div>
  <!-- /.card-text -->
      `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {   //подія при натисканні на картку ресторану
  const target = event.target;    //на що було натиснуто
  if(login) {
    const restaurant = target.closest('.card-restaurant');    //відслідковуванн підіймаеться до елементу який пFromрібно
    
    // console.log('restaurant:', restaurant);
    if(restaurant) {

      const info = restaurant.dataset.info.split(',');
      
      const [name, price, stars, kitchen] = info;
      

      // console.log(restaurant.dataset.products);

      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `From ${price} $`;
      category.textContent = kitchen;



      cardsMenu.textContent = '';   //очищення усих доданих піцц в ресторані
      getData(`./db/${restaurant.dataset.products}`).then(function(data) {
        data.forEach(createCardGood);   //створення карток ресторану
      });
    }
  } else {
    modalAuth.classList.toggle('is-open');
  }
}

function addToCart(event) {
  const target = event.target;

  const buttonAddToCart = target.closest('.button-add-cart'); //пошук натискання на кнопку а не на спан 

  if(buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;    //textContent тільки текст в обєкті
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;
    // console.log(title, cost, id);
    
    const food = cart.find(function(item) {
        return item.id === id;
    });

    if(food) {
      food.count += 1;
    } else {
      cart.push({
        id: id,     //дозволяеться id,
        title: title,
        cost: cost,
        count: 1
      });
    }
    if (cart.length>1) {
      const cartCount = document.getElementById('cart_count');
      cartCount.innerHTML = cart.length;
    } else {
      cartButton.innerHTML = cartButton.innerHTML + '<span id="cart_count" style="background-color: red;border-radius: 50%;width: 25px;height: 25px;margin-left: 10px;">' + cart.length + '</span>'
    }
  }
  saveCart();
}


function renderCart() {   //створення замовлень в кошику
    modalBody.textContent = ''; //очищення всього шо було в кошику
    cart.forEach(function({ id, title, cost, count }) {
        const itemCart = `<div class="food-row">
                            <span class="food-name">${title}</span>
                            <strong class="food-price">${cost}</strong>
                            <div class="food-counter">
                              <button class="counter-button counter-minus" data-id=${id}>-</button>
                              <span class="counter">${count}</span>
                              <button class="counter-button counter-plus" data-id=${id}>+</button>
                            </div>
                          </div>`;
        modalBody.insertAdjacentHTML('afterbegin', itemCart)    //формування верстка
    });

const totalPrice = cart.reduce(function(result, item) {
  return result + (parseFloat(item.cost) * item.count);    //parseFloat якщо символ число то записує(тільки числа бере)
}, 0);
    modalPrice.textContent = totalPrice + ' $';
}

function changeCount(event) {
  const target = event.target;

  if(target.classList.contains('counter-button')) {
    const food = cart.find(function(item) {
      return item.id === target.dataset.id;
    });
    if(target.classList.contains('counter-minus')) {
      food.count--;
      if(food.count === 0) {
        cart.splice(cart.indexOf(food), 1);    //видалення єлементу
        saveCart();
        const cartCount = document.getElementById('cart_count');
        cartCount.innerHTML = cart.length;
      }
    };
    if(target.classList.contains('counter-plus')) food.count++;
    renderCart();   //перезавантаження після зміни 
  }
}


function init() {
  getData('./db/partners.json').then(function(data) {
    data.forEach(createCardRestaurant)
  });

  if (cart.length) {
    cartButton.innerHTML = cartButton.innerHTML + '<span id="cart_count" style="background-color: red;border-radius: 50%;width: 25px;height: 25px;margin-left: 10px;">' + cart.length + '</span>'
  }
  
  cartButton.addEventListener("click", function() {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener('click', function() {
    cart.length = 0;
    localStorage.removeItem('gloDeliveryCart');
    renderCart();
  })

  modalBody.addEventListener('click', changeCount);

  cardsMenu.addEventListener('click', addToCart);
  
  close.addEventListener("click", toggleModal);
  
  cardsRestaurants.addEventListener('click', openGoods);    //подія під час натискання на картку
  
  logo.addEventListener('click', function() {
    containerPromo.classList.remove('hide')
    restaurants.classList.remove('hide')
    menu.classList.add('hide')
  })
  
  chekAuth();
  
  new Swiper('.swiper-container', {
    loop: true,
    autoplay: true,
    // slidesPerView: 3 
  });
}

init();
