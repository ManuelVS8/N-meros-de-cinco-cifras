/* ---------- Sonidos ---------- */
// Precarga de sonidos
const soundFiles = {
    correct: 'https://raw.githubusercontent.com/ManuelVS8/Efectos_audio/7b86808e254100aeaba6285b3e0b82650ae78055/Correcto.mp3',
    error: 'https://raw.githubusercontent.com/ManuelVS8/Efectos_audio/7b86808e254100aeaba6285b3e0b82650ae78055/Error.mp3',
    completed: 'https://raw.githubusercontent.com/ManuelVS8/Efectos_audio/7b86808e254100aeaba6285b3e0b82650ae78055/Completado.mp3',
    victory: 'https://raw.githubusercontent.com/ManuelVS8/Efectos_audio/7b86808e254100aeaba6285b3e0b82650ae78055/Termin%C3%A9.mp3',
    tap: 'https://raw.githubusercontent.com/ManuelVS8/Efectos_audio/37b3eb2da9c15c04dfb71dfe1be60f088ea3cdfc/Tap.mp3',
    final: 'https://raw.githubusercontent.com/ManuelVS8/Efectos_audio/0b28bf817be00a46c460204ed9127cfd919eea3c/Final.mp3'
};
const sounds = {};
let audioUnlocked = false;

// Cargar todos los sonidos al inicio
Object.keys(soundFiles).forEach(key => {
    sounds[key] = new Audio(soundFiles[key]);
    sounds[key].load();
});

// Función para desbloquear el audio
function unlockAudio() {
    if (audioUnlocked) return;
    
    // Crear y reproducir un sonido silencioso para desbloquear el audio
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    gainNode.gain.value = 0.001; // Volumen casi imperceptible
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.001);
    
    audioUnlocked = true;
    
    // Recargar todos los sonidos para asegurar que estén listos
    Object.keys(sounds).forEach(key => {
        sounds[key].load();
    });
}

// Funciones para reproducir sonidos
function reproducirSonidoCorrecto() {
    if (audioUnlocked && sounds.correct && !gameState.isMuted) {
        sounds.correct.currentTime = 0;
        sounds.correct.play().catch(e => console.log("Error al reproducir sonido correcto:", e));
    }
}

function reproducirSonidoError() {
    if (audioUnlocked && sounds.error && !gameState.isMuted) {
        sounds.error.currentTime = 0;
        sounds.error.play().catch(e => console.log("Error al reproducir sonido de error:", e));
    }
}

function reproducirSonidoCompletado() {
    if (audioUnlocked && sounds.completed && !gameState.isMuted) {
        sounds.completed.currentTime = 0;
        sounds.completed.play().catch(e => console.log("Error al reproducir sonido completado:", e));
    }
}

function reproducirSonidoVictoria() {
    if (audioUnlocked && sounds.victory && !gameState.isMuted) {
        sounds.victory.currentTime = 0;
        sounds.victory.play().catch(e => console.log("Error al reproducir sonido de victoria:", e));
    }
}

function reproducirSonidoTap() {
    if (audioUnlocked && sounds.tap && !gameState.isMuted) {
        sounds.tap.currentTime = 0;
        sounds.tap.play().catch(e => console.log("Error al reproducir sonido tap:", e));
    }
}

function reproducirSonidoFinal() {
    if (audioUnlocked && sounds.final && !gameState.isMuted) {
        sounds.final.currentTime = 0;
        sounds.final.play().catch(e => console.log("Error al reproducir sonido final:", e));
    }
}

/* ---------- Estado del juego ---------- */
const gameState = {
    currentNumber: null,
    userAnswer: [null, null, null, null, null], // Inicializar con 5 posiciones nulas
    score: 0,
    infiniteScore: 0,
    timeElapsed: 0,
    timerInterval: null,
    isGameActive: false,
    isMuted: false,
    totalLevels: 5,
    currentLevel: 0,
    correctAnswers: 0,
    isInfiniteMode: false
};

