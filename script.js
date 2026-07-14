const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

if (menuButton && nav) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(willOpen));
    nav.classList.toggle("open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

const heroSlider = document.querySelector("[data-hero-slider]");

if (heroSlider) {
  const slides = Array.from(heroSlider.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(heroSlider.querySelectorAll("[data-slider-dot]"));
  const previousButton = heroSlider.querySelector("[data-slider-prev]");
  const nextButton = heroSlider.querySelector("[data-slider-next]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let autoplayTimer = null;
  let touchStartX = 0;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.toggleAttribute("inert", !isActive);
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      if (isActive) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  };

  const stopAutoplay = () => {
    if (autoplayTimer) window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!reducedMotion && slides.length > 1) {
      autoplayTimer = window.setInterval(() => showSlide(activeIndex + 1), 7000);
    }
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

  heroSlider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      showSlide(activeIndex - 1);
      startAutoplay();
    }
    if (event.key === "ArrowRight") {
      showSlide(activeIndex + 1);
      startAutoplay();
    }
  });

  heroSlider.addEventListener("mouseenter", stopAutoplay);
  heroSlider.addEventListener("mouseleave", startAutoplay);
  heroSlider.addEventListener("focusin", stopAutoplay);
  heroSlider.addEventListener("focusout", (event) => {
    if (!heroSlider.contains(event.relatedTarget)) startAutoplay();
  });

  heroSlider.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  heroSlider.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 50) showSlide(activeIndex + (distance < 0 ? 1 : -1));
    startAutoplay();
  }, { passive: true });

  showSlide(0);
  startAutoplay();
}
