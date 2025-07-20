const gameBoard = document.getElementById('gameBoard');
let score = 0;
let timeLeft = 30;
let interval, moleTimeout;

// Slike za igru
const moleImages = [
    { src: 'zavrsni.png', points: 20 }, // Završni ispit
    { src: 'projekat.png', points: 10 }, // Projekat
    { src: 'test.png', points: 5 }, // Test
    { src: 'Bonus.png', points: 50 }, // Bonus 1
    { src: 'bonus2.png', points: 5, extraTime: true }, // Bonus 2 (dodatno vrijeme)
    { src: 'padispita1.jpg', points: -30 }, // Pad ispita 1
    { src: 'padispita2.jpg', reset: true } // Pad ispita 2 (reset bodova)
];

// Brojaci bonusa
let bonus1Count = 0;
let bonus2Count = 0;

// Funkcija za prikazivanje sekcija
function showMenu(menuId) {
    const menus = document.querySelectorAll('.menu');
    menus.forEach(menu => menu.style.display = 'none');
    document.getElementById(menuId).style.display = 'block';
}

// Funkcija za početak igre
function startGame(gridSize) {
    score = 0;
    timeLeft = 30;
    bonus1Count = 0;
    bonus2Count = 0;
    gameBoard.innerHTML = '';
    gameBoard.style.display = 'grid';
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gameBoard.appendChild(cell);
    }

    interval = setInterval(updateTimer, 1000);
    spawnMole();
}

// Funkcija za prikazivanje i smjenjivanje slika u poljima
function spawnMole() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.innerHTML = ''; // Očisti prethodne slike
        cell.classList.remove('mole');
    });

    const randomIndex = Math.floor(Math.random() * cells.length);
    const randomCell = cells[randomIndex];
    const randomImage = getRandomMole();

    if (randomImage) {
        const img = document.createElement('img');
        img.src = randomImage.src;
        img.alt = 'Mole';
        randomCell.appendChild(img);
        randomCell.classList.add('mole');

        // Dodavanje događaja za klik
        randomCell.onclick = () => checkMole(randomImage, randomCell);
    }

    moleTimeout = setTimeout(spawnMole, Math.random() * 1000 + 500);
}

// Funkcija za odabir nasumične slike, uz ograničenje bonusa
function getRandomMole() {
    const filteredMoles = moleImages.filter(image => {
        if (image.src === 'Bonus.png' && bonus1Count >= 2) return false;
        if (image.src === 'bonus2.png' && bonus2Count >= 2) return false;
        return true;
    });

    const randomIndex = Math.floor(Math.random() * filteredMoles.length);
    const selectedMole = filteredMoles[randomIndex];

    if (selectedMole.src === 'Bonus.png') bonus1Count++;
    if (selectedMole.src === 'bonus2.png') bonus2Count++;

    return selectedMole;
}

// Funkcija za provjeru odabrane slike
function checkMole(image, cell) {
    if (!cell.classList.contains('mole')) return;

    const bravoSound = document.getElementById('bravoSound');
    const wrongSound = document.getElementById('wrongSound');


    if (image.reset) {
        score = 0;
        playSound('wrongSound');
    }  else if(image.src == 'padispita1.jpg'){
        score += image.points;
        playSound('wrongSound');
    }  else if (image.extraTime) {
        timeLeft += 5;
        playSound('correctSound');
    } else {
        score += image.points;
        playSound('correctSound');

    }

    document.getElementById('score').innerText = `Score: ${score}`;
    cell.innerHTML = ''; // Ukloni sliku nakon klika
    cell.classList.remove('mole');
}

// Funkcija za ažuriranje tajmera
function updateTimer() {
    timeLeft--;
    document.getElementById('timer').innerText = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
        clearInterval(interval);
        clearTimeout(moleTimeout);
        alert(`Igra je gotova! Tvoj rezultat je: ${score}.`);
        showMenu('novaIgra');
    }
}

function playSound(effect){
    let audio = new Audio();
    if(effect == 'correctSound'){
        audio.src = 'correctSound.mp3';
    }
    else if(effect == 'wrongSound'){
        audio.src = 'wrongSound.mp3'
    }
    audio.load();
    audio.play();
}
