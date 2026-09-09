/* =========================================================
   THAADI BHAI
   MAIN JAVASCRIPT + GSAP ANIMATIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const whatsappBase = "https://wa.me/919150288558";
    const menuModal = document.getElementById("menuModal");
    const menuButton = document.getElementById("menuButton");
    const mobileMenu = document.getElementById("mobileMenu");
    const storyModal = document.querySelector(".story-modal");
    const storyPages = document.querySelectorAll("[data-story-page]");
    const storyPageCount = document.querySelector("[data-story-page-count]");
    let activeStoryPage = 0;

    document.querySelectorAll(".menu-card img, .full-menu-item img, .story-modal img").forEach(image => {
        image.loading = "lazy";
        image.decoding = "async";
    });

    const showStoryPage = index => {
        if (!storyPages.length) return;
        activeStoryPage = (index + storyPages.length) % storyPages.length;
        storyPages.forEach((page, pageIndex) => page.classList.toggle("is-active", pageIndex === activeStoryPage));
        if (storyPageCount) storyPageCount.textContent = String(activeStoryPage + 1).padStart(2, "0");
    };

    const closeStory = () => {
        if (!storyModal) return;
        storyModal.classList.remove("is-open");
        storyModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("story-modal-open");
    };
    document.querySelectorAll(".story-open-button").forEach(button => button.addEventListener("click", () => {
        if (!storyModal) return;
        storyModal.classList.add("is-open");
        storyModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("story-modal-open");
        showStoryPage(0);
    }));
    document.querySelectorAll("[data-story-close]").forEach(button => button.addEventListener("click", closeStory));
    document.querySelector("[data-story-prev]")?.addEventListener("click", () => showStoryPage(activeStoryPage - 1));
    document.querySelector("[data-story-next]")?.addEventListener("click", () => showStoryPage(activeStoryPage + 1));

    const openMenuModal = () => {
        if (!menuModal) return;
        menuModal.classList.add("is-open");
        menuModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    };
    const closeMenuModal = () => {
        if (!menuModal) return;
        menuModal.classList.remove("is-open");
        menuModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    };

    document.querySelectorAll(".view-menu-button").forEach(button => button.addEventListener("click", openMenuModal));
    document.querySelectorAll("[data-menu-close]").forEach(button => button.addEventListener("click", closeMenuModal));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenuModal();
        if (event.key === "Escape") closeStory();
    });

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", () => mobileMenu.classList.toggle("open"));
        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => mobileMenu.classList.remove("open"));
        });
    }

    const orderItem = item => {
        const url = `${whatsappBase}?text=${encodeURIComponent(`Hi Dhaadi Bhai, I'd like to order ${item}.`)}`;
        window.open(url, "_blank", "noopener");
    };

    document.querySelectorAll("[data-order-item]").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            orderItem(button.dataset.orderItem);
        });
    });

    document.querySelectorAll(".whatsapp-action:not([data-order-item])").forEach(button => {
        button.addEventListener("click", () => {
            if (button.tagName === "A") return;
            orderItem("a shawarma");
        });
    });

    const selected = {};
    document.querySelectorAll(".builder-step").forEach(step => {
        step.addEventListener("click", () => {
            selected[step.dataset.builderStep] = step.dataset.builderLabel;
            step.parentElement.querySelectorAll(`.builder-step[data-builder-step="${step.dataset.builderStep}"]`).forEach(option => option.classList.remove("is-selected"));
            step.classList.add("is-selected");
            const summary = document.querySelector(".builder-selected");
            if (summary) summary.textContent = Object.values(selected).join(" · ");
        });
    });

    const interactiveBuildButton = document.querySelector(".build-button");
    const builderGame = document.querySelector(".builder-game");
    const gameResult = document.querySelector(".builder-game-result");
    const gameIngredients = [];
    document.querySelectorAll("[data-game-ingredient]").forEach(ingredient => {
        ingredient.addEventListener("click", () => {
            const value = ingredient.dataset.gameIngredient;
            if (!gameIngredients.includes(value)) gameIngredients.push(value);
            ingredient.classList.add("is-picked");
        });
    });
    document.querySelector(".builder-tap-button")?.addEventListener("click", () => {
        if (gameResult) {
            gameResult.hidden = false;
            gameResult.innerHTML = "<span class=\"game-roll-reveal\"><b>SHAWARMA COMPLETE</b><i></i></span><br>You've created your shawarma!<br>Call <a href=\"https://wa.me/919150288558?text=Hi%20Dhaadi%20Bhai%2C%20I%20created%20my%20shawarma%21\" target=\"_blank\" rel=\"noopener\">91502 88558</a> to receive it.";
        }
    });
    if (interactiveBuildButton) {
        interactiveBuildButton.addEventListener("click", () => {
            if (builderGame) builderGame.classList.add("is-visible");
            const summary = document.querySelector(".builder-selected");
            const chosen = Object.values(selected);
            if (summary) summary.textContent = chosen.length ? `Completed: ${chosen.join(" · ")}` : "Choose your ingredients first";
            const builderFinal = document.querySelector(".builder-final");
            if (builderFinal) builderFinal.classList.add("is-complete");
            if (chosen.length) {
                interactiveBuildButton.textContent = "ORDER THIS";
                interactiveBuildButton.appendChild(document.createTextNode(" →"));
                interactiveBuildButton.onclick = () => orderItem(`a custom shawarma with ${chosen.join(", ")}`);
            }
        });
    }

    /* Keep essential navigation available if the animation CDN is unavailable. */
    if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") {
        const loader = document.getElementById("loader");
        if (loader) loader.style.display = "none";

        return;
    }

    /* =====================================================
       GSAP SETUP
    ====================================================== */

    gsap.registerPlugin(ScrollTrigger);

    /* =====================================================
       CINEMATIC AUTO-SLIDES
    ====================================================== */

    const slideSections = [
        document.querySelector(".hero"),
        document.querySelector(".story"),
        document.querySelector(".menu-section"),
        document.querySelector(".signature-section"),
        document.querySelector(".builder-section"),
        document.querySelector(".reviews-section"),
        document.querySelector(".contact-section")
    ].filter(Boolean);
    const transition = document.querySelector(".cinematic-transition");
    const progressBar = document.querySelector(".slide-progress-track i");
    const progressCount = document.querySelector(".slide-progress-count b");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let activeSlide = 0;
    let autoTimer = null;
    let progressTween = null;
    let autoScrolling = false;
    let manuallyPaused = false;
    let resumeTimer = null;
    const slideHold = [6900, 5000, 6000, 6000, 7000, 5000, 6000];

    function updateSlideIndicator(index, progress) {
        if (progressCount) progressCount.textContent = String(index + 1).padStart(2, "0");
        if (progressBar) gsap.set(progressBar, { height: `${(progress || 0) * 100}%` });
    }

    function stopSlideTimer() {
        if (autoTimer) autoTimer.kill();
        if (progressTween) progressTween.kill();
    }

    function scheduleSlide(index, delay) {
        stopSlideTimer();
        if (reduceMotion || window.innerWidth <= 700 || manuallyPaused || index >= slideSections.length - 1) return;
        activeSlide = index;
        updateSlideIndicator(index, 0);
        progressTween = gsap.to(progressBar, { height: "100%", duration: delay / 1000, ease: "none" });
        autoTimer = gsap.delayedCall(delay / 1000, () => runSlideTransition(index, index + 1, true));
    }

    function pauseAutoSlides() {
        if (autoScrolling || reduceMotion || window.innerWidth <= 700) return;
        manuallyPaused = true;
        stopSlideTimer();
        if (resumeTimer) resumeTimer.kill();
        resumeTimer = gsap.delayedCall(6, () => {
            manuallyPaused = false;
            const nearest = slideSections.reduce((best, section, index) => {
                return Math.abs(section.offsetTop - window.scrollY) < Math.abs(slideSections[best].offsetTop - window.scrollY) ? index : best;
            }, 0);
            scheduleSlide(nearest, slideHold[nearest]);
        });
    }

    function runSlideTransition(fromIndex, toIndex, automatic) {
        if (!slideSections[fromIndex] || !slideSections[toIndex]) return;
        if (automatic && manuallyPaused) return;
        stopSlideTimer();
        const from = slideSections[fromIndex];
        const to = slideSections[toIndex];
        const effect = fromIndex;
        const scrollState = { y: window.scrollY };
        const timeline = gsap.timeline({
            onComplete: () => {
                autoScrolling = false;
                gsap.set([from, to], { clearProps: "transform,filter,opacity" });
                if (transition) gsap.set(transition, { clearProps: "opacity" });
                if (automatic) scheduleSlide(toIndex, slideHold[toIndex]);
            }
        });

        autoScrolling = true;
        updateSlideIndicator(toIndex, 0);
        if (transition) gsap.set(transition, { opacity: 1 });
        gsap.set([from, to], { transformPerspective: 900 });

        if (effect === 0) {
            timeline.to(from, { scale: .9, rotation: 2, skewX: 2, opacity: .25, duration: .65, ease: "power2.in" })
                .to(from, { scale: .98, duration: .7, ease: "power2.out" }, 0);
        } else if (effect === 1) {
            timeline.to(from, { y: -12, rotation: -.6, opacity: .2, duration: .7, ease: "power2.in" });
        } else if (effect === 2) {
            timeline.to(from, { filter: "blur(7px)", scale: 1.035, opacity: .55, duration: .8, ease: "power2.inOut" })
                .to(to, { filter: "blur(0px)", scale: 1, opacity: 1, duration: .65, ease: "power2.out" }, .45);
        } else if (effect === 3) {
            timeline.to(".transition-ink", { opacity: .94, xPercent: 110, duration: .9, ease: "power3.inOut" })
                .to(from, { opacity: .2, duration: .35 }, 0);
        } else if (effect === 4) {
            timeline.to(from, { rotationY: 12, xPercent: -5, scale: .91, opacity: .2, duration: .75, ease: "power3.in" });
        } else {
            timeline.to(".transition-smoke", { opacity: .78, x: -18, scale: 1.08, duration: .85, ease: "sine.inOut" })
                .to(".transition-fire", { opacity: .34, scale: 1.1, duration: .8 }, 0)
                .to(".transition-sparks", { opacity: .62, y: -20, duration: .8 }, 0);
        }

        timeline.to(scrollState, {
            y: to.offsetTop,
            duration: .9,
            ease: "power2.inOut",
            onUpdate: () => window.scrollTo(0, scrollState.y)
        }, effect === 3 ? .35 : .55);

        if (effect === 5) timeline.to(".transition-smoke, .transition-fire, .transition-sparks", { opacity: 0, duration: .65 }, "-=.3");
        timeline.to([from, ".transition-ink"], { clearProps: "all", opacity: 0, duration: .45 }, "-=.18");
    }

    if (!reduceMotion && window.innerWidth > 700) {
        window.addEventListener("wheel", pauseAutoSlides, { passive: true });
        window.addEventListener("touchstart", pauseAutoSlides, { passive: true });
        window.addEventListener("pointerdown", pauseAutoSlides, { passive: true });
        window.addEventListener("keydown", event => {
            if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) pauseAutoSlides();
        });
        window.addEventListener("scroll", () => {
            if (autoScrolling) return;
            const nearest = slideSections.reduce((best, section, index) => {
                return Math.abs(section.offsetTop - window.scrollY) < Math.abs(slideSections[best].offsetTop - window.scrollY) ? index : best;
            }, 0);
            if (nearest !== activeSlide) {
                activeSlide = nearest;
                updateSlideIndicator(nearest, 0);
            }
        }, { passive: true });
        gsap.delayedCall(.2, () => scheduleSlide(0, slideHold[0]));
    }


    /* =====================================================
       LOADER
    ====================================================== */

    const loader = document.getElementById("loader");

    const loaderTimeline = gsap.timeline();

    loaderTimeline
        .to(".loader-logo", {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out"
        })
        .to(".loader-line", {
            width: "180px",
            duration: 0.25,
            ease: "power2.inOut"
        })
        .to(".loader-inner p", {
            opacity: 1,
            duration: 0.1
        })
        .to(loader, {
            opacity: 0,
            duration: 0.3,
            delay: 0.75,
            ease: "power2.inOut",
            onComplete: () => {
                loader.style.display = "none";
            }
        });


    /* =====================================================
       HERO INTRO
    ====================================================== */

    const heroTimeline = gsap.timeline({ delay: 2.75 });

    gsap.set(".hero-truck-scene", { xPercent: 165, autoAlpha: 1 });
    gsap.set(".hero-title span, .hero-title strong, .hero-subtitle, .hero-tamil, .hero-feature, .main-button, .hero-tagline, .navbar", { autoAlpha: 0 });
    gsap.set(".navbar", { y: -20 });

    heroTimeline
        .to(".navbar", { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" }, 0)
        .to(".hero-truck-scene", { xPercent: 0, duration: 1.15, ease: "power4.out" }, 0.12)
        .to(".hero-sparks-art", { autoAlpha: 1, x: -34, y: -28, duration: 0.32, ease: "power2.out" }, 0.55)
        .to(".hero-truck-image", { y: -10, duration: 0.1, ease: "power1.out" }, 1.12)
        .to(".hero-truck-image", { y: 0, duration: 0.24, ease: "bounce.out" }, 1.22)
        .to(".hero-sparks-art", { autoAlpha: 0.62, duration: 0.5, ease: "power2.in" }, 1.2)
        .fromTo(".hero-title span", { x: -72, scale: 0.96 }, { x: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: "power4.out" }, 1.38)
        .fromTo(".hero-title strong", { x: -72, scale: 0.96 }, { x: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: "power4.out" }, 1.62)
        .fromTo(".hero-subtitle", { y: 16 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: "power3.out" }, 1.9)
        .fromTo(".hero-tamil", { y: 16 }, { y: 0, autoAlpha: 1, duration: 0.38, ease: "power3.out" }, 2.06)
        .fromTo(".hero-feature", { y: 22, scale: 0.96 }, { y: 0, scale: 1, autoAlpha: 1, stagger: 0.1, duration: 0.32, ease: "power3.out" }, 2.22)
        .fromTo(".main-button", { y: 18, scale: 0.92 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(1.5)" }, 2.55)
        .fromTo(".hero-tagline", { y: 8 }, { y: 0, autoAlpha: 1, duration: 0.25 }, 2.68);

    gsap.to(".hero-smoke-art", { x: 24, y: -12, scale: 1.08, duration: 5.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".hero-fire-art", { scale: 1.08, autoAlpha: 0.72, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".hero-sparks-art", { y: -10, duration: 2.7, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".hero-ingredient-burst", { y: -9, rotation: -1, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut" });


    /* =====================================================
       HERO FIRE / SMOKE
    ====================================================== */

    gsap.to(".fire-one", {
        scale: 1.2,
        opacity: 0.85,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".fire-two", {
        scale: 1.3,
        opacity: 0.4,
        duration: 2.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".smoke-one", {
        x: 60,
        y: -25,
        scale: 1.15,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".smoke-two", {
        x: -50,
        y: -30,
        scale: 1.2,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });


    /* =====================================================
       HERO EMBERS
    ====================================================== */

    gsap.utils.toArray(".embers span").forEach((ember, index) => {

        gsap.to(ember, {
            y: -60 - Math.random() * 70,
            x: (Math.random() - 0.5) * 80,
            rotation: Math.random() * 180,
            opacity: 0,
            duration: 2.5 + Math.random() * 2,
            repeat: -1,
            delay: index * 0.4,
            ease: "power1.out"
        });

    });


    /* =====================================================
       MOUSE PARALLAX
    ====================================================== */

    const hero = document.querySelector(".hero");

    if (hero && window.innerWidth > 700) {

        hero.addEventListener("mousemove", (event) => {

            const x = (event.clientX / window.innerWidth - 0.5);
            const y = (event.clientY / window.innerHeight - 0.5);

            gsap.to(".hero-truck-scene", {
                x: x * 10,
                y: y * 6,
                duration: 0.8,
                ease: "power2.out"
            });

            gsap.to(".hero-left", {
                x: x * -8,
                y: y * -5,
                duration: 1,
                ease: "power2.out"
            });

        });

    }


    /* =====================================================
       STORY ANIMATION
    ====================================================== */

    gsap.timeline({
        scrollTrigger: {
            trigger: ".story",
            start: "top 75%",
            end: "bottom 30%",
            toggleActions: "play none none reverse"
        }
    })
        .from(".story-copy", {
            x: -80,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out"
        })
        .from(".story-shawarma", {
            x: 150,
            rotation: 10,
            scale: 0.75,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=.6")
        .from(".stamp", {
            scale: 0,
            rotation: -40,
            opacity: 0,
            duration: 0.7,
            ease: "back.out(1.6)"
        }, "-=.5");


    /* =====================================================
       STORY SHAWARMA PARALLAX
    ====================================================== */

    gsap.to(".story-shawarma", {
        y: -35,
        scrollTrigger: {
            trigger: ".story",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });


    /* =====================================================
       MENU HEADING
    ====================================================== */

    gsap.from(".menu-heading", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".menu-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });


    /* =====================================================
       MENU CARDS
    ====================================================== */

    gsap.from(".menu-card", {
        y: 80,
        opacity: 0,
        scale: 0.9,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".menu-grid",
            start: "top 82%",
            toggleActions: "play none none reverse"
        }
    });


    /* =====================================================
       MENU CARD HOVER
    ====================================================== */

    document.querySelectorAll(".menu-card").forEach(card => {

        const image = card.querySelector("img");

        card.addEventListener("mouseenter", () => {

            gsap.to(card, {
                y: -8,
                duration: 0.3,
                ease: "power2.out"
            });

            if (image) {
                gsap.to(image, {
                    scale: 1.08,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }

        });

        card.addEventListener("mouseleave", () => {

            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });

            if (image) {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }

        });

    });


    /* =====================================================
       SIGNATURE SECTION
    ====================================================== */

    gsap.from(".reaper-card", {
        x: -120,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".signature-section",
            start: "top 78%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".alfaham-card", {
        x: 120,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".signature-section",
            start: "top 78%",
            toggleActions: "play none none reverse"
        }
    });


    /* =====================================================
       SIGNATURE FOOD FLOAT
    ====================================================== */

    gsap.to(".reaper-card img", {
        y: -10,
        rotation: -2,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".alfaham-card img", {
        y: -8,
        rotation: 2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    /* =====================================================
       GARNISH / CAMPAIGN ATMOSPHERE
    ====================================================== */

    gsap.utils.toArray(".garnish-chilli").forEach((item, index) => {
        gsap.to(item, {
            y: index % 2 ? -10 : 8,
            rotation: index % 2 ? 7 : -6,
            duration: 2.8 + index * .18,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * .12
        });
    });

    gsap.utils.toArray(".garnish-tomato").forEach((item, index) => {
        gsap.to(item, {
            y: -8,
            x: index % 2 ? 6 : -5,
            rotation: index % 2 ? 10 : -8,
            duration: 3.8 + index * .2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * .16
        });
    });

    gsap.to(".garnish-crumb", {
        y: -13,
        x: 8,
        rotation: 30,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        stagger: .15,
        ease: "sine.inOut"
    });

    gsap.to(".garnish-spices, .garnish-masala", {
        y: -12,
        rotation: 5,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        stagger: .3,
        ease: "sine.inOut"
    });

    gsap.to(".signature-decor .decor-fire", {
        scale: 1.08,
        autoAlpha: .58,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        stagger: .2,
        ease: "sine.inOut"
    });

    gsap.to(".signature-decor .decor-smoke", {
        y: -18,
        x: 16,
        scale: 1.08,
        autoAlpha: .34,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".garnish-sparks", {
        y: -18,
        x: 14,
        autoAlpha: .58,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });


    /* =====================================================
       BUILD YOUR OWN
    ====================================================== */

    gsap.from(".builder-heading", {
        y: 45,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: ".builder-section",
            start: "top 78%",
            toggleActions: "play none none reverse"
        }
    });


    gsap.from(".builder-step", {
        y: 50,
        opacity: 0,
        scale: 0.7,
        stagger: 0.12,
        duration: 0.6,
        ease: "back.out(1.4)",
        scrollTrigger: {
            trigger: ".builder-flow",
            start: "top 82%",
            toggleActions: "play none none reverse"
        }
    });


    gsap.from(".builder-final", {
        x: 70,
        opacity: 0,
        scale: 0.7,
        duration: 0.8,
        ease: "back.out(1.4)",
        scrollTrigger: {
            trigger: ".builder-flow",
            start: "top 82%",
            toggleActions: "play none none reverse"
        }
    });


    /* =====================================================
       BUILDER BUTTON
    ====================================================== */

    const buildButton = document.querySelector(".build-button");

    if (buildButton) {

        buildButton.addEventListener("mouseenter", () => {

            gsap.to(buildButton, {
                scale: 1.06,
                duration: 0.25
            });

        });

        buildButton.addEventListener("mouseleave", () => {

            gsap.to(buildButton, {
                scale: 1,
                duration: 0.25
            });

        });

    }


    /* =====================================================
       REVIEWS
    ====================================================== */

    gsap.from(".reviews-heading", {
        x: -80,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: ".reviews-section",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });


    gsap.from(".review-card", {
        y: 60,
        opacity: 0,
        rotation: index => index % 2 === 0 ? -2 : 2,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".reviews-grid",
            start: "top 82%",
            toggleActions: "play none none reverse"
        }
    });


    /* =====================================================
       REVIEW CARD HOVER
    ====================================================== */

    document.querySelectorAll(".review-card").forEach(card => {

        card.addEventListener("mouseenter", () => {

            gsap.to(card, {
                y: -7,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });

        });

        card.addEventListener("mouseleave", () => {

            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });

        });

    });


    /* =====================================================
       CONTACT SECTION
    ====================================================== */

    gsap.from(".location-card", {
        x: -80,
        opacity: 0,
        duration: 0.9,
        scrollTrigger: {
            trigger: ".contact-section",
            start: "top 82%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".whatsapp-card", {
        x: 80,
        opacity: 0,
        duration: 0.9,
        scrollTrigger: {
            trigger: ".contact-section",
            start: "top 82%",
            toggleActions: "play none none reverse"
        }
    });


    /* =====================================================
       TRUCK ANIMATION
    ====================================================== */

    gsap.to(".truck-illustration", {
        y: -7,
        duration: 1.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });


    /* =====================================================
       WHATSAPP BUTTON
    ====================================================== */

    const whatsapp = document.querySelector(".whatsapp-number");

    if (whatsapp) {

        gsap.to(whatsapp, {
            scale: 1.04,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    }


    /* =====================================================
       NAVBAR SCROLL
    ====================================================== */

    const navbar = document.querySelector(".navbar");

    ScrollTrigger.create({

        start: "80px top",

        onEnter: () => {
            navbar.style.background = "rgba(8,6,4,.88)";
            navbar.style.backdropFilter = "blur(12px)";
        },

        onLeaveBack: () => {
            navbar.style.background = "transparent";
            navbar.style.backdropFilter = "none";
        }

    });


    /* =====================================================
       MOBILE MENU
    ====================================================== */



    /* =====================================================
       ACTIVE NAVIGATION
    ====================================================== */

    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".desktop-nav a");

    sections.forEach(section => {

        ScrollTrigger.create({

            trigger: section,

            start: "top 50%",
            end: "bottom 50%",

            onEnter: () => updateNav(section.id),
            onEnterBack: () => updateNav(section.id)

        });

    });


    function updateNav(id) {

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + id) {
                link.classList.add("active");
            }

        });

    }


    /* =====================================================
       PARALLAX BACKGROUND
    ====================================================== */

    gsap.to(".orange-splash", {

        x: 80,
        rotation: 4,

        scrollTrigger: {
            trigger: ".story",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5
        }

    });


    /* =====================================================
       SMOOTH SECTION PARALLAX
    ====================================================== */

    gsap.utils.toArray(".signature-card").forEach(card => {

        gsap.to(card, {

            y: -15,

            scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }

        });

    });


    /* =====================================================
       IMAGE ERROR CHECK
    ====================================================== */

    document.querySelectorAll("img").forEach(img => {

        img.addEventListener("error", () => {

            console.warn(
                "Image not found:",
                img.getAttribute("src")
            );

        });

    });


    /* =====================================================
       REFRESH SCROLLTRIGGER
    ====================================================== */

    window.addEventListener("load", () => {

        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

    });


});
