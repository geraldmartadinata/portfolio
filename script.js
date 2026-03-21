document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. NAVBAR MUSIC & TOGGLE ---
    const musicToggleBtn = document.getElementById('music-toggle');
    const musicLine = document.getElementById('music-line');
    const musicWaves = document.getElementById('music-waves');

    if (musicToggleBtn && musicLine && musicWaves) {
        let isPlaying = false;
        let bgMusic = new Audio('bg-music.mp3'); 
        bgMusic.loop = true;
        bgMusic.volume = 0; 

        const fadeAudio = (audioElement, targetVolume, duration) => {
            const steps = 20;
            const stepDuration = duration / steps;
            const volumeStep = (targetVolume - audioElement.volume) / steps;
            let currentStep = 0;
            const intervalId = setInterval(() => {
                currentStep++;
                audioElement.volume = Math.max(0, Math.min(1, audioElement.volume + volumeStep));
                if (currentStep >= steps || audioElement.volume === targetVolume) {
                    audioElement.volume = targetVolume;
                    clearInterval(intervalId);
                }
            }, stepDuration);
        };

        musicToggleBtn.addEventListener('click', () => {
            if (isPlaying) {
                fadeAudio(bgMusic, 0, 800);
                setTimeout(() => bgMusic.pause(), 800);
                
                // Menganimasikan hilangnya ombak dan munculnya garis lurus
                musicWaves.classList.remove('opacity-100', 'scale-y-100');
                musicWaves.classList.add('opacity-0', 'scale-y-0');
                setTimeout(() => { 
                    musicLine.style.opacity = '1'; 
                    musicLine.style.width = '1.25rem'; 
                }, 300);
            } else {
                bgMusic.play().catch(e => console.log("Menunggu audio...", e));
                fadeAudio(bgMusic, 0.3, 1200);
                
                // Menyembunyikan garis lurus dan memunculkan ombak
                musicLine.style.opacity = '0';
                musicLine.style.width = '0rem';
                musicWaves.classList.remove('opacity-0', 'scale-y-0');
                musicWaves.classList.add('opacity-100', 'scale-y-100');
            }
            isPlaying = !isPlaying;
        });
    }

    const menuBtn = document.getElementById('menu-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const menuIcon = document.getElementById('menu-icon');
    let isMenuOpen = false;

    if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            if (isMenuOpen) {
                dropdownMenu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0', 'is-open');
                dropdownMenu.classList.add('opacity-0', 'pointer-events-none', 'translate-y-[-15px]');
                if(menuIcon) menuIcon.classList.remove('rotate-90');
            } else {
                dropdownMenu.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-[-15px]');
                dropdownMenu.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0', 'is-open');
                if(menuIcon) menuIcon.classList.add('rotate-90');
            }
            isMenuOpen = !isMenuOpen;
        });
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !dropdownMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                dropdownMenu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0', 'is-open');
                dropdownMenu.classList.add('opacity-0', 'pointer-events-none', 'translate-y-[-15px]');
                if(menuIcon) menuIcon.classList.remove('rotate-90');
                isMenuOpen = false;
            }
        });
    }

    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // -- SCROLLBAR THEME --
    const scrollbar = document.getElementById('custom-scrollbar');
    const scrollThumb = document.getElementById('scroll-thumb');
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        scrollbar.classList.add('is-active');
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = window.scrollY / docHeight;
        const track = document.querySelector('.scroll-track');
        if(track && scrollThumb) {
            const maxMove = track.offsetHeight - scrollThumb.offsetHeight;
            scrollThumb.style.transform = `translate(-50%, ${scrollPercent * maxMove}px)`;
        }
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => scrollbar.classList.remove('is-active'), 3000);
    });

    // -- THEME SWITCHER (Light on Projects & Contact ONLY) --
    ScrollTrigger.create({
        trigger: "#projects",
        start: "top 80px", 
        endTrigger: "#work-together", 
        end: "top 80px",
        toggleClass: { targets: "#header, #custom-scrollbar", className: "theme-light" } 
    });
    ScrollTrigger.create({
        trigger: "#contact-page",
        start: "top 80px", 
        end: "bottom top",
        toggleClass: { targets: "#header, #custom-scrollbar", className: "theme-light" } 
    });

    // -- TIMELINE 1: INTRO (Zoom & BG Fade) --
    gsap.to("#giant-text-container", { opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.2 });

    const tlIntro = gsap.timeline({
        scrollTrigger: {
            trigger: "#pinned-section",
            start: "top top", 
            end: "+=250%", 
            scrub: 1,         
            pin: true
        }
    });

    const outlineTexts = document.querySelectorAll('.outline-text');
    tlIntro.to(outlineTexts, { color: "white", webkitTextStrokeWidth: "0px", duration: 1, ease: "none" })
           .to({}, { duration: 0.5 }) 
    
    .addLabel("zoomIn")
    .to("#scroll-prompt", { xPercent: -500, opacity: 0, duration: 1, ease: "power2.inOut" }, "zoomIn")
    .to("#giant-text-container", { scale: 20, opacity: 0, duration: 2, ease: "power2.in" }, "zoomIn") 
    .to("#hero-bg", { opacity: 0.4, scale: 1, duration: 2, ease: "power1.out" }, "zoomIn+=0.5")

    .addLabel("facts", "-=0.5")
    .to(".fact-reveal", { y: 0, opacity: 1, stagger: 0.1, duration: 1.2, ease: "power3.out" }, "facts")
    .to({}, { duration: 1.5 }) 
    
    .to("#blackout-screen", { opacity: 1, duration: 1.5 });

    // -- TIMELINE 2: EXPERTISE TEXT --
    const tlExpertise = gsap.timeline({
        scrollTrigger: {
            trigger: "#expertise-wrapper",
            start: "top 80%",
            end: "top 30%",
            scrub: 1
        }
    });

    tlExpertise.to("#blackout-screen", { opacity: 0, duration: 0.5 })
               .to("#text-area", { y: "0%", opacity: 1, duration: 1, ease: "power2.out" }, "enter")
               .to("#text-expertise", { y: "0%", opacity: 1, duration: 1, ease: "power2.out" }, "enter")
               .to("#text-expertise", { x: 100, duration: 1, ease: "power1.inOut" }, "shift") 
               .to("#text-desc", { opacity: 1, x: 0, duration: 1 }, "shift");

    // -- TIMELINE 3: EXPERTISE CARDS --
    const cardsWrappers = document.querySelectorAll('.lusion-card');
    const cards3D = document.querySelectorAll('.card-3d-wrapper');
    const floatingWrappers = document.querySelectorAll('.floating-wrapper');
    
    gsap.set(cardsWrappers, { xPercent: 0, rotationZ: 0 });
    gsap.set(cards3D, { rotateY: 180 });
    floatingWrappers.forEach(c => c.classList.add('floating-card'));

    // Spread
    gsap.to(cardsWrappers[0], {
        x: -340, rotationZ: 0, ease: "none",
        scrollTrigger: { trigger: "#cards-sticky-container", start: "top bottom", end: "center center", scrub: 1 }
    });
    gsap.to(cardsWrappers[2], {
        x: 340, rotationZ: 0, ease: "none",
        scrollTrigger: { trigger: "#cards-sticky-container", start: "top bottom", end: "center center", scrub: 1 }
    });

    // Flip & Fade White
    const tlCardsFlip = gsap.timeline({
        scrollTrigger: {
            trigger: "#cards-sticky-container",
            start: "center center", 
            end: "+=200%",
            scrub: 1,
            pin: true
        }
    });
    tlCardsFlip.to(cards3D, { rotateY: 0, stagger: 0.3, duration: 1.5, ease: "back.out(1.2)" })
               // Stop float saat kartu sudah terbuka
               .add(() => { floatingWrappers.forEach(c => c.classList.remove('floating-card')); }) 
               .to({}, { duration: 0.5 }) 
               // Fade overlay putih untuk transisi ke page Projects
               .to("#white-fade-overlay", { opacity: 1, duration: 1.5 });

    // -- TIMELINE 4: PROJECTS TRANSITION --
    gsap.to("#white-fade-overlay", {
        opacity: 0, duration: 1.5,
        scrollTrigger: { trigger: "#projects", start: "top 90%", end: "top 40%", scrub: 1 }
    });
    gsap.to(".project-header", {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: "#projects", start: "top 60%", scrub: false }
    });

    // Transisi Keluar dari Projects ke Let's Work (Tirai Gelap)
    gsap.to("#dark-fade-overlay", {
        opacity: 1, duration: 1,
        scrollTrigger: { trigger: "#work-together", start: "top bottom", end: "top center", scrub: 1 }
    });

    // -- TIMELINE 5: LET'S WORK TOGETHER --
    const slotTrack = document.getElementById('slot-machine-track');
    setInterval(() => {
        gsap.to(slotTrack, {
            y: -20, duration: 0.5, ease: "back.inOut(1.5)",
            onComplete: () => { gsap.set(slotTrack, { y: 0 }); }
        });
    }, 2000);

    const scrambleTexts = document.querySelectorAll('.scramble-text');
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
    
    scrambleTexts.forEach(el => {
        let text = el.innerText;
        el.innerHTML = "";
        text.split("").forEach(char => {
            let span = document.createElement("span");
            span.style.display = "inline-block";
            if(char === " ") { span.innerHTML = "&nbsp;"; el.appendChild(span); return; }
            span.innerText = char;
            span.dataset.char = char; 
            span.style.transform = "translateY(50px)";
            span.style.opacity = "0";
            el.appendChild(span);
        });
    });

    const runScramble = () => {
        scrambleTexts.forEach(el => {
            const spans = el.querySelectorAll('span[data-char]');
            spans.forEach((span, i) => {
                setTimeout(() => {
                    let rolls = 3;
                    let rollInterval = setInterval(() => {
                        span.innerText = chars[Math.floor(Math.random() * chars.length)];
                        rolls--;
                        if(rolls <= 0) {
                            clearInterval(rollInterval);
                            span.innerText = span.dataset.char; 
                            gsap.to(span, { y: 0, opacity: 1, duration: 0.3, ease: "back.out(2)" });
                        }
                    }, 50); 
                }, i * 50); 
            });
        });
    };

    ScrollTrigger.create({
        trigger: "#work-together",
        start: "top 60%",
        onEnter: runScramble,
        once: true
    });

    // Hover Skip-Ink Sequential Timeline
    const workTrigger = document.getElementById('work-trigger');
    const lineTop = document.querySelector('.custom-underline-top');
    const lineBottom = document.querySelector('.custom-underline-bottom');
    let hoverTl = gsap.timeline({ paused: true });

    // Timeline di set untuk Top maju, lalu Bottom maju
    hoverTl.to(lineTop, { scaleX: 1, duration: 0.4, ease: "power2.out" })
           .to(lineBottom, { scaleX: 1, duration: 0.4, ease: "power2.out" }, "-=0.1");

    workTrigger.addEventListener('mouseenter', () => hoverTl.play());
    // Berkat .reverse(), Bottom akan mundur duluan, lalu Top mundur
    workTrigger.addEventListener('mouseleave', () => hoverTl.reverse());

    // -- TIMELINE 6: CONTACT PAGE --
    const contactAnims = document.querySelectorAll(".contact-anim");
    ScrollTrigger.create({
        trigger: "#contact-page",
        start: "top 60%",
        onEnter: () => gsap.to(contactAnims, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" }),
        onLeaveBack: () => gsap.to(contactAnims, { y: 30, opacity: 0, duration: 0.3 }) 
    });

});