/* ---------- Generación de números ---------- */
function generateNumber() {
    // Generar un número aleatorio de 5 cifras con las condiciones:
    // - La decena de millar nunca puede ser cero
    // - Debe haber algún cero en las otras posiciones
    
    let number;
    let hasZero = false;
    
    do {
        // Generar un número aleatorio de 5 cifras
        number = Math.floor(Math.random() * 90000) + 10000;
        
        // Convertir a string para verificar si tiene ceros
        const numStr = number.toString();
        
        // Verificar si hay algún cero (excepto en la primera posición)
        for (let i = 1; i < numStr.length; i++) {
            if (numStr[i] === '0') {
                hasZero = true;
                break;
            }
        }
    } while (!hasZero);
    
    return number;
}

function numberToWords(number) {
    const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    const especiales = {
        10: 'diez',
        11: 'once',
        12: 'doce',
        13: 'trece',
        14: 'catorce',
        15: 'quince',
        16: 'dieciséis',
        17: 'diecisiete',
        18: 'dieciocho',
        19: 'diecinueve',
        20: 'veinte',
        21: 'veintiuno',
        22: 'veintidós',
        23: 'veintitrés',
        24: 'veinticuatro',
        25: 'veinticinco',
        26: 'veintiséis',
        27: 'veintisiete',
        28: 'veintiocho',
        29: 'veintinueve',
        30: 'treinta',
        31: 'treinta y uno',
        32: 'treinta y dos',
        33: 'treinta y tres',
        34: 'treinta y cuatro',
        35: 'treinta y cinco',
        36: 'treinta y seis',
        37: 'treinta y siete',
        38: 'treinta y ocho',
        39: 'treinta y nueve',
        40: 'cuarenta',
        41: 'cuarenta y uno',
        42: 'cuarenta y dos',
        43: 'cuarenta y tres',
        44: 'cuarenta y cuatro',
        45: 'cuarenta y cinco',
        46: 'cuarenta y seis',
        47: 'cuarenta y siete',
        48: 'cuarenta y ocho',
        49: 'cuarenta y nueve',
        50: 'cincuenta',
        51: 'cincuenta y uno',
        52: 'cincuenta y dos',
        53: 'cincuenta y tres',
        54: 'cincuenta y cuatro',
        55: 'cincuenta y cinco',
        56: 'cincuenta y seis',
        57: 'cincuenta y siete',
        58: 'cincuenta y ocho',
        59: 'cincuenta y nueve',
        60: 'sesenta',
        61: 'sesenta y uno',
        62: 'sesenta y dos',
        63: 'sesenta y tres',
        64: 'sesenta y cuatro',
        65: 'sesenta y cinco',
        66: 'sesenta y seis',
        67: 'sesenta y siete',
        68: 'sesenta y ocho',
        69: 'sesenta y nueve',
        70: 'setenta',
        71: 'setenta y uno',
        72: 'setenta y dos',
        73: 'setenta y tres',
        74: 'setenta y cuatro',
        75: 'setenta y cinco',
        76: 'setenta y seis',
        77: 'setenta y siete',
        78: 'setenta y ocho',
        79: 'setenta y nueve',
        80: 'ochenta',
        81: 'ochenta y uno',
        82: 'ochenta y dos',
        83: 'ochenta y tres',
        84: 'ochenta y cuatro',
        85: 'ochenta y cinco',
        86: 'ochenta y seis',
        87: 'ochenta y siete',
        88: 'ochenta y ocho',
        89: 'ochenta y nueve',
        90: 'noventa',
        91: 'noventa y uno',
        92: 'noventa y dos',
        93: 'noventa y tres',
        94: 'noventa y cuatro',
        95: 'noventa y cinco',
        96: 'noventa y seis',
        97: 'noventa y siete',
        98: 'noventa y ocho',
        99: 'noventa y nueve'
    };

    // Convertir el número a string para procesar cada dígito
    const numStr = number.toString();
    
    // Obtener las partes del número
    const parte1 = parseInt(numStr.substring(0, 2)); // Primera parte (dos dígitos)
    const parte2 = parseInt(numStr.substring(2, 5)); // Segunda parte (tres dígitos)
    
    // Función para convertir números menores a 1000
    function convertirMenorAMil(num) {
        if (num === 0) return '';
        if (num === 100) return 'cien';
        if (especiales[num]) return especiales[num];
        
        let resultado = '';
        
        const centena = Math.floor(num / 100);
        const resto = num % 100;
        
        if (centena > 0) {
            resultado += centenas[centena];
            if (resto > 0) resultado += ' ';
        }
        
        if (resto > 0) {
            if (especiales[resto]) {
                resultado += especiales[resto];
            } else {
                const decena = Math.floor(resto / 10);
                const unidad = resto % 10;
                
                if (decena > 0) {
                    resultado += decenas[decena];
                    if (unidad > 0) resultado += ' y ';
                }
                
                if (unidad > 0) {
                    resultado += unidades[unidad];
                }
            }
        }
        
        return resultado;
    }
    
    // Convertir cada parte
    const parte1Str = convertirMenorAMil(parte1);
    const parte2Str = convertirMenorAMil(parte2);
    
    // Unir las partes con "mil"
    let resultado = parte1Str;
    
    // Corregir "uno" a "un" cuando va seguido de "mil"
    if (resultado === 'veintiuno') {
        resultado = 'veintiún';
    } else if (resultado === 'treinta y uno') {
        resultado = 'treinta y un';
    } else if (resultado === 'cuarenta y uno') {
        resultado = 'cuarenta y un';
    } else if (resultado === 'cincuenta y uno') {
        resultado = 'cincuenta y un';
    } else if (resultado === 'sesenta y uno') {
        resultado = 'sesenta y un';
    } else if (resultado === 'setenta y uno') {
        resultado = 'setenta y un';
    } else if (resultado === 'ochenta y uno') {
        resultado = 'ochenta y un';
    } else if (resultado === 'noventa y uno') {
        resultado = 'noventa y un';
    } else if (resultado === 'uno') {
        resultado = 'un';
    }
    
    if (parte1 > 0) {
        resultado += ' <span class="keyword-highlight">mil</span>'; // Palabra "mil" en color naranja
        if (parte2 > 0) resultado += ' ';
    }
    resultado += parte2Str;
    
    // Capitalizar la primera letra del resultado
    if (resultado.length > 0) {
        resultado = resultado.charAt(0).toUpperCase() + resultado.slice(1);
    }
    
    return resultado;
}

