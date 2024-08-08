document.addEventListener("DOMContentLoaded", initializeCartButtons);

// Function to initialize event listeners for "Add to Cart" buttons
function initializeCartButtons() {
    // Get all "Add to Cart" button elements
    const btnProductElements = document.querySelectorAll("#btn_add_p button");

    // Add event listeners to each button
    btnProductElements.forEach(btn => {
        btn.addEventListener("click", handleAddOrder);
    });
}

// Function to handle "Add to Cart" action
function handleAddOrder(event) {
    const card = event.currentTarget.closest('.card');
    const addOrder = card.querySelector(".addClass");
    const addMoreOrder = card.querySelector(".addMoreClass");
    const prodactImag = card.querySelector(".prodactImag");
    const counter = card.querySelector("#counter");

    addOrder.classList.add("hidden");
    addMoreOrder.classList.remove("hidden");
    addMoreOrder.classList.add("border-[3]", "border-[#f97316]");

    updateEmptyState();

    let currentCount = 1;
    updateCounterDisplay();

    const increments = card.querySelector(".increment");
    const decrements = card.querySelector(".decrement");
    if (increments) {
        increments.addEventListener("click", () => {
            currentCount += 1;
            updateCounterDisplay();
        });
    }
    if (decrements) {
        decrements.addEventListener("click", () => {
            if (currentCount > 0) {
                currentCount -= 1;
                updateCounterDisplay();
            }
        });
    }

    function updateCounterDisplay() {
        counter.textContent = currentCount;
        handleCounterState();
        updateCartQuantity(card.dataset.cartId, currentCount);
    }

    function handleCounterState() {
        if (currentCount === 0) {
            addOrder.classList.remove("hidden");
            addMoreOrder.classList.add("hidden");
            addOrder.classList.remove("border-[3]", "border-[#f97316]");
            if (prodactImag) {
                prodactImag.classList.remove("border-[3px]", "border-[#f97316]");
            }
            // Remove the corresponding card from the cart
            removeCartItem(card.dataset.cartId);
        } else if (prodactImag) {
            prodactImag.classList.add("border-[3px]", "border-[#f97316]");
        }
    }

    function updateEmptyState() {
        const emptyState = document.querySelector(".emtpy");
        const productList = document.querySelector(".orders");
        if (emptyState) {
            emptyState.classList.add("hidden");
        }
        if (productList) {
            productList.classList.remove("hidden");
        }
    }

    handleAddCartItem(card, addOrder, addMoreOrder, prodactImag);
    updateTotalPrice()
}


function updateItemCount() {
    const cartItems = document.querySelectorAll('.cardInfoBpx');
    const itemCountElement = document.getElementById('itemCount'); // Assumes you have an element with this ID to display the count
    const itemCount = cartItems.length;

    if (itemCountElement) {
        itemCountElement.textContent = itemCount;
    }

    if (itemCount === 0) {
        document.querySelector(".emtpy").classList.remove("hidden");
        document.querySelector(".orders").classList.add("hidden")
        
        document.getElementById('totalPrice').textContent = '';
        document.getElementById('cartItems').textContent = '0'; // Update the item count display
    } else {
        document.querySelector(".emtpy").classList.add("hidden");
        document.querySelector(".orders").classList.remove("hidden")
    }
}

// Function to remove an item from the cart

// Function to add an item to the cart
function handleAddCartItem(card, addOrder, addMoreOrder, prodactImag) {
    let title = card.querySelector(".title").textContent.trim();
    let priceText = card.querySelector(".price").textContent.trim();
    let countersText = card.querySelector("#counter").textContent.trim();
    
    let price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    let counters = parseInt(countersText, 10);

    if (isNaN(price) || isNaN(counters)) {
        console.error("Price or counters are not valid numbers");
        return;
    }

    let productImageSrc = card.querySelector(".prodactImag").src;
    let cartId = Date.now();
    card.dataset.cartId = cartId;

    CartBoxComponent(cartId, title, counters, productImageSrc, price, addOrder, addMoreOrder, prodactImag);
}

// Function to create and add a cart box component


