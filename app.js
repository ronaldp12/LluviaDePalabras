document.addEventListener("DOMContentLoaded", () => {
    // Selección de número de jugadores desde index.html
    const playerButtons = document.querySelectorAll(".btn-players");

    if (playerButtons) {
        playerButtons.forEach(button => {
            button.addEventListener("click", () => {
                const players = button.getAttribute("data-players");
                startGame(players);
            });
        });
    }

    function startGame(players) {
        localStorage.setItem("numPlayers", players);
        window.location.href = "words.html";
    }

    let numPlayers = localStorage.getItem("numPlayers") || 4;
    numPlayers = parseInt(numPlayers);

    let currentPlayer = 1;
    let playersScores = Array(numPlayers).fill(0);
    let playersWords = Array.from({ length: numPlayers }, () => []);
    let currentLetter = getRandomLetter();
    let timer;
    let isTurnActive = false;

    const statusMessage = document.querySelector(".status-message");
    const playerDisplay = document.querySelector(".info-game h4");
    const timerDisplay = document.querySelector("#time");
    const wordInput = document.querySelector(".enter-word input");
    const addButton = document.querySelector(".enter-word button");
    const wordListDisplay = document.querySelector(".container-list ul");
    const messageDisplay = document.querySelector("#mensaje");
    const startButton = document.querySelector(".info-game .btn");

    function startTurn() {
        if (isTurnActive) return;

        isTurnActive = true;
        wordListDisplay.innerHTML = "";
        messageDisplay.textContent = "";
        wordInput.value = "";
        wordInput.disabled = false;
        addButton.disabled = false;

        currentLetter = getRandomLetter();
        statusMessage.textContent = `Jugador ${currentPlayer}, tu letra es: "${currentLetter.toUpperCase()}"`;

        let timeLeft = 60;
        timerDisplay.textContent = `Tiempo: ${timeLeft} segundos`;

        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Tiempo: ${timeLeft} segundos`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endTurn();
            }
        }, 1000);
    }

    function endTurn() {
        isTurnActive = false;
        wordInput.disabled = true;
        addButton.disabled = true;
        startButton.disabled = false;

        statusMessage.textContent = `Fin del turno de Jugador ${currentPlayer}. Ingresó ${playersWords[currentPlayer - 1].length} palabras.`;
        playersScores[currentPlayer - 1] = playersWords[currentPlayer - 1].length;

        if (currentPlayer >= numPlayers) {
            announceWinner();
        } else {
            currentPlayer++;
            playerDisplay.textContent = `Jugador: ${currentPlayer}`;
            statusMessage.textContent += ` Jugador ${currentPlayer}, presiona "Comenzar Turno".`;
        }
    }

    function addWord() {
        if (!isTurnActive) return;
    
        let word = wordInput.value.trim().toLowerCase();
    
        if (word === "") {
            statusMessage.textContent = `⚠️ No puedes dejar el campo vacío. Debes escribir una palabra que empiece por: ${currentLetter.toUpperCase()}`;
            return;
        }

        // Validar que la palabra no sea solo la letra asignada
        if (word.length === 1 && word === currentLetter) {
            statusMessage.textContent = `⚠️ No puedes ingresar solo la letra "${currentLetter.toUpperCase()}". Debes escribir una palabra completa.`;
            return;
        }
    
        // Validar que la palabra comience con la letra asignada
        if (word[0] !== currentLetter) {
            statusMessage.textContent = `⚠️ La palabra debe comenzar con "${currentLetter.toUpperCase()}".`;
            return;
        }
    
        // Validar que la palabra no esté repetida
        if (playersWords[currentPlayer - 1].includes(word)) {
            statusMessage.textContent = "⚠️ Esta palabra ya fue ingresada.";
            return;
        }
    
        // Agregar palabra a la lista del jugador
        playersWords[currentPlayer - 1].push(word);
        let listItem = document.createElement("li");
        listItem.textContent = word;
        wordListDisplay.appendChild(listItem);
        messageDisplay.textContent = `Palabras ingresadas: ${playersWords[currentPlayer - 1].length}`;
        wordInput.value = "";
    }
    

    function announceWinner() {
        let maxScore = Math.max(...playersScores);
        let winners = playersScores.map((score, index) => (score === maxScore ? index + 1 : null)).filter(v => v !== null);

        let message = winners.length > 1 ? `🤝 ¡Empate entre jugadores ${winners.join(", ")} con ${maxScore} palabras!` :
            `🏆 ¡El ganador es el Jugador ${winners[0]} con ${maxScore} palabras! 🏆`;

        statusMessage.textContent = message;

        setTimeout(restartGame, 5000);
    }

    function restartGame() {
        currentPlayer = 1;
        playersScores = Array(numPlayers).fill(0);
        playersWords = Array.from({ length: numPlayers }, () => []);
        wordListDisplay.innerHTML = "";
        messageDisplay.textContent = "";
        wordInput.value = "";
        startButton.disabled = false;
        playerDisplay.textContent = `Jugador: ${currentPlayer}`;
        statusMessage.textContent = `Jugador ${currentPlayer}, presiona "Comenzar Turno".`;
    }

    function getRandomLetter() {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    if (startButton) {
        startButton.addEventListener("click", () => {
            if (!isTurnActive) {
                startTurn();
                startButton.disabled = true;
            }
        });
    }

    if (addButton) {
        addButton.addEventListener("click", addWord);
        wordInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                addWord();
            }
        });
    }

    if (playerDisplay) {
        playerDisplay.textContent = `Jugador: ${currentPlayer}`;
        statusMessage.textContent = `Jugador ${currentPlayer}, presiona "Comenzar Turno".`;
    }
});
