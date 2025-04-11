document.addEventListener('DOMContentLoaded', () => {
    promptBtnActionListener();
    randomBtnActionListener();
    creativitySliderSetup(); // ← tilføj denne
});


// Send prompt to backend
function sendPrompt() {
    const prompt = document.getElementById('prompt').value;
    console.log("Prompt:", prompt);
    const temperature = document.getElementById('creativitySlider').value;

    document.getElementById('promptContainer').style.display = 'none';
    document.getElementById('loadingScreen').style.display = 'flex';

    fetch('http://localhost:8080/generate-recipe?query=' + prompt + '&temperature=' + temperature)
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("VORES DATA SER SÅDAN HER UD: ", JSON.stringify(data, null, 2));

             const recipe = {
                title: data.title,
                servings: data.servings,
                ingredients_to_buy: data.ingredients_to_buy,
                ingredients_at_home: data.ingredients_at_home,
                steps: data.steps,
                prep_time_minutes: data.prep_time_minutes,
                cook_time_minutes: data.cook_time_minutes,
                tags: data.tags,
                type: 'generatedRecipe'
            }


            setTimeout(() => {
                localStorage.setItem('generatedRecipe', JSON.stringify(recipe));
                localStorage.removeItem('randomRecipe');
                window.location.href = "../recipe/recipe.html";
            }, 5);
        })
        .catch(error => {
            console.error('Der opstod en fejl:', error);
            showErrorMessage();
        });
}

// Get random recipe from backend
function getRandomRecipe() {

    document.getElementById('promptContainer').style.display = 'none';
    document.getElementById('loadingScreen').style.display = 'flex';

    fetch('http://localhost:8080/generate-random-recipe')
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("VORES tilfældige ret SER SÅDAN HER UD: ", JSON.stringify(data, null, 2));

            const recipe = {
                title: data.title,
                servings: data.servings,
                ingredients_to_buy: data.ingredients_to_buy,
                ingredients_at_home: data.ingredients_at_home,
                steps: data.steps,
                prep_time_minutes: data.prep_time_minutes,
                cook_time_minutes: data.cook_time_minutes,
                tags: data.tags,
                type: 'randomRecipe'
            }

            setTimeout(() => {
                localStorage.setItem('randomRecipe', JSON.stringify(recipe));
                localStorage.removeItem('generatedRecipe');
                window.location.href = "../recipe/recipe.html";
            }, 1000); // Simulate loading screen for 2 seconds

        })
        .catch(error => {
            console.error('Der opstod en fejl:', error);
            showErrorMessage();
        });
}

// Set up event listener for prompt button
function promptBtnActionListener() {
    const promptBtn = document.getElementById('promptBtn');
    if (promptBtn) {
        promptBtn.addEventListener('click', () => {
            sendPrompt();  // First send the prompt
            startContinuousFoodAnimation();
        });
    }
}

// Set up event listener for random recipe button
function randomBtnActionListener() {
    const randomBtn = document.getElementById('randomBtn');
    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            getRandomRecipe();  // Get random recipe
            startContinuousFoodAnimation();
        });
    }
}

// Optional: Show an error message (you can customize this)
function showErrorMessage() {
    document.getElementById('loadingScreen').style.display = 'none';
    alert("Noget gik galt! Prøv igen.");
}


function creativitySliderSetup() {
    const creativitySlider = document.getElementById("creativitySlider");
    const creativityLabel = document.getElementById("creativityLabel");

    function getCreativityText(value) {
        const v = parseFloat(value);
        if (v < 0.5) return "🤔 Bare noget simpelt";
        if (v < 1.0) return "🎨 Noget spændende";
        if (v < 1.5) return "🧠 Nu bliver det vildt!";
        if (v < 1.9) return "🚀 Kulinarisk eksperiment!";
        return "🧪💥 Madvidenskab!";
    }

    creativitySlider.addEventListener("input", () => {
        const val = creativitySlider.value;
        creativityLabel.textContent = `Kreativitetsniveau: ${getCreativityText(val)}`;
    });
}

function foodAnimation() {
    const ingredients = ["🥦", "🥩", "🧄", "🍅", "🧀", "🌶️", "🥕","🥑","🍗","🍆"];
    ingredients.forEach((emoji, index) => {
            const el = document.createElement('div');
            el.className = 'floating-ingredient';
            el.textContent = emoji;
            el.style.left = Math.random() * 100 + "%";
            document.body.appendChild(el);

            setTimeout(() => el.remove(), 3000);

        }
    );
}

let intervalTime = 600; // Starting interval time in milliseconds
let intervalId;

function startContinuousFoodAnimation() {
    function updateInterval() {
        foodAnimation(); // Trigger the food animation
        intervalTime = Math.max(25, intervalTime * 0.9); // Decrease interval time by 10% but stop at 50ms

        // Clear the previous interval and set a new one with the updated interval time
        clearInterval(intervalId);
        intervalId = setInterval(updateInterval, intervalTime); // Reset the interval with the new time
    }

    intervalId = setInterval(updateInterval, intervalTime); // Start the first interval
}