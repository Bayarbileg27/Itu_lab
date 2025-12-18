const words = [
    {
        word: "HOOK",
        question: "Mongol ulsiin yurunhiilugch hen be?",   
    },
    {
        word: "NEG",
        question: "Hamgiin baga eyreg too hed ve?",
    },
    {
        word: "BA",
        question: "Baisan, ba, baigaagui baisan bol hen jijig baina  ve?",
    },
    {
        word: "JAVKHLAN",
        question: "Manai bagsh hen be?",
    },
    {
        word: "BI",
        question: "Chi hen be?",
    }
];

let current = 0;
let hiddenWord = "";
let revealedIndex = 0;
let miss = 0;

const ug = document.getElementById("ug");
const asuult = document.getElementById("asuult");
const hun = document.getElementById("hun");
const aldaa = document.getElementById("aldaa");
const letters = document.querySelectorAll(".letter");


function updateImage() {
    let img = document.createElement("img");
    img.src = `${miss + 1}.png`;
    hun.innerHTML = "";
    hun.appendChild(img);
}

function startGame() {
    const data = words[current];

    hiddenWord = data.word;
    revealedIndex = 0;
    miss = 0;

    asuult.textContent = data.question;
    aldaa.textContent = "0";

    
    updateImage();

    ug.innerHTML = "";
    for (let i = 0; i < hiddenWord.length; i++) {
        const zuraas = document.createElement("span");
        zuraas.textContent = "_ ";
        ug.appendChild(zuraas);
    }


}


letters.forEach(btn => {
    btn.addEventListener("click", () => {
        const letter = btn.textContent;
        if (revealedIndex >= hiddenWord.length) return;

        const nextLetter = hiddenWord[revealedIndex];

        if (letter === nextLetter) {
            ug.children[revealedIndex].textContent = letter + " ";
            revealedIndex++;

            if (revealedIndex === hiddenWord.length) {
                hun.innerHTML = "<h2 style='color:green;'>WIN!</h2>";
            }
        } 
        else {
            miss++;
            aldaa.textContent = miss;

            if (miss < 7) {
                updateImage();
            }
        }

    });
});


document.getElementById("nextBtn").addEventListener("click", () => {
    current++;
    if (current >= words.length) current = 0;
    startGame();
});

startGame();
