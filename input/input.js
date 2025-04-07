promptBtnActionListner()

function sendPrompt() {
    const prompt = document.getElementById('prompt').value;


    // Skal rykkes ned i .then kaldet når vi har endpointet

    fetch('http://localhost:3000/generate-recipe?query='+ prompt)
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("VORES DATA SER SÅDAN HER UD: " + data);
            window.location.href = "../recipe/recipe.html";
        })
}

function promptBtnActionListner() {
    const promptBtn = document.getElementById('promptBtn');

    promptBtn.addEventListener('click', sendPrompt)
}