/* ---------- Inicialización del juego ---------- */
function initGame() {
    // Reiniciar estado del juego
    gameState.currentNumber = generateNumber();
    gameState.userAnswer = [null, null, null, null, null]; // Reiniciar con 5 posiciones nulas
    
    if (!gameState.isInfiniteMode) {
        gameState.currentLevel++;
        // Actualizar el indicador de nivel
        document.getElementById('levelIndicator').textContent = `Nivel ${gameState.currentLevel}/${gameState.totalLevels}`;
        document.getElementById('levelIndicator').style.display = 'block';
        document.getElementById('infiniteMode').style.display = 'none';
        document.getElementById('gameScore').innerHTML = 'Puntos: <span id="score">' + gameState.score + '</span>';
    } else {
        // En modo infinito, mostrar "Nivel infinito" y la puntuación infinita
        document.getElementById('levelIndicator').style.display = 'none';
        document.getElementById('infiniteMode').style.display = 'block';
        document.getElementById('gameScore').innerHTML = 'Puntos: <span id="score">' + gameState.infiniteScore + '</span>';
    }
    
    // Actualizar la pantalla
    document.getElementById('numberDisplay').innerHTML = numberToWords(gameState.currentNumber);
    
    // Limpiar las posiciones y eliminar clases de estado
    document.querySelectorAll('.position').forEach(pos => {
        pos.textContent = '';
        pos.classList.remove('filled', 'correct', 'incorrect');
    });
    
    // Generar dígitos para el banco (1-9, 0)
    generateDigitBank();
    
    // Actualizar la barra de progreso (solo en modo normal)
    if (!gameState.isInfiniteMode) {
        updateProgress();
    }
    
    // Ocultar botón continuar y mostrar botón comprobar
    document.getElementById('continueBtn').style.display = 'none';
    document.getElementById('checkBtn').style.display = 'flex';
    
    // El botón comprobar siempre está activo
    document.getElementById('checkBtn').disabled = false;
}