// Function to update the quantity in the cart
function updateCartQuantity(cartId, quantity) {
    const cartItem = document.querySelector(`.cardInfoBpx[data-cart-id="${cartId}"]`);
    if (cartItem) {
        const quantityElement = cartItem.querySelector('.cart-quantity');
        if (quantityElement) {
            quantityElement.textContent = quantity;
        }
        const priceElement = cartItem.querySelector('.text-gray-400 span');
        if (priceElement) {
            const price = parseFloat(priceElement.textContent);
            const totalElement = cartItem.querySelector('.text-gray-600 span');
            if (totalElement) {
                const total = quantity * price;
                totalElement.textContent = total.toFixed(2);
            }
        }
    }
    updateTotalPrice();
}

function updateTotalPrice() {
    const cartItems = document.querySelectorAll('.cardInfoBpx');
    let totalPrice = 0;

    cartItems.forEach(cartItem => {
        const quantityElement = cartItem.querySelector('.cart-quantity');
        const priceElement = cartItem.querySelector('.text-gray-400 span');

        if (quantityElement && priceElement) {
            const quantity = parseInt(quantityElement.textContent, 10);
            const price = parseFloat(priceElement.textContent);
            if (!isNaN(quantity) && !isNaN(price)) {
                totalPrice += quantity * price;
            }
        }
    });

    const totalElement = document.getElementById('total');
    if (totalElement) {
        const totalSpan = totalElement.querySelector('span');
        if (totalSpan) {
            totalSpan.textContent = totalPrice.toFixed(2);
        }
    }
}


// Function to handle the removal of an item from the cart
function handleRemoveOrder(event, addOrder, addMoreOrder, prodactImag) {
    const itemDiv = event.currentTarget.closest('.cardInfoBpx');
    
    if (itemDiv) {
        const nextSibling = itemDiv.nextElementSibling;
        if (nextSibling && nextSibling.tagName === 'HR') {
            nextSibling.remove();
        }
        itemDiv.remove();

        addOrder.classList.remove("hidden");
        addMoreOrder.classList.add("hidden");
        addOrder.classList.remove("border-[3]", "border-[#f97316]");
        if (prodactImag) {
            prodactImag.classList.remove("border-[3px]", "border-[#f97316]");
        }
    }
    updateTotalPrice()
    updateItemCount(); // Update item count


}
function removeCartItem(cartId) {
    const itemDiv = document.querySelector(`.cardInfoBpx[data-cart-id="${cartId}"]`);
    if (itemDiv) {
        const nextSibling = itemDiv.nextElementSibling;
        if (nextSibling && nextSibling.tagName === 'HR') {
            nextSibling.remove();
        }
        itemDiv.remove();
    }
    updateTotalPrice()
    updateItemCount(); // Update item count
    toggleDirection()


}

const checkoutButton = document.getElementById("checkout-button");

if (checkoutButton) {
    checkoutButton.addEventListener("click", function () {
        const totalElement = document.getElementById('total');
        let totalSpan = "0.00"; // Default value in case something goes wrong

        if (totalElement) {
            const spanElement = totalElement.querySelector('span');
            if (spanElement) {
                totalSpan = spanElement.textContent;
            }
        }

        Swal.fire({
            title: "Order Confirmation",
            html: `Thank you for your order! Your total is <b><span style="color: #f97316;">$${totalSpan}</span></b>.`,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: 'custom-confirm-button' // Apply custom class
            }
        });
    });
    updateTotalPrice();
}

function CartBoxComponent(cartId, title, counters, productImage, price, addOrder, addMoreOrder, prodactImag) {
    const cardInfoBox = document.createElement('div');
    cardInfoBox.className = 'cardInfoBpx flex items-center justify-between mb-4';
    cardInfoBox.dataset.cartId = cartId;
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'flex items-center';
    
    const image = document.createElement('img');
    image.src = productImage;
    image.alt = 'Product Image';
    image.className = 'w-16 h-16 mr-2 object-cover rounded-lg';
    
    const textContainer = document.createElement('div');
    
    const titleElement = document.createElement('p');
    titleElement.className = 'text-xl font-bold text-gray-700 mb-[2px]';
    titleElement.textContent = title;
    
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'flex items-center';
    
    const quantity = document.createElement('p');
    quantity.className = 'pr-4 text-orange-600 font-bold';
    quantity.innerHTML = `<span class="cart-quantity">${counters}</span>x`;
    
    const priceAt = document.createElement('p');
    priceAt.className = 'text-sm font-bold text-gray-400 pr-2';
    priceAt.innerHTML = `@ $<span>${price}</span>`;
    
    const total = counters * price;
    const totalPrice = document.createElement('p');
    totalPrice.className = 'text-sm font-bold text-gray-600';
    totalPrice.innerHTML = `$<span>${total.toFixed(2)}</span>`;
    
    detailsContainer.appendChild(quantity);
    detailsContainer.appendChild(priceAt);
    detailsContainer.appendChild(totalPrice);
    
    textContainer.appendChild(titleElement);
    textContainer.appendChild(detailsContainer);
    
    imageContainer.appendChild(image);
    imageContainer.appendChild(textContainer);
    
    const removeBtnContainer = document.createElement('div');
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'border-2 rounded-full border-[#caafa7] p-[4px] hover:border-[#a59792]';
    
    const removeImg = document.createElement('img');
    removeImg.src = '/assets/images/icon-remove-item.svg';
    removeImg.alt = 'Remove Item';
    
    removeBtn.appendChild(removeImg);
    removeBtnContainer.appendChild(removeBtn);
    
    cardInfoBox.appendChild(imageContainer);
    cardInfoBox.appendChild(removeBtnContainer);
    
    const mainBox = document.getElementById('mianBoxForOrders');
    mainBox.appendChild(cardInfoBox);

    const hr = document.createElement('hr');
    hr.className = 'my-4';
    mainBox.appendChild(hr);
    
    removeBtn.addEventListener("click", (event) => handleRemoveOrder(event, addOrder, addMoreOrder, prodactImag));
    updateItemCount()
    toggleDirection()

}

