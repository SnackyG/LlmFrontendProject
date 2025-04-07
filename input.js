promptBtnActionListner()

function sendPrompt() {
    const prompt = document.getElementById('prompt').value;

    fetch('http://localhost:3000/api/prompts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({prompt})
    })
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("VORES DATA SER SÅDAN HER UD: "  + data);
        })
}

function promptBtnActionListner(){
    const promptBtn = document.getElementById('promptBtn');

    promptBtn.addEventListener('click', sendPrompt)

    // window.location.href = "recipe/recipe.html";
}