function generateDigitBank() {
    const digitBank = document.getElementById('digitBank');
    digitBank.innerHTML = '';
    
    // Crear los dígitos del 1 al 9 y luego el 0
    for (let i = 1; i <= 9; i++) {
        const digitElement = document.createElement('div');
        digitElement.className = 'digit';
        digitElement.textContent = i.toString();
        digitElement.addEventListener('click', function() {
            selectDigit.call(this, i.toString());
        });
        digitBank.appendChild(digitElement);
    }
    
    // Añadir el 0 al final
    const zeroElement = document.createElement('div');
    zeroElement.className = 'digit';
    zeroElement.textContent = '0';
    zeroElement.addEventListener('click', function() {
        selectDigit.call(this, '0');
    });
    digitBank.appendChild(zeroElement);
}

function selectDigit(digit) {
    reproducirSonidoTap();
    
    // Buscar la primera posición vacía (null)
    const emptyIndex = gameState.userAnswer.findIndex(val => val === null);
    
    if (emptyIndex !== -1) {
        // Colocar el dígito en la primera posición vacía
        gameState.userAnswer[emptyIndex] = digit;
        
        // Actualizar la visualización
        const positionElement = document.querySelector(`.position[data-index="${emptyIndex}"]`);
        positionElement.textContent = digit;
        positionElement.classList.add('filled');
    }
}

function checkAnswer() {
    // Verificar si la respuesta es correcta
    // Si hay alguna posición nula, la respuesta está incompleta y es incorrecta
    if (gameState.userAnswer.includes(null)) {
        // Respuesta incompleta, incorrecta
        reproducirSonidoError();
        
        // Mostrar el resultado
        document.querySelectorAll('.position').forEach((pos, index) => {
            const correctDigit = gameState.currentNumber.toString()[index];
            
            // Si la posición está vacía o tiene un valor incorrecto
            if (gameState.userAnswer[index] === null || gameState.userAnswer[index] !== correctDigit) {
                pos.classList.add('incorrect');
            } else {
                // Si el valor es correcto
                pos.classList.add('correct');
            }
        });
        
        // Ocultar el botón comprobar y mostrar el botón continuar
        document.getElementById('checkBtn').style.display = 'none';
        document.getElementById('continueBtn').style.display = 'flex';
        return;
    }
    
    // Si no hay nulos, verificar si la respuesta es correcta
    const userNumber = parseInt(gameState.userAnswer.join(''));
    const isCorrect = userNumber === gameState.currentNumber;
    
    if (isCorrect) {
        // Si la respuesta es correcta, actualizar puntuación
        gameState.correctAnswers++;
        if (gameState.isInfiniteMode) {
            gameState.infiniteScore += 10;
            document.getElementById('score').textContent = gameState.infiniteScore;
        } else {
            gameState.score += 20; // 20 puntos por cada respuesta correcta (100/5)
            document.getElementById('score').textContent = gameState.score;
        }
        reproducirSonidoCorrecto();
        
        // Verificar si hemos completado todos los niveles (solo en modo normal)
        if (!gameState.isInfiniteMode && gameState.currentLevel >= gameState.totalLevels) {
            endGame();
            return;
        }
        
        // Pasar al siguiente nivel sin retardo
        setTimeout(() => {
            initGame();
        }, 500); // Pequeña demora para que el usuario vea que fue correcto
    } else {
        // Si la respuesta es incorrecta, mostrar los errores
        reproducirSonidoError();
        
        // Mostrar el resultado
        document.querySelectorAll('.position').forEach((pos, index) => {
            const correctDigit = gameState.currentNumber.toString()[index];
            
            // Si la posición está vacía o tiene un valor incorrecto
            if (gameState.userAnswer[index] === null || gameState.userAnswer[index] !== correctDigit) {
                pos.classList.add('incorrect');
            } else {
                // Si el valor es correcto
                pos.classList.add('correct');
            }
        });
        
        // Ocultar el botón comprobar y mostrar el botón continuar
        document.getElementById('checkBtn').style.display = 'none';
        document.getElementById('continueBtn').style.display = 'flex';
    }
}

