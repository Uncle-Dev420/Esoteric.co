document.addEventListener("DOMContentLoaded", () => {

  AOS.init({
    duration: 800,
    once: true
  });

  new Swiper('.testimonial-swiper', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
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
  const menuBtn = document.getElementById("mobileMenuBtn");
const menuPanel = document.getElementById("mobileMenuPanel");
const closeMenu = document.getElementById("closeMenu");

menuBtn?.addEventListener("click", () => {
  menuPanel?.classList.remove("translate-x-full")
  menuPanel?.classList.remove("hidden");
});

closeMenu?.addEventListener("click", () => {
  menuPanel?.classList.remove("translate-x-full")

});


  // 🌗 Theme toggle click (works for multiple toggles)
  ["themeToggleUniversal", "themeToggleMobile", "themeToggleNav"].forEach(id => {
    const toggle = document.getElementById(id);
    toggle?.addEventListener("click", () => {
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

function handleUserInteraction() {
  console.log("🔊 handleUserInteraction fired!");

  if (!userInteracted) {
    userInteracted = true;

    const isDark = document.documentElement.classList.contains("dark");
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



  // 🔇 Mute Toggle
  muteBtn?.addEventListener("click", () => {
    isPlaying = !isPlaying;
    audioDay.pause();
    audioNight.pause();
    visualizer.classList.toggle("paused", !isPlaying);
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

  // 📊 Scroll Bar Progress
  function updateScrollBar() {
    const scrollBar = document.getElementById("scroll-bar");
    if (!scrollBar) return;

    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    scrollBar.style.width = `${scrolled}%`;

    if (!htmlEl.classList.contains("dark")) {
      scrollBar.style.background = scrolled > 75 ? "#10b981" :
                                   scrolled > 50 ? "#f59e0b" :
                                   "var(--accent-day)";
    } else {
      scrollBar.style.background = "";
      scrollBar.style.boxShadow = "";
    }

    requestAnimationFrame(updateScrollBar);
  }
  requestAnimationFrame(updateScrollBar);

  // 🪟 Mac Popups
  window.openService = function (id) {
    const win = document.getElementById(`service-window-${id}`);
    if (win) win.classList.remove("hidden");
  };

  window.closeWindow = function (id) {
    const win = document.getElementById(`service-window-${id}`);
    if (win) win.classList.add("hidden");
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

  // 📱 Mobile Nav Toggle
  document.getElementById('mobileMenu')?.addEventListener('click', () => {
    document.getElementById('mobileNav')?.classList.toggle('translate-x-full');
  });


  document.addEventListener("click", handleUserInteraction);
  document.addEventListener("touchstart", handleUserInteraction);

});



