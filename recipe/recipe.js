const basket = {
    items: [],
    quantity: 0,
    totalPrice: 0,
};

let recipe;
let allIngredients;

function renderIngredients(list, elementId, checked = false, showCheckMark = true, showPrice = true, addClass = "") {
    const ul = document.getElementById(elementId);
    ul.innerHTML = list.map(i => `
    <li class="ingredient-item ${addClass} ${checked ? 'crossed-out' : ''}" data-id="${i.id}">
      ${showCheckMark ? `<input type="checkbox" class="ingredient-check" ${checked ? 'checked' : ''}/>` : ``}
      <div class="ingredient-name">${i.name}</div>
      <div class="ingredient-info">
        <div class="ingredient-amount">${i.amount}</div>
        <div class="ingredient-unit">${i.unit}</div>
        ${showPrice ? `<div class="ingredient-price">${i.price ? `${i.price.toFixed(2)} DKK` : ''}</div>` : ''}
      </div>
    </li>
  `).join("");


    if (showCheckMark) {
        ul.addEventListener("click", (event) => {
            const li = event.target.closest("li.ingredient-item");
            if (!li || !ul.contains(li)) return;

            const checkbox = li.querySelector(".ingredient-check");
            if (checkbox) {
                checkbox.checked = !checkbox.checked;

                if (checkbox.checked) {
                    li.classList.add("crossed-out");
                } else {
                    li.classList.remove("crossed-out");
                }
                checkbox.dispatchEvent(new Event("change", {bubbles: true}));
            }
        });


        ul.addEventListener("change", () => {
            const notCheckedPrices = Array.from(document.querySelectorAll(".ingredients .ingredient-item"))
                .filter(item => !item.querySelector(".ingredient-check").checked)
                .map(item => {
                    const id = item.dataset.id;
                    return allIngredients.find(ingredient => ingredient.id === id);
                })
                .filter(Boolean);

            const totalPrice = notCheckedPrices.reduce((sum, ingredient) => sum + ingredient.price, 0);

            document.getElementById("total-price").textContent = totalPrice.toFixed(2);
        });
    }
}

function calcTotal(ingredients) {
    return ingredients.reduce((sum, i) => sum + (i.price || 0), 0).toFixed(2);
}

function renderRecipeBox(recipe) {
    const box = document.getElementById("recipe-box");
    box.innerHTML = `
    <h2>${recipe.title}</h2>
    <p><strong>Antal:</strong> ${recipe.servings}</p>
    <p><strong>Forberedelse:</strong> ${recipe.prep_time_minutes} min</p>
    <p><strong>Arbejdstid:</strong> ${recipe.cook_time_minutes} min</p>
    <h3>Alle ingredienser</h3>
    <ul id="all-ingredients"></ul>
    <h3>Fremgangsmåde</h3>
    <ol>${recipe.steps.map(s => `<li>${s}</li>`).join("")}</ol>
  `;
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`http://localhost:8080/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
        credentials: 'include' // Make sure cookies are sent
    });

    if (res.ok) {
        closeLoginModal();
    } else {
        alert('Login failed');
    }
}

function addBasketToNemligBasket() {
    Promise.all(
        basket.items.map(i => addToNemligBasket(i.id, i.quantity))
    ).then(() => {
        window.open('https://nemlig.com/', '_blank');
    }).catch(err => {
        if (err.message === 'User not logged in') {
            openLoginModal();
        }
        console.error('Error adding items to Nemlig basket', err);
    });
}

async function addToNemligBasket(product_id, quantity) {
    const res = await fetch('http://localhost:8080/addToBasket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',  // Ensure cookies are included in the request
        body: JSON.stringify({productId: product_id, quantity: quantity})
    });

    if (res.ok) {
        const result = await res.json();
        if (result.Email == null) {
            throw new Error('User not logged in');
        }
    } else {
        console.error('Failed to add to basket');
        // Handle error (e.g., show an error message)
    }
}

function getCheckedItems(list) {
    const checkedNames = Array.from(document.querySelectorAll(".ingredient-check"))
        .filter(cb => cb.checked)
        .map(cb => cb.parentElement.querySelector(".ingredient-name").textContent);
    return list.filter(i => !checkedNames.includes(i.name));
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

window.addEventListener('click', function (e) {
    const modal = document.getElementById('loginModal');
    const content = document.querySelector('.modal-content');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// add to basket
document.querySelector('#basketBtnAndTotalAmount .addToBasketBtn')?.addEventListener('click', function () {
    getCheckedItems(allIngredients).forEach(i => {
        const existingItem = basket.items.find(item => item.id === i.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            basket.items.push({id: i.id, ...i, quantity: 1});
        }
        basket.quantity += 1;
        basket.totalPrice += i.price;
    });
    document.getElementById('basketCount').textContent = basket.quantity;
});

function openBasket() {
    const basketItems = document.getElementById('basketItems');
    const basketDropdown = document.getElementById('basketDropdown');
    const basketHeaderPrice = document.querySelector(".basketHeaderPrice");

    basketHeaderPrice.textContent = basket.totalPrice.toFixed(2) + " DKK";

    basketItems.innerHTML = '';

    basket.items.forEach(item => {
        const itemDiv = document.createElement('li');
        itemDiv.innerHTML = `
      <div><strong>${item.quantity}x ${item.name}</strong></div>
      <div>Amount: ${item.amount}${item.unit}</div>
      <div>Price: $${item.price.toFixed(2)}</div>
    `;
        itemDiv.style.padding = '0.5rem 0';
        itemDiv.style.borderBottom = '1px solid #ddd';
        basketItems.appendChild(itemDiv);
    });

    document.getElementById('basketCount').textContent = basket.quantity;
    basketDropdown.style.display = 'block';
}

document.addEventListener('click', function (e) {
    const dropdown = document.getElementById('basketDropdown');
    const basketBtn = document.getElementById('basketBtn');
    if (!dropdown.contains(e.target) && !basketBtn.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

document.getElementById('CheckoutBtn').addEventListener('click', function () {
    addBasketToNemligBasket();
});


document.addEventListener("DOMContentLoaded", () => {
    // Try both keys, but prioritize 'generatedRecipe'
    recipe = JSON.parse(localStorage.getItem('generatedRecipe') || localStorage.getItem('randomRecipe'));

    if (!recipe) return;

    // checks if recipe.type is equal to generatedRecipe, if true chooses generatedRecipe, if false chooses randomRecipe.
    const keyUsed = recipe.type === 'generatedRecipe' ? 'generatedRecipe' : 'randomRecipe';

    // Reload from the correct key (in case both exist and you want the latest version from that specific key)
    recipe = JSON.parse(localStorage.getItem(keyUsed));

    // Render logic (same for both)
    if (recipe) {
        allIngredients = [...recipe.ingredients_to_buy, ...recipe.ingredients_at_home];
        renderIngredients(recipe.ingredients_to_buy, "to-buy");
        renderIngredients(recipe.ingredients_at_home, "at-home", true);
        document.getElementById("total-price").textContent = calcTotal(recipe.ingredients_to_buy);
        renderRecipeBox(recipe);
        renderIngredients(allIngredients, "all-ingredients", false, false, false, "recipeBoxIngredient");
    }
});