function continueGame() {
    // Verificar si hemos completado todos los niveles (solo en modo normal)
    if (!gameState.isInfiniteMode && gameState.currentLevel >= gameState.totalLevels) {
        endGame();
        return;
    }
    
    // Inicializar el siguiente nivel sin demora
    initGame();
}

function updateProgress() {
    const progress = (gameState.currentLevel / gameState.totalLevels) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timeElapsed++;
        const minutes = Math.floor(gameState.timeElapsed / 60);
        const seconds = gameState.timeElapsed % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(gameState.timerInterval);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function endGame() {
    // Detener el temporizador
    stopTimer();
    
    // Calcular la puntuación final
    const finalScore = gameState.score; // Ya no es necesario calcularlo, es directamente la puntuación acumulada
    
    // Mostrar la pantalla de resultados
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('resultsScreen').classList.add('active');
    
    // Actualizar los resultados
    document.getElementById('finalScore').textContent = finalScore;
    document.getElementById('finalTime').textContent = formatTime(gameState.timeElapsed);
    
    // Mostrar el trofeo si la puntuación es perfecta
    if (finalScore === 100) {
        document.getElementById('trophyContainer').style.display = 'block';
        reproducirSonidoVictoria();
        createConfetti();
    } else {
        reproducirSonidoFinal();
        
        // Mostrar un mensaje de ánimo según la puntuación
        const encouragementMessage = document.getElementById('encouragementMessage');
        encouragementMessage.style.display = 'block';
        
        if (finalScore >= 80) {
            encouragementMessage.textContent = '¡Excelente trabajo! Sigue así.';
        } else if (finalScore >= 60) {
            encouragementMessage.textContent = '¡Buen trabajo! Puedes mejorar.';
        } else if (finalScore >= 40) {
            encouragementMessage.textContent = 'Sigue practicando, mejorarás.';
        } else {
            encouragementMessage.textContent = 'No te rindas, la práctica hace al maestro.';
        }
    }
}

function resetGame() {
    // Mostrar la ventana de confirmación
    document.getElementById('resetModal').style.display = 'flex';
}

function confirmReset() {
    // Ocultar la ventana de confirmación
    document.getElementById('resetModal').style.display = 'none';
    
    if (gameState.isInfiniteMode) {
        // Si estamos en modo infinito, volver a la pantalla de inicio
        goToStartScreen();
    } else {
        // Reiniciar el estado del juego
        gameState.currentNumber = null;
        gameState.userAnswer = [null, null, null, null, null];
        gameState.score = 0;
        gameState.timeElapsed = 0;
        gameState.currentLevel = 0;
        gameState.correctAnswers = 0;
        
        // Actualizar la puntuación
        document.getElementById('score').textContent = '0';
        
        // Detener el temporizador
        stopTimer();
        
        // Reiniciar el temporizador
        document.getElementById('timer').textContent = '00:00';
        
        // Volver a la pantalla de inicio
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('resultsScreen').classList.remove('active');
        document.getElementById('startScreen').classList.add('active');
    }
}

function cancelReset() {
    // Ocultar la ventana de confirmación
    document.getElementById('resetModal').style.display = 'none';
}

function goToStartScreen() {
    // Reiniciar el estado del juego
    gameState.currentNumber = null;
    gameState.userAnswer = [null, null, null, null, null];
    gameState.score = 0;
    gameState.infiniteScore = 0;
    gameState.timeElapsed = 0;
    gameState.currentLevel = 0;
    gameState.correctAnswers = 0;
    gameState.isInfiniteMode = false;
    
    // Actualizar la puntuación
    document.getElementById('score').textContent = '0';
    
    // Detener el temporizador
    stopTimer();
    
    // Reiniciar el temporizador
    document.getElementById('timer').textContent = '00:00';
    
    // Volver a la pantalla de inicio
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('startScreen').classList.add('active');
}

function playAgain() {
    goToStartScreen();
}

function startInfiniteMode() {
    // Configurar el modo infinito
    gameState.isInfiniteMode = true;
    gameState.currentNumber = null;
    gameState.userAnswer = [null, null, null, null, null];
    gameState.score = 0;
    gameState.infiniteScore = 0;
    gameState.timeElapsed = 0;
    gameState.currentLevel = 0;
    gameState.correctAnswers = 0;
    
    // Actualizar la puntuación
    document.getElementById('score').textContent = '0';
    
    // Reiniciar el temporizador
    document.getElementById('timer').textContent = '00:00';
    
    // Ocultar el trofeo y el mensaje de ánimo
    document.getElementById('trophyContainer').style.display = 'none';
    document.getElementById('encouragementMessage').style.display = 'none';
    
    // Cambiar el texto del botón reiniciar
    document.getElementById('resetBtn').textContent = 'Volver a la pantalla de inicio';
    
    // Iniciar el juego
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    
    // Inicializar el juego
    initGame();
    
    // Iniciar el temporizador
    startTimer();
}

function toggleMute() {
    gameState.isMuted = !gameState.isMuted;
    document.getElementById('muteBtn').textContent = gameState.isMuted ? '🔇' : '🔊';
}

function createConfetti() {
    // Crear confeti que cae hacia abajo
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Posición aleatoria en la parte superior
            const x = Math.random() * window.innerWidth;
            const y = -10; // Comienza un poco arriba de la pantalla
            
            // Color aleatorio
            const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Configurar el confeti
            confetti.style.left = `${x}px`;
            confetti.style.top = `${y}px`;
            confetti.style.backgroundColor = color;
            
            // Tamaño aleatorio
            const size = Math.random() * 10 + 5;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            // Dirección horizontal aleatoria
            const tx = (Math.random() - 0.5) * 100; // Movimiento horizontal aleatorio
            const ty = window.innerHeight + 10; // Caer hasta abajo de la pantalla
            
            confetti.style.setProperty('--tx', `${tx}px`);
            confetti.style.setProperty('--ty', `${ty}px`);
            
            // Añadir al DOM
            document.body.appendChild(confetti);
            
            // Eliminar después de la animación
            setTimeout(() => {
                confetti.remove();
            }, 3000); // 3 segundos para que caiga
        }, i * 30); // Cada 30ms un nuevo confeti
    }
}

