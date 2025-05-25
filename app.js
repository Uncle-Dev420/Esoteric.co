document.addEventListener("DOMContentLoaded", () => {
  AOS.init({ duration: 800, once: true });

  new Swiper('.testimonial-swiper', {
    loop: true,
    pagination: { el: '.swiper-pagination', clickable: true }
  });

  let userInteracted = false;
  let isPlaying = true;

  const htmlEl = document.documentElement;
  const audioDay = document.getElementById("audioDay");
  const audioNight = document.getElementById("audioNight");
  const muteBtn = document.getElementById("muteToggle");
  const visualizer = document.querySelector(".visualizer");
  const customCursor = document.getElementById("custom-cursor");
  const cursorTrail = document.getElementById("cursor-trail");
  const sceneDay = document.getElementById("sceneDay");
  const sceneNight = document.getElementById("sceneNight");

  // 📱 Mobile Menu Toggle
const menuPanel = document.getElementById("mobileMenuPanel");
const openBtn = document.getElementById("mobileMenuBtn");
const closeBtn = document.getElementById("closeMenu");

openBtn?.addEventListener("click", () => menuPanel.classList.add("show"));
closeBtn?.addEventListener("click", () => menuPanel.classList.remove("show"));


  // 🌗 Theme Toggle Buttons
  ["themeToggleUniversal", "themeToggleMobile", "themeTogglePanel"].forEach(id => {
    document.getElementById(id)?.addEventListener("click", () => {
      const isDark = htmlEl.classList.contains("dark");
      applyTheme(!isDark);
    });
  });

  function applyTheme(dark) {
    htmlEl.classList.toggle("dark", dark);
    sceneDay.classList.toggle("hidden", dark);
    sceneNight.classList.toggle("hidden", !dark);
    localStorage.setItem("theme", dark ? "dark" : "light");

    audioDay.pause();
    audioNight.pause();
    audioDay.currentTime = 0;
    audioNight.currentTime = 0;

    if (isPlaying && userInteracted) {
      (dark ? audioNight : audioDay).play().catch(() => {});
    }

    // Update thumb positions
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

  // 🔊 Play audio on first interaction
  function handleUserInteraction() {
    if (!userInteracted) {
      userInteracted = true;

      const isDark = htmlEl.classList.contains("dark");
      const audio = isDark ? audioNight : audioDay;

      audio.play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          if (isPlaying) audio.play().catch(() => {});
        })
        .catch(err => {
          console.warn("⚠️ Audio blocked by browser", err);
        });

      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    }
  }

  document.addEventListener("click", handleUserInteraction);
  document.addEventListener("touchstart", handleUserInteraction);

  // 🔇 Mute Toggle
  muteBtn?.addEventListener("click", () => {
    isPlaying = !isPlaying;
    audioDay.pause();
    audioNight.pause();
    visualizer?.classList.toggle("paused", !isPlaying);
    muteBtn.textContent = isPlaying ? "🔊" : "🔇";

    if (isPlaying && userInteracted) {
      const isDark = htmlEl.classList.contains("dark");
      (isDark ? audioNight : audioDay).play().catch(() => {});
    }
  });

  // 🖱️ Custom Cursor
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

  // 📊 Scroll Progress Bar
  function updateScrollBar() {
    const scrollBar = document.getElementById("scroll-bar");
    if (!scrollBar) return;

    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    scrollBar.style.width = `${scrolled}%`;
    requestAnimationFrame(updateScrollBar);
  }
  requestAnimationFrame(updateScrollBar);

  // 🪟 Mac Popups
  window.openService = function (id) {
    const win = document.getElementById(`service-window-${id}`);
    win?.classList.remove("hidden");
  };

  window.closeWindow = function (id) {
    const win = document.getElementById(`service-window-${id}`);
    win?.classList.add("hidden");
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
});
