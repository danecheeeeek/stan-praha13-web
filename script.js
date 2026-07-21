(() => {
  "use strict";

  const NEWS_DATA_URL = "data/aktuality.json";
  let newsRequest = null;

  const loadNews = () => {
    if (!newsRequest) {
      newsRequest = fetch(NEWS_DATA_URL, { cache: "no-store" }).then((response) => {
        if (!response.ok) throw new Error(`Aktuality se nepodařilo načíst (${response.status}).`);
        return response.json();
      }).then((items) => Array.isArray(items) ? items : []);
    }
    return newsRequest;
  };

  const cleanSlug = (value) => String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const addText = (parent, tagName, className, text) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = String(text || "");
    parent.append(element);
    return element;
  };

  const normaliseGallery = (gallery) => {
    if (Array.isArray(gallery)) return gallery.filter(Boolean);
    return gallery ? [gallery] : [];
  };

  const createNewsArticle = (item, index) => {
    const slug = cleanSlug(item.slug) || `aktualita-${index + 1}`;
    const gallery = normaliseGallery(item.gallery);
    const detailsText = String(item.details || "").trim();
    const hasDetails = Boolean(detailsText || gallery.length);
    const article = document.createElement("article");
    article.className = `news-row reveal${item.image ? "" : " news-row--no-image"}`;
    article.id = slug;
    article.dataset.newsArticle = "";
    article.style.setProperty("--news-index", String(index));

    if (item.image) {
      const media = document.createElement("figure");
      media.className = "news-row__media";
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.imageAlt || "";
      image.loading = index === 0 ? "eager" : "lazy";
      image.decoding = "async";
      media.append(image);
      article.append(media);
    }

    const content = document.createElement("div");
    content.className = "news-row__content";
    addText(content, "span", "news-date", item.dateLabel);
    addText(content, "h2", "", item.title);
    addText(content, "p", "news-summary", item.summary);

    const actions = document.createElement("div");
    actions.className = "news-actions";

    let detailPanel = null;
    let detailButton = null;
    if (hasDetails) {
      const detailId = `podrobnosti-${slug}`;
      detailButton = document.createElement("button");
      detailButton.className = "button news-detail-toggle";
      detailButton.type = "button";
      detailButton.setAttribute("aria-expanded", "false");
      detailButton.setAttribute("aria-controls", detailId);
      detailButton.textContent = "Zobrazit podrobnosti";
      actions.append(detailButton);

      detailPanel = document.createElement("div");
      detailPanel.className = "news-details";
      detailPanel.id = detailId;
      detailPanel.hidden = true;

      detailsText.split(/\n\s*\n/).filter(Boolean).forEach((paragraph) => {
        addText(detailPanel, "p", "", paragraph.replace(/\s*\n\s*/g, " "));
      });

      if (gallery.length) {
        const galleryElement = document.createElement("div");
        galleryElement.className = "news-gallery";
        gallery.forEach((source, galleryIndex) => {
          const link = document.createElement("a");
          link.href = source;
          link.target = "_blank";
          link.rel = "noopener";
          link.setAttribute("aria-label", `Otevřít fotografii ${galleryIndex + 1} v plné velikosti`);
          const image = document.createElement("img");
          image.src = source;
          image.alt = `${item.title || "Aktualita"} – fotografie ${galleryIndex + 1}`;
          image.loading = "lazy";
          image.decoding = "async";
          link.append(image);
          galleryElement.append(link);
        });
        detailPanel.append(galleryElement);
      }

      detailButton.addEventListener("click", () => {
        const willOpen = detailButton.getAttribute("aria-expanded") !== "true";
        detailButton.setAttribute("aria-expanded", String(willOpen));
        detailButton.textContent = willOpen ? "Skrýt podrobnosti" : "Zobrazit podrobnosti";
        detailPanel.hidden = !willOpen;
        article.classList.toggle("is-expanded", willOpen);
      });
    }

    if (item.externalUrl) {
      const externalLink = document.createElement("a");
      externalLink.className = "button button-outline news-external-link";
      externalLink.href = item.externalUrl;
      externalLink.target = "_blank";
      externalLink.rel = "noopener";
      externalLink.textContent = item.externalLabel || "Otevřít odkaz";
      actions.append(externalLink);
    }

    if (actions.children.length) content.append(actions);
    if (detailPanel) content.append(detailPanel);
    article.append(content);
    return article;
  };

  const openNewsFromHash = (smooth = false) => {
    if (!window.location.hash) return;
    let slug = "";
    try {
      slug = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      slug = window.location.hash.slice(1);
    }
    const article = document.getElementById(slug);
    if (!article?.matches("[data-news-article]")) return;

    document.querySelectorAll("[data-news-article].is-targeted").forEach((item) => {
      item.classList.remove("is-targeted");
    });
    article.classList.add("is-targeted");

    const toggle = article.querySelector(".news-detail-toggle");
    if (toggle?.getAttribute("aria-expanded") !== "true") toggle.click();

    window.setTimeout(() => {
      article.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    }, 60);
  };

  const renderNewsPage = async () => {
    const list = document.querySelector("[data-news-list]");
    if (!list) return;
    try {
      const items = await loadNews();
      list.replaceChildren(...items.map(createNewsArticle));
      if (!items.length) addText(list, "p", "news-error", "Zatím jsme nezveřejnili žádnou aktualitu.");
      openNewsFromHash(false);
    } catch (error) {
      list.replaceChildren();
      addText(list, "p", "news-error", "Aktuality se teď nepodařilo načíst. Zkuste prosím stránku obnovit.");
      console.error(error);
    }
  };

  const populateNewsCarousel = async () => {
    const marker = document.querySelector("[data-news-carousel]");
    if (!marker) return;
    try {
      const items = (await loadNews()).filter((item) => item.showInCarousel);
      items.forEach((item) => {
        const slug = cleanSlug(item.slug);
        if (!slug) return;
        const slide = document.createElement("article");
        slide.className = "hero-slide hero-slide-event";
        slide.dataset.heroSlide = "";
        slide.setAttribute("aria-hidden", "true");
        slide.inert = true;

        const hero = document.createElement("div");
        hero.className = "hero hero-event";
        const visual = document.createElement("div");
        visual.className = "hero-visual hero-event-visual";
        const source = item.carouselImage || item.image;
        if (source) {
          const image = document.createElement("img");
          image.className = "hero-event-image";
          image.src = source;
          image.alt = item.carouselImageAlt || item.imageAlt || "";
          image.decoding = "async";
          visual.append(image);
        }

        const copy = document.createElement("div");
        copy.className = "hero-copy event-slide-copy";
        addText(copy, "h2", "", item.carouselTitle || item.title);
        addText(copy, "p", "", item.carouselSummary || item.summary);
        const link = document.createElement("a");
        link.className = "button";
        link.href = `aktuality.html#${encodeURIComponent(slug)}`;
        link.textContent = "Více o události";
        copy.append(link);
        hero.append(visual, copy);
        slide.append(hero);
        marker.before(slide);
      });
    } catch (error) {
      console.error(error);
    } finally {
      marker.remove();
    }
  };

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

    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    const desktopQuery = window.matchMedia("(min-width: 981px)");
    desktopQuery.addEventListener?.("change", (event) => {
      if (event.matches) closeMenu();
    });
  }

  const initializeHeroSliders = async () => {
    await populateNewsCarousel();

    document.querySelectorAll("[data-hero-slider]").forEach((slider) => {
      const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
      const dotsContainer = slider.querySelector(".slider-dots");
      const previousButton = slider.querySelector("[data-slider-prev]");
      const nextButton = slider.querySelector("[data-slider-next]");

      slides.forEach((slide, index) => {
        slide.setAttribute("aria-label", `${index + 1} z ${slides.length}`);
      });

      if (dotsContainer) {
        dotsContainer.replaceChildren(...slides.map((slide, index) => {
          const dot = document.createElement("button");
          dot.className = `slider-dot${index === 0 ? " is-active" : ""}`;
          dot.type = "button";
          dot.dataset.sliderDot = String(index);
          dot.setAttribute("aria-label", `Zobrazit okno ${index + 1}`);
          if (index === 0) dot.setAttribute("aria-current", "true");
          return dot;
        }));
      }

      const dots = Array.from(slider.querySelectorAll("[data-slider-dot]"));
      if (slides.length < 2) {
        previousButton?.setAttribute("hidden", "");
        nextButton?.setAttribute("hidden", "");
        dotsContainer?.setAttribute("hidden", "");
        return;
      }

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
          if (active) dot.setAttribute("aria-current", "true");
          else dot.removeAttribute("aria-current");
        });
      };

      const stopAutoplay = () => {
        if (autoplayTimer !== null) window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      };
      const startAutoplay = () => {
        stopAutoplay();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        autoplayTimer = window.setInterval(() => showSlide(activeIndex + 1), autoplayDelay);
      };

      previousButton?.addEventListener("click", () => { showSlide(activeIndex - 1); startAutoplay(); });
      nextButton?.addEventListener("click", () => { showSlide(activeIndex + 1); startAutoplay(); });
      dots.forEach((dot, index) => dot.addEventListener("click", () => { showSlide(index); startAutoplay(); }));

      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        slider.addEventListener("pointerenter", stopAutoplay);
        slider.addEventListener("pointerleave", startAutoplay);
      }
      slider.addEventListener("focusin", stopAutoplay);
      slider.addEventListener("focusout", (event) => {
        if (!slider.contains(event.relatedTarget)) startAutoplay();
      });
      slider.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0]?.clientX ?? null;
        stopAutoplay();
      }, { passive: true });
      slider.addEventListener("touchend", (event) => {
        if (touchStartX === null) return;
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
        const distance = touchEndX - touchStartX;
        touchStartX = null;
        if (Math.abs(distance) > 55) showSlide(activeIndex + (distance < 0 ? 1 : -1));
        startAutoplay();
      }, { passive: true });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopAutoplay();
        else startAutoplay();
      });
      showSlide(activeIndex);
      startAutoplay();
    });
  };

  const newsletterFormId = "n7DU5l";
  const newsletterStorageKey = "stan-praha13-newsletter-auto-shown";
  const newsletterTriggers = document.querySelectorAll(".newsletter-trigger");
  const rememberNewsletterShown = () => {
    try { window.sessionStorage.setItem(newsletterStorageKey, "1"); } catch { /* no-op */ }
  };
  newsletterTriggers.forEach((trigger) => trigger.addEventListener("click", rememberNewsletterShown));

  if (document.body.hasAttribute("data-newsletter-auto")) {
    let newsletterAlreadyShown = false;
    try { newsletterAlreadyShown = window.sessionStorage.getItem(newsletterStorageKey) === "1"; } catch { /* no-op */ }
    if (!newsletterAlreadyShown) {
      const showNewsletter = () => {
        try { if (window.sessionStorage.getItem(newsletterStorageKey) === "1") return; } catch { /* no-op */ }
        if (document.body.classList.contains("menu-open") || typeof window.ml !== "function") {
          window.setTimeout(showNewsletter, 750);
          return;
        }
        rememberNewsletterShown();
        window.ml("show", newsletterFormId, true);
      };
      window.setTimeout(showNewsletter, 5000);
    }
  }

  window.addEventListener("hashchange", () => openNewsFromHash(true));
  renderNewsPage();
  initializeHeroSliders();
})();
