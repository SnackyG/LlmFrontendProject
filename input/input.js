document.addEventListener('DOMContentLoaded', () => {
    promptBtnActionListener();
    randomBtnActionListener();
});

// Send prompt to backend
function sendPrompt() {
    const prompt = document.getElementById('prompt').value;
    console.log("Prompt:", prompt);
    const temperature = document.getElementById('temperatureSlider').value;

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

            setTimeout(() => {
                localStorage.setItem('generatedRecipe', JSON.stringify(data));
               // window.location.href = "../recipe/recipe.html";
            }, 2000); // Simulate loading screen for 2 seconds
        })
        .catch(error => {
            console.error('Der opstod en fejl:', error);
            showErrorMessage();
        });
}

// Get random recipe from backend
function getRandomRecipe() {

    fetch('http://localhost:8080/generate-random-recipe')
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("VORES tilfældige ret SER SÅDAN HER UD: ", JSON.stringify(data, null, 2));

            setTimeout(() => {
                localStorage.setItem('generatedRecipe', JSON.stringify(data));
               // window.location.href = "../recipe/recipe.html";
            }, 2000); // Simulate loading screen for 2 seconds
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
        promptBtn.addEventListener('click', sendPrompt);
    }
}

// Set up event listener for random recipe button
function randomBtnActionListener() {
    const randomBtn = document.getElementById('randomBtn');
    if (randomBtn) {
        randomBtn.addEventListener('click', getRandomRecipe);
    }
}

// Optional: Show an error message (you can customize this)
function showErrorMessage() {
    document.getElementById('loadingScreen').style.display = 'none';
    alert("Noget gik galt! Prøv igen.");
}

const slider = document.getElementById('temperatureSlider');
const sliderValue = document.getElementById('sliderValue');

slider.addEventListener('input', function() {
    sliderValue.textContent = slider.value; // Update the value display as the slider moves
});