const translations = {
    en: {
        desserts: 'Desserts',
        addToCart: 'Add to Cart',
        baklava: 'Baklava',
        brownie: 'Brownie',
        brownies: 'Chocolate Brownie',
        cake: 'Cake',
        cake2: 'Vanilla Cake',
        cremeBrulee: 'Creme Brulee',
        cremeBrulee2: 'Creme Brulee',
        macaron: ' Macarons',
        macaron2: 'Assorted Macarons',
        pannaCotta: 'Panna Cotta',
        tiramisu: 'Tiramisu',
        waffle: 'Waffle',
        waffle2: 'Waffle with Berries',
        yourCart: `Your Cart`,
        yourAddedItems: 'Your added items will appear here.',
        orderTotal: 'Order Total',
        carbonNeutralOrder: 'This is a <span class="font-semibold">carbon neutral order.</span>',
        payNow: 'Pay Now',
        company: 'company',
        aboutUs: 'about us',
        ourServices: 'our services',
        privacyPolicy: 'privacy policy',
        affiliateProgram: 'affiliate program',
        getHelp: 'get help',
        faq: 'FAQ',
        shipping: 'shipping',
        returns: 'returns',
        orderStatus: 'order status',
        paymentOptions: 'payment options',
        followUs: 'follow us',
        facebook: 'Facebook',
        twitter: 'Twitter',
        instagram: 'Instagram',
        Languages: 'Languages',
    },
    ar: {
        desserts: 'الحلويات',
        addToCart: 'أضف إلى السلة',
        baklava: 'بقلاوة',
        brownie: 'براوني',
        brownies: 'براوني الشوكولاتة',
        cake: 'كيك ',
        cake2: 'كيك الفانيليا',
        cremeBrulee: 'كريمة بروليه',
        cremeBrulee2: 'كريمة بروليه',
        macaron: 'ماكارون ',
        macaron2: 'ماكارون مشكل',
        pannaCotta: 'باناكوتا',
        tiramisu: 'تيراميسو',
        waffle: 'وافل',
        waffle2: 'وافل بالتوت',
        yourCart: 'سلتك (<span id="itemCount">0</span>)',
        yourAddedItems: 'ستظهر العناصر المضافة هنا.',
        orderTotal: 'إجمالي الطلب',
        carbonNeutralOrder: 'هذا <span class="font-semibold">طلب محايد للكربون.</span>',
        payNow: 'ادفع الآن',
        company: 'الشركة',
        aboutUs: 'من نحن',
        ourServices: 'خدماتنا',
        privacyPolicy: 'سياسة الخصوصية',
        affiliateProgram: 'برنامج الشركاء',
        getHelp: 'احصل على المساعدة',
        faq: 'الأسئلة الشائعة',
        shipping: 'الشحن',
        returns: 'المرتجعات',
        orderStatus: 'حالة الطلب',
        paymentOptions: 'خيارات الدفع',
        followUs: 'تابعنا',
        facebook: 'فيسبوك',
        twitter: 'تويتر',
        instagram: 'إنستغرام',
        Languages: 'لغه',
    },
    ru: {
        desserts: 'Десерты',
        addToCart: 'Добавить ',
        baklava: 'Баклава',
        brownie:'брауни',
        brownies: 'Шоколадный брауни',
        cake: 'Ванильный ',
        cake2: 'Ванильный торт',
        cremeBrulee: 'Крем-брюле',
        cremeBrulee: 'Крем-брюле',
        macaron: ' макарунов',
        macaron2: 'Ассорти макарунов',
        pannaCotta: 'Панакота',
        tiramisu: 'Тирамису',
        waffle: 'Вафли ',
        waffle2: 'Вафли с ягодами',
        yourCart: 'Ваша корзина (<span id="itemCount">0</span>)',
        yourAddedItems: 'Ваши добавленные товары появятся здесь.',
        orderTotal: 'Итог заказа',
        carbonNeutralOrder: 'Это <span class="font-semibold">углеродно нейтральный заказ.</span>',
        payNow: 'Оплатить сейчас',
        company: 'Компания',
        aboutUs: 'О нас',
        ourServices: 'Наши услуги',
        privacyPolicy: 'Политика конфиденциальности',
        affiliateProgram: 'Партнёрская программа',
        getHelp: 'Помощь',
        faq: 'Часто задаваемые вопросы',
        shipping: 'Доставка',
        returns: 'Возвраты',
        orderStatus: 'Статус заказа',
        paymentOptions: 'Способы оплаты',
        followUs: 'Следите за нами',
        facebook: 'Facebook',
        twitter: 'Twitter',
        instagram: 'Instagram',
        Languages: 'язык',
    }
};
// Function to toggle direction and language
function toggleDirection(lang) {
    localStorage.setItem('languageDirection', lang);

      
        // Translate text
        document.getElementById('yourCard').innerText = translations[lang].addToCart;
        document.getElementById('title').innerText = translations[lang].desserts;
        const elements1 = document.querySelectorAll('#addcard');
        elements1.forEach(element => {
            element.innerText = translations[lang].addToCart;
        });
        const elements2 = document.querySelectorAll('#Baklava');
        elements2.forEach(element => {
            element.innerText = translations[lang].baklava;
        });
        document.getElementById('brownie').innerText = translations[lang].brownie;
        document.getElementById('brownies').innerText = translations[lang].brownies;
        document.getElementById('cake').innerText = translations[lang].cake;
        document.getElementById('cake2').innerText = translations[lang].cake2;
        document.getElementById('cremebrulee').innerText = translations[lang].cremeBrulee;
        document.getElementById('cremebrulee2').innerText = translations[lang].cremeBrulee2;
        document.getElementById('macaron').innerText = translations[lang].macaron;
        document.getElementById('macaron2').innerText = translations[lang].macaron2;
        document.getElementById('pannaCotta').innerText = translations[lang].pannaCotta;
        document.getElementById('pannaCotta2').innerText = translations[lang].pannaCotta;
        document.getElementById("waffle").innerHTML = translations[lang].waffle;
        document.getElementById("waffle2").innerHTML = translations[lang].waffle2;
        document.getElementById("Tiramisu").innerHTML = translations[lang].tiramisu;
        document.getElementById("Tiramisu2").innerHTML = translations[lang].tiramisu;
        document.getElementById("textEmtpy").innerHTML = translations[lang].yourAddedItems;
        document.getElementById("ordertext").innerHTML = translations[lang].orderTotal;
        document.getElementById("btncarbon").innerHTML = translations[lang].carbonNeutralOrder;
        document.getElementById("checkout-button").innerHTML = translations[lang].payNow;
        document.getElementById("about").innerHTML = translations[lang].aboutUs;
        document.getElementById("help").innerHTML = translations[lang].getHelp;
        document.getElementById("Language").innerHTML = translations[lang].Languages;
        document.getElementById("follows").innerHTML = translations[lang].followUs;
        


        
if (lang === 'ar') {
    document.body.classList.add('rtl');
    document.body.classList.add('md:text-right');
    document.body.classList.remove('md:text-left');
} else {
    document.body.classList.remove('rtl');
    document.body.classList.remove('md:text-right');
    document.body.classList.add('md:text-left');
}
}

function applySavedDirection() {
    // Retrieve the saved language direction from localStorage
    const savedLang = localStorage.getItem('languageDirection') || 'en'; // Default to 'en' if not set
    toggleDirection(savedLang);
}

document.addEventListener("DOMContentLoaded", applySavedDirection);
