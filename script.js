// Impostazione del canvas per occupare tutta la finestra
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Imposta il canvas a tutto schermo
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Configurazione iniziale
const GRAVITY = 0.25;
const FLAP = -4.5;
const SPAWN_RATE = 150; // Aumentato per rendere i tubi più distanti
const PIPE_WIDTH = 50;
const PIPE_SPACING = 300; // Aumentato per maggiore distanza tra i tubi
const BIRD_WIDTH = 30;
const BIRD_HEIGHT = 30;

let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdFlap = false;

let pipes = [];
let score = 0;
let gameOver = false;

// Frasi motivazionali
const motivationalQuotes = [
    "Ben fatto! Continua a provare!",
    "Hai dato il massimo!",
    "Non mollare, ci sei quasi!",
    "Ogni fallimento è un passo verso il successo!",
    "Riprova e migliora!"
];

// Funzione per disegnare l'uccello
function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(50, birdY, BIRD_WIDTH, BIRD_HEIGHT);
}

// Funzione per disegnare i tubi
function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom);
    });
}

// Funzione per spostare i tubi
function updatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - SPAWN_RATE) {
        const topHeight = Math.floor(Math.random() * (canvas.height - PIPE_SPACING));
        const bottomHeight = topHeight + PIPE_SPACING;

        pipes.push({ x: canvas.width, top: topHeight, bottom: bottomHeight });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2; // Velocità di movimento dei tubi
    });

    pipes = pipes.filter(pipe => pipe.x + PIPE_WIDTH > 0); // Rimuovi i tubi fuori dallo schermo
}

// Funzione per gestire il movimento dell'uccello
function updateBird() {
    if (birdFlap) {
        birdVelocity = FLAP;
        birdFlap = false;
    }
    birdVelocity += GRAVITY;
    birdY += birdVelocity;

    if (birdY + BIRD_HEIGHT > canvas.height) {
        birdY = canvas.height - BIRD_HEIGHT;
        birdVelocity = 0;
    }
}

// Funzione per verificare le collisioni
function checkCollisions() {
    pipes.forEach(pipe => {
        // Collisione con i tubi
        if (
            50 + BIRD_WIDTH > pipe.x &&
            50 < pipe.x + PIPE_WIDTH &&
            (birdY < pipe.top || birdY + BIRD_HEIGHT > pipe.bottom)
        ) {
            gameOver = true;
        }
    });

    // Collisione con il suolo
    if (birdY + BIRD_HEIGHT >= canvas.height) {
        gameOver = true;
    }
}

// Funzione per aggiornare il punteggio
function updateScore() {
    pipes.forEach(pipe => {
        if (pipe.x + PIPE_WIDTH < 50 && !pipe.passed) {
            score++;
            pipe.passed = true;
        }
    });
}

// Funzione principale di disegno
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Disegna l'uccello
    drawBird();

    // Disegna i tubi
    drawPipes();

    // Visualizza il punteggio
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Punteggio: ' + score, 10, 30);

    // Se il gioco è finito
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);

        // Mostra il punteggio finale
        ctx.font = '30px Arial';
        ctx.fillText('Punteggio finale: ' + score, canvas.width / 2 - 120, canvas.height / 2 + 40);

        // Mostra una frase motivazionale
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        ctx.fillText(motivationalQuotes[randomIndex], canvas.width / 2 - 150, canvas.height / 2 + 80);

        return;
    }

    // Aggiorna i tubi
    updatePipes();

    // Aggiorna il movimento dell'uccello
    updateBird();

    // Verifica collisioni
    checkCollisions();

    // Aggiorna il punteggio
    updateScore();

    // Riprova il gioco
    requestAnimationFrame(draw);
}

// Gestione dell'input dell'utente (barra spaziatrice per far saltare l'uccello)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (gameOver) {
            pipes = [];
            birdY = canvas.height / 2;
            birdVelocity = 0;
            score = 0;
            gameOver = false;
        } else {
            birdFlap = true;
        }
    }
});

// Inizializza il gioco
draw();
