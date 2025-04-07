const recipe = {
    title: "Spaghetti Bolognese",
    servings: 4,
    ingredients_to_buy: [
        { name: "Spaghetti", amount: 400, unit: "g", price: 1.5 },
        { name: "Ground beef", amount: 500, unit: "g", price: 4.0 }
    ],
    ingredients_at_home: [
        { name: "Salt", amount: 1, unit: "tsp", price: 0 },
        { name: "Pepper", amount: 1, unit: "tsp", price: 0 }
    ],
    steps: [
        "Boil water",
        "Cook spaghetti",
        "Brown the beef",
        "Mix and season"
    ],
    prep_time_minutes: 10,
    cook_time_minutes: 20,
    tags: ["pasta", "dinner"]
};

function renderIngredients(list, elementId) {
    const ul = document.getElementById(elementId);
    ul.innerHTML = list.map(i =>
        `<li>${i.amount} ${i.unit} ${i.name}${i.price ? ` - $${i.price.toFixed(2)}` : ''}</li>`
    ).join("");
}

function calcTotal(ingredients) {
    return ingredients.reduce((sum, i) => sum + (i.price || 0), 0).toFixed(2);
}

function renderRecipeBox(recipe) {
    const box = document.getElementById("recipe-box");
    box.innerHTML = `
    <h2>${recipe.title}</h2>
    <p><strong>Servings:</strong> ${recipe.servings}</p>
    <p><strong>Prep:</strong> ${recipe.prep_time_minutes} min</p>
    <p><strong>Cook:</strong> ${recipe.cook_time_minutes} min</p>
    <h3>Steps</h3>
    <ol>${recipe.steps.map(s => `<li>${s}</li>`).join("")}</ol>
    <p><strong>Tags:</strong> ${recipe.tags.join(", ")}</p>
  `;
}

renderIngredients(recipe.ingredients_to_buy, "to-buy");
renderIngredients(recipe.ingredients_at_home, "at-home");
document.getElementById("total-price").textContent = calcTotal(recipe.ingredients_to_buy);
renderRecipeBox(recipe);
