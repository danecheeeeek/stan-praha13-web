(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Otevřít menu");
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(willOpen));
      menuButton.setAttribute("aria-label", willOpen ? "Zavřít menu" : "Otevřít menu");
      navigation.classList.toggle("open", willOpen);
      document.body.classList.toggle("menu-open", willOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    const desktopQuery = window.matchMedia("(min-width: 981px)");
    const handleDesktop = (event) => {
      if (event.matches) closeMenu();
    };
    desktopQuery.addEventListener?.("change", handleDesktop);
  }

  document.querySelectorAll("[data-hero-slider]").forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(slider.querySelectorAll("[data-slider-dot]"));
    const previousButton = slider.querySelector("[data-slider-prev]");
    const nextButton = slider.querySelector("[data-slider-next]");

    if (slides.length < 2) return;

    let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let autoplayTimer = null;
    let touchStartX = null;
    const autoplayDelay = 8000;

    const showSlide = (requestedIndex) => {
      activeIndex = (requestedIndex + slides.length) % slides.length;

      slides.forEach((slide, index) => {
        const active = index === activeIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
        if ("inert" in slide) slide.inert = !active;
      });

      dots.forEach((dot, index) => {
        const active = index === activeIndex;
        dot.classList.toggle("is-active", active);
        if (active) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    };

    const stopAutoplay = () => {
      if (autoplayTimer !== null) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const startAutoplay = () => {
      stopAutoplay();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      autoplayTimer = window.setInterval(() => showSlide(activeIndex + 1), autoplayDelay);
    };

    previousButton?.addEventListener("click", () => {
      showSlide(activeIndex - 1);
      startAutoplay();
    });

    nextButton?.addEventListener("click", () => {
      showSlide(activeIndex + 1);
      startAutoplay();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index);
        startAutoplay();
      });
    });

    // Pauzu při najetí myší používáme jen na zařízeních se skutečnou myší.
    // Dotykový telefon tak po prvním klepnutí nezůstane omylem zastavený.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      slider.addEventListener("pointerenter", stopAutoplay);
      slider.addEventListener("pointerleave", startAutoplay);
    }
    slider.addEventListener("focusin", stopAutoplay);
    slider.addEventListener("focusout", (event) => {
      if (!slider.contains(event.relatedTarget)) startAutoplay();
    });

    slider.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0]?.clientX ?? null;
        stopAutoplay();
      },
      { passive: true }
    );

    slider.addEventListener(
      "touchend",
      (event) => {
        if (touchStartX === null) return;
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
        const distance = touchEndX - touchStartX;
        touchStartX = null;
        if (Math.abs(distance) > 55) showSlide(activeIndex + (distance < 0 ? 1 : -1));
        startAutoplay();
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    showSlide(activeIndex);
    startAutoplay();
  });
})();
