const recipe = {
    title: "Spaghetti Bolognese",
    servings: 4,
    ingredients_to_buy: [
        {name: "Spaghetti", amount: 400, unit: "g", price: 1.5},
        {name: "Oksekød", amount: 500, unit: "g", price: 4.0},
        {name: "Løg", amount: 2, unit: "pcs", price: 0.6},
        {name: "Tomat pasta", amount: 140, unit: "g", price: 1.2},
        {name: "hvidløg", amount: 400, unit: "g", price: 1.5},
        {name: "Parmesan ost", amount: 100, unit: "g", price: 2.8}
    ],
    ingredients_at_home: [
        {name: "Salt", amount: 1, unit: "tsp", price: 0},
        {name: "Peber", amount: 1, unit: "tsp", price: 0}
    ],
    steps: [
        "Sæt vand over",
        "Kog pasta",
        "Steg kødet",
        "Mix de resterende varer i",
        "Kog i 30 minutter"
    ],
    prep_time_minutes: 10,
    cook_time_minutes: 20,
    tags: ["pasta", "dinner"]
};

function renderIngredients(list, elementId, checked = false, showCheckMark = true, showPrice = true, addClass = "") {
    const ul = document.getElementById(elementId);
    ul.innerHTML = list.map(i => `
    <li class="ingredient-item ${addClass}">
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
            const checked = Array.from(ul.querySelectorAll(".ingredient-check"))
                .filter(cb => cb.checked)
                .map(cb => cb.parentElement.querySelector(".ingredient-name").textContent);

            const totalPriceList = list.filter(i => !checked.includes(i.name));
            document.getElementById("total-price").textContent = calcTotal(totalPriceList);
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


const allIngredients = [...recipe.ingredients_to_buy, ...recipe.ingredients_at_home];
renderIngredients(recipe.ingredients_to_buy, "to-buy");
renderIngredients(recipe.ingredients_at_home, "at-home", true);
document.getElementById("total-price").textContent = calcTotal(recipe.ingredients_to_buy);
renderRecipeBox(recipe);
renderIngredients(allIngredients, "all-ingredients", false, false, false, "recipeBoxIngredient");


