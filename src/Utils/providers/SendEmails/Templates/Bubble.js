// Contador regressivo
let timeLeft = 900; // 15 minutos em segundos
const countdownElement = document.getElementById('countdown');
const retryBtn = document.getElementById('retryBtn');

function updateCountdown() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 0) {
        clearInterval(timer);
        countdownElement.textContent = "Agora!";
        retryBtn.disabled = false;
        retryBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
            Tentar Novamente
        `;
    } else {
        timeLeft--;
    }
}

const timer = setInterval(updateCountdown, 1000);
updateCountdown();