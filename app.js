// ========== 🔊 VOICE COMMAND ENGINE ==========
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase().trim();
    handleVoiceCommand(command);
  };
}

function handleVoiceCommand(command) {
  if (command.includes("open menu")) {
    document.getElementById("mobileMenuBtn")?.click();
  } else if (command.includes("close menu")) {
    document.getElementById("dualityClose")?.click();
  } else if (command.includes("services")) {
    location.href = "#services";
  } else if (command.includes("portfolio") || command.includes("work")) {
    location.href = "#portfolio";
  } else if (command.includes("contact")) {
    location.href = "#contact";
  } else {
    const terminalText = document.getElementById("dualityTerminalText");
    if (terminalText) terminalText.textContent += `> ❌ Unknown command: "${command}"\n`;
  }
}

document.getElementById("startVoice")?.addEventListener("click", () => {
  if (recognition) {
    recognition.start();
    const terminalText = document.getElementById("dualityTerminalText");
    if (terminalText) terminalText.textContent += "> 🎙️ Listening...\n";
  } else {
    alert("Speech Recognition not supported in this browser.");
  }
});

// ========== ⌨️ DESKTOP SHORTCUT ==========
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "m") {
    document.getElementById("mobileMenuBtn")?.click();
  }
});

// ========== 🌞🌚 DUALITY ENGINE ==========
// ========== 🌞🌚 DUALITY ENGINE ==========
const dualityMenu = document.getElementById("dualityMenu");
const dualityVideo = document.getElementById("dualityVideo");
const dualityTerminal = document.getElementById("dualityTerminal");
const dualityRadial = document.getElementById("dualityRadial");
const terminalText = document.getElementById("dualityTerminalText");


// ✅ MENU AUDIO SETUP WITH SAFETY AND THEME SWITCHING

// Separate looping sounds for Day and Night menu modes
const solarMenuSound = new Audio("assets/open-solar.mp3");
solarMenuSound.loop = true;

const voidMenuSound = new Audio("assets/open-void.mp3");
voidMenuSound.loop = true;

const audioDay = document.getElementById("audioDay");
const audioNight = document.getElementById("audioNight");
const muteBtn = document.getElementById("muteToggle");
const visualizer = document.querySelector(".visualizer");

// Shared state
let isPlaying = true;
let userInteracted = false;

// ===== User interaction detection (required for autoplay permissions) =====
function handleUserInteraction() {
  if (!userInteracted) {
    userInteracted = true;
    const isDark = document.documentElement.classList.contains("dark");

    // Attempt background audio
    const ambientAudio = isDark ? audioNight : audioDay;
    if (isPlaying && ambientAudio) {
      ambientAudio.muted = false;
      ambientAudio.play().catch(err => console.warn("⚠️ Ambient audio blocked", err));
    }

    document.removeEventListener("click", handleUserInteraction);
    document.removeEventListener("touchstart", handleUserInteraction);
  }
}

// Attach interaction handlers early so it works before DOMContentLoaded
window.addEventListener("click", handleUserInteraction, { once: true });
window.addEventListener("touchstart", handleUserInteraction, { once: true });

// ===== MENU OPEN HANDLER =====
document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
  const isDark = document.documentElement.classList.contains("dark");
  const dualityMenu = document.getElementById("dualityMenu");
  const dualityVideo = document.getElementById("dualityVideo");
  const dualityTerminal = document.getElementById("dualityTerminal");
  const dualityRadial = document.getElementById("dualityRadial");
  const terminalText = document.getElementById("dualityTerminalText");

  dualityMenu.classList.remove("hidden");
  dualityTerminal.classList.toggle("hidden", !isDark);
  dualityRadial.classList.toggle("hidden", isDark);
  dualityVideo.src = isDark ? "assets/void-terminal.mp4" : "assets/sun-core.mp4";

  if (isDark && terminalText) {
    terminalText.textContent = "";
    const lines = [
      "> Initializing void engine...",
      "> Detecting temporal rift...",
      "> Access granted.\n",
      "> Choose your directive:\n"
    ];
    lines.forEach((line, i) => {
      setTimeout(() => {
        terminalText.textContent += line + "\n";
      }, 300 * i);
    });
  }

  if (isPlaying && userInteracted) {
    if (isDark) {
      voidMenuSound.play().catch(err => console.warn("🔇 Menu sound error:", err));
    } else {
      solarMenuSound.play().catch(err => console.warn("🔇 Menu sound error:", err));
    }
  }
});

// ===== MENU CLOSE HANDLER =====
document.getElementById("dualityClose")?.addEventListener("click", () => {
  const dualityMenu = document.getElementById("dualityMenu");
  dualityMenu?.classList.add("hidden");

  solarMenuSound.pause();
  voidMenuSound.pause();
  solarMenuSound.currentTime = 0;
  voidMenuSound.currentTime = 0;
});

