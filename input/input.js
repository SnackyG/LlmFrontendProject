promptBtnActionListner()

function sendPrompt() {
    const prompt = document.getElementById('prompt').value;
    console.log(prompt);

    document.getElementById('promptContainer').style.display = 'none';
    document.getElementById('loadingScreen').style.display = 'flex';

    // Skal rykkes ned i .then kaldet når vi har endpointet

    fetch('http://localhost:8080/generate-recipe?query=' + prompt)
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("VORES DATA SER SÅDAN HER UD: " + JSON.stringify(data, null, 2));

            setTimeout()
   //         window.location.href = "../recipe/recipe.html";
        })
        .catch(error => {
            console.error('Der opstod en fejl:', error);
        });

}

function promptBtnActionListner() {
    const promptBtn = document.getElementById('promptBtn');

    promptBtn.addEventListener('click', sendPrompt)
}