// Event listeners
document.getElementById('startBtn').addEventListener('click', () => {
    reproducirSonidoTap();
    unlockAudio();
    document.getElementById('startScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    initGame();
    startTimer();
});

document.getElementById('checkBtn').addEventListener('click', checkAnswer);
document.getElementById('continueBtn').addEventListener('click', continueGame);
document.getElementById('resetBtn').addEventListener('click', () => {
    reproducirSonidoTap();
    resetGame();
});
document.getElementById('confirmResetBtn').addEventListener('click', () => {
    reproducirSonidoTap();
    confirmReset();
});
document.getElementById('cancelResetBtn').addEventListener('click', () => {
    reproducirSonidoTap();
    cancelReset();
});
document.getElementById('playAgainBtn').addEventListener('click', () => {
    reproducirSonidoTap();
    unlockAudio();
    playAgain();
});
document.getElementById('infiniteBtn').addEventListener('click', () => {
    reproducirSonidoTap();
    unlockAudio();
    startInfiniteMode();
});
document.getElementById('muteBtn').addEventListener('click', toggleMute);

// Permitir hacer clic en las posiciones para corregir
document.querySelectorAll('.position').forEach(position => {
    position.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        
        // Verificar si esta posición ya está llenada
        if (gameState.userAnswer[index] === null) return;
        
        // Verificar si el botón continuar está visible
        if (document.getElementById('continueBtn').style.display !== 'none') return;
        
        // Limpiar solo esta posición
        gameState.userAnswer[index] = null;
        this.textContent = '';
        this.classList.remove('filled');
    });
});