// ===== MUTE BUTTON HANDLER =====
muteBtn?.addEventListener("click", () => {
  isPlaying = !isPlaying;

  solarMenuSound.pause();
  voidMenuSound.pause();
  audioDay.pause();
  audioNight.pause();
  solarMenuSound.currentTime = 0;
  voidMenuSound.currentTime = 0;
  audioDay.currentTime = 0;
  audioNight.currentTime = 0;

  audioDay.muted = !isPlaying;
  audioNight.muted = !isPlaying;

  if (isPlaying && userInteracted) {
    const isDark = document.documentElement.classList.contains("dark");
    const ambientAudio = isDark ? audioNight : audioDay;
    ambientAudio.muted = false;
    ambientAudio.play().catch(err => console.warn("⚠️ Resume error", err));
  }

  visualizer?.classList.toggle("paused", !isPlaying);
  muteBtn.textContent = isPlaying ? "🔊" : "🔇";
});





// ========== 🌐 MAIN SITE LOGIC ==========
document.addEventListener("DOMContentLoaded", () => {
  AOS.init({ duration: 800, once: true });

  new Swiper('.testimonial-swiper', {
    loop: true,
    pagination: { el: '.swiper-pagination', clickable: true }
  });

  // Audio + Theme
  const htmlEl = document.documentElement;
  const audioDay = document.getElementById("audioDay");
  const audioNight = document.getElementById("audioNight");
  const muteBtn = document.getElementById("muteToggle");
  const visualizer = document.querySelector(".visualizer");
  const sceneDay = document.getElementById("sceneDay");
  const sceneNight = document.getElementById("sceneNight");

  


  function applyTheme(dark) {
    htmlEl.classList.toggle("dark", dark);
    sceneDay.classList.toggle("hidden", dark);
    sceneNight.classList.toggle("hidden", !dark);
    localStorage.setItem("theme", dark ? "dark" : "light");

    audioDay.pause(); audioNight.pause();
    audioDay.currentTime = 0; audioNight.currentTime = 0;

    if (isPlaying && userInteracted) {
      (dark ? audioNight : audioDay).play().catch(() => {});
    }

    document.querySelectorAll('.toggle-thumb').forEach(thumb => {
      thumb.style.left = dark ? "33px" : "3px";
    });
  }

  function initTheme() {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved === "dark" || (!saved && prefersDark);
    applyTheme(dark);
  }

  initTheme();

  // User Interacts → Unmute
  function handleUserInteraction() {
    if (!userInteracted) {
      userInteracted = true;
      const audio = htmlEl.classList.contains("dark") ? audioNight : audioDay;
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        if (isPlaying) audio.play().catch(() => {});
      }).catch(err => console.warn("⚠️ Audio blocked", err));

      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    }
  }

  document.addEventListener("click", handleUserInteraction);
  document.addEventListener("touchstart", handleUserInteraction);

  muteBtn?.addEventListener("click", () => {
    isPlaying = !isPlaying;
    audioDay.pause(); audioNight.pause();
    visualizer?.classList.toggle("paused", !isPlaying);
    muteBtn.textContent = isPlaying ? "🔊" : "🔇";

    if (isPlaying && userInteracted) {
      const audio = htmlEl.classList.contains("dark") ? audioNight : audioDay;
      audio.play().catch(() => {});
    }
  });

  // Theme toggles
  ["themeToggleUniversal", "themeToggleMobile", "themeTogglePanel"].forEach(id => {
    document.getElementById(id)?.addEventListener("click", () => {
      const isDark = htmlEl.classList.contains("dark");
      applyTheme(!isDark);
    });
  });

  // Scroll Progress Bar
  function updateScrollBar() {
    const scrollBar = document.getElementById("scroll-bar");
    if (!scrollBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    scrollBar.style.width = `${(scrollTop / docHeight) * 100}%`;
    requestAnimationFrame(updateScrollBar);
  }
  requestAnimationFrame(updateScrollBar);

  // Cursor Trail
  const customCursor = document.getElementById("custom-cursor");
  const cursorTrail = document.getElementById("cursor-trail");

  if (!("ontouchstart" in window)) {
    let cursorX = 0, cursorY = 0, trailX = 0, trailY = 0;

    document.addEventListener("mousemove", (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      customCursor.style.top = `${cursorY}px`;
      customCursor.style.left = `${cursorX}px`;
    });

    function animateTrail() {
      trailX += (cursorX - trailX) * 0.1;
      trailY += (cursorY - trailY) * 0.1;
      cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateTrail);
    }

    requestAnimationFrame(animateTrail);
  } else {
    customCursor?.remove();
    cursorTrail?.remove();
  }

  // Mac-style popups
  window.openService = function (id) {
    document.getElementById(`service-window-${id}`)?.classList.remove("hidden");
  };

  window.closeWindow = function (id) {
    document.getElementById(`service-window-${id}`)?.classList.add("hidden");
  };

  window.minimizeWindow = function (id) {
    const win = document.getElementById(`service-window-${id}`);
    if (win) {
      win.classList.toggle('minimized');
      win.style.transform = win.classList.contains('minimized') ?
        'translate(-50%, calc(-50% + 200px))' :
        'translate(-50%, -50%)';
    }
  };

  // Mobile Menu Slide Panel
  const menuPanel = document.getElementById("mobileMenuPanel");
  const openBtn = document.getElementById("mobileMenuBtn");
  const closeBtn = document.getElementById("closeMenu");

  openBtn?.addEventListener("click", () => menuPanel?.classList.add("show"));
  closeBtn?.addEventListener("click", () => menuPanel?.classList.remove("show"));
});
