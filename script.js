document.addEventListener("DOMContentLoaded", function () {
  const timerDisplay = document.getElementById("timer");
  const startPauseButton = document.getElementById("start-pause");
  const toggleMusicButton = document.getElementById("alternar-musica");
  const contextButtons = document.querySelectorAll(".app__card-button");
  const contextImage = document.getElementById("context-image"); // Imagem do contexto
  const audio = new Audio("./musica.mp3"); // Música de fundo
  const playSound = new Audio("./play-sound.mp3"); // Som de play
  const pauseSound = new Audio("./pause-sound.mp3"); // Som de pause

  // Inicia o áudio mudo para evitar bloqueios de autoplay
  audio.volume = 0;

  let countdown;
  let timeLeft = 0;
  let isPaused = true;
  let currentContext = "foco";

  // Cores de fundo para cada contexto
  const backgroundColors = {
    foco: "#332253", // Cor para o modo foco
    short: "#07333e", // Cor para o descanso curto
    long: "#091428", // Cor para o descanso longo
  };

  // Imagens para cada contexto
  const contextImages = {
    foco: "/imagens/foco.png", // Imagem para o modo foco
    short: "/imagens/short.png", // Imagem para o descanso curto
    long: "/imagens/long.png", // Imagem para o descanso longo
  };

  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }

  function startTimer(duration) {
    clearInterval(countdown);
    timeLeft = duration;
    updateTimerDisplay();
    isPaused = false;
    startPauseButton.innerHTML =
      '<img class="app__card-primary-butto-icon" src="/imagens/pause.png" alt=""><span>Pausar</span>';
    playSound.play(); // Toca o som de play

    countdown = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(countdown);
        isPaused = true;
        startPauseButton.innerHTML =
          '<img class="app__card-primary-butto-icon" src="/imagens/play_arrow.png" alt=""><span>Começar</span>';
        alert("Tempo acabou!");
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(countdown);
    isPaused = true;
    startPauseButton.innerHTML =
      '<img class="app__card-primary-butto-icon" src="/imagens/play_arrow.png" alt=""><span>Começar</span>';
    pauseSound.play(); // Toca o som de pause
  }

  function setContext(context) {
    currentContext = context;
    contextButtons.forEach((button) => button.classList.remove("active"));
    document
      .querySelector(`[data-contexto="${context}"]`)
      .classList.add("active");
    document.body.setAttribute("data-contexto", context);

    // Altera a imagem e o background
    contextImage.style.opacity = 0; // Faz a imagem desaparecer suavemente
    setTimeout(() => {
      contextImage.src = contextImages[context]; // Altera a imagem
      contextImage.style.opacity = 1; // Faz a imagem aparecer suavemente
    }, 500); // Tempo correspondente à duração da transição

    // Altera a cor de fundo
    document.body.style.backgroundColor = backgroundColors[context];

    if (context === "foco") {
      timeLeft = 20 * 60;
    } else if (context === "short") {
      timeLeft = 5 * 60;
    } else if (context === "long") {
      timeLeft = 10 * 60;
    }

    updateTimerDisplay();
  }

  startPauseButton.addEventListener("click", () => {
    if (isPaused) {
      startTimer(timeLeft);
    } else {
      pauseTimer();
    }

    // Força a interação do usuário para permitir a reprodução do áudio
    if (toggleMusicButton.checked) {
      audio.volume = 1.0; // Aumenta o volume
      audio
        .play()
        .then(() => {
          console.log("Música iniciada após interação do usuário");
        })
        .catch((error) => {
          console.error("Erro ao reproduzir música:", error);
        });
    }
  });

  contextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setContext(button.getAttribute("data-contexto"));
    });
  });

  toggleMusicButton.addEventListener("change", () => {
    console.log("Checkbox alterado:", toggleMusicButton.checked); // Verifique no console
    if (toggleMusicButton.checked) {
      audio.volume = 1.0; // Aumenta o volume
      audio
        .play()
        .then(() => {
          console.log("Música iniciada"); // Verifique se a música começou
        })
        .catch((error) => {
          console.error("Erro ao reproduzir música:", error); // Verifique erros
        });
    } else {
      audio.pause();
      console.log("Música pausada");
    }
  });

  // Inicializa o contexto padrão
  setContext(currentContext);
});
