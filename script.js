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
                
                // Soundwave memudar dan menyusut ke garis pusat
                musicWaves.classList.remove('opacity-100', 'scale-x-100', 'music-waves-active');
                musicWaves.classList.add('opacity-0', 'scale-x-0');
                setTimeout(() => { 
                    musicLine.classList.remove('opacity-0', 'scale-x-0');
                }, 300);
            } else {
                bgMusic.play().catch(e => console.log("Menunggu audio...", e));
                fadeAudio(bgMusic, 0.3, 1200);
                
                // Garis menyusut, lalu Soundwave merekah dari pusat ke kiri/kanan
                musicLine.classList.add('opacity-0', 'scale-x-0');
                musicWaves.classList.remove('opacity-0', 'scale-x-0');
                musicWaves.classList.add('opacity-100', 'scale-x-100', 'music-waves-active');
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

    // -- 2. DYNAMIC THEME SWITCHER (HANYA 1 KALI TRIGGER) --
    // Mengaktifkan Light Theme saat masuk ke Projects, dan akan terus Light Theme sampai dasar halaman.
    const header = document.getElementById('header');
    
    ScrollTrigger.create({
        trigger: "#projects",
        start: "top 5%", 
        end: "max", // Menahan kondisi light-theme ini hingga maksimal/akhir scroll halaman
        onEnter: () => { header.classList.add('theme-light'); scrollbar.classList.add('theme-light'); },
        onLeaveBack: () => { header.classList.remove('theme-light'); scrollbar.classList.remove('theme-light'); }
    });

    // -- TIMELINE 1: HERO KE HELLO --
    const outlineTexts = document.querySelectorAll('.outline-text');
    const tlIntro = gsap.timeline({
        scrollTrigger: {
            trigger: "#hero-hello-space",
            start: "top top", 
            end: "bottom bottom", 
            scrub: 1
        }
    });

    tlIntro.to("#scroll-prompt", { opacity: 0, duration: 0.2 })
           .to(outlineTexts, { color: "white", webkitTextStrokeWidth: "0px", duration: 1 })
           .to("#hero-text-wrapper", { y: -80, opacity: 0, duration: 1, ease: "power2.inOut" }, "transition")
           .to("#hello-bg", { opacity: 0.5, scale: 1, duration: 1, ease: "power1.inOut" }, "transition")
           .to(".fact-reveal", { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: "power3.out" }, "transition+=0.2");

    // -- TIMELINE 2: EXPERTISE TEXT --
    const tlExpertise = gsap.timeline({
        scrollTrigger: {
            trigger: "#expertise-wrapper",
            start: "top 80%",
            end: "top 30%",
            scrub: 1
        }
    });
    tlExpertise.to("#text-area", { y: "0%", opacity: 1, duration: 1, ease: "power2.out" }, "enter")
               .to("#text-expertise", { y: "0%", opacity: 1, duration: 1, ease: "power2.out" }, "enter")
               .to("#text-expertise", { x: 100, duration: 1, ease: "power1.inOut" }, "shift") 
               .to("#text-desc", { opacity: 1, x: 0, duration: 1 }, "shift");

    // -- TIMELINE 3: EXPERTISE CARDS & FLOATING --
    const cardsWrappers = document.querySelectorAll('.lusion-card');
    const cards3D = document.querySelectorAll('.card-3d-wrapper');
    
    gsap.set(cardsWrappers, { xPercent: 0, rotationZ: 0 });
    gsap.set(cards3D, { rotateY: 180 });

    const floatAnim = gsap.to(".floating-wrapper", {
        y: -15, duration: 1.5, yoyo: true, repeat: -1, ease: "sine.inOut"
    });

    gsap.to(cardsWrappers[0], {
        x: -340, rotationZ: 0, ease: "none",
        scrollTrigger: { trigger: "#cards-scroll-space", start: "top bottom", end: "center center", scrub: 1 }
    });
    gsap.to(cardsWrappers[2], {
        x: 340, rotationZ: 0, ease: "none",
        scrollTrigger: { trigger: "#cards-scroll-space", start: "top bottom", end: "center center", scrub: 1 }
    });

    const tlCardsFlip = gsap.timeline({
        scrollTrigger: {
            trigger: "#cards-scroll-space",
            start: "top top", 
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => {
                if (self.progress > 0.6) {
                    floatAnim.pause();
                    gsap.to(".floating-wrapper", { y: 0, duration: 0.5 }); 
                } else {
                    floatAnim.play();
                }
            }
        }
    });
    tlCardsFlip.to(cards3D, { rotateY: 0, stagger: 0.2, duration: 1.5, ease: "back.out(1.2)" })
               .to({}, { duration: 0.5 }); 

    // -- TIMELINE 4: PROJECTS TRANSITION (Curtain Reveal ke Contact) --
    gsap.to("#dark-fade-overlay", {
        opacity: 1, duration: 1,
        scrollTrigger: { trigger: "#projects", start: "bottom 80%", end: "bottom 20%", scrub: 1 }
    });

    gsap.to(".project-header", {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: "#projects", start: "top 75%", scrub: false }
    });

    gsap.utils.toArray('.project-item').forEach(item => {
        gsap.to(item, {
            y: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 85%" }
        });
    });

    // -- TIMELINE 5: LET'S WORK TOGETHER --
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
        start: "top 70%",
        onEnter: () => {
            gsap.to('.work-anim', { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power3.out" });
            runScramble();
        },
        once: true
    });

    const workTrigger = document.getElementById('work-trigger');
    const lineTop = document.querySelector('.custom-underline-top');
    const lineBottom = document.querySelector('.custom-underline-bottom');
    let hoverTl = gsap.timeline({ paused: true });

    hoverTl.to(lineTop, { scaleX: 1, duration: 0.4, ease: "power2.out" })
           .to(lineBottom, { scaleX: 1, duration: 0.4, ease: "power2.out" }, "-=0.1");

    workTrigger.addEventListener('mouseenter', () => hoverTl.play());
    workTrigger.addEventListener('mouseleave', () => hoverTl.reverse());

    // -- TIMELINE 6: CONTACT PAGE --
    const contactAnims = document.querySelectorAll(".contact-anim");
    ScrollTrigger.create({
        trigger: "#contact-page",
        start: "top 80%",
        onEnter: () => gsap.to(contactAnims, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" }),
        onLeaveBack: () => gsap.to(contactAnims, { y: 30, opacity: 0, duration: 0.3 }) 
    });

});

// -- TIMELINE 7: PROJECT CLICK TRANSITION & REVERSE BACK --
    const projectItems = document.querySelectorAll('.project-item');
    
    // Mencegah browser melompat ke posisi scroll secara default
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // 1. REVERSE BACK LOGIC (Saat kembali dari halaman project)
    if (sessionStorage.getItem('returningFromProject') === 'true') {
        const savedScroll = sessionStorage.getItem('scrollPos');
        const imgIndex = sessionStorage.getItem('clickedProjectIndex');

        if (savedScroll !== null && imgIndex !== null) {
            const targetItem = projectItems[imgIndex];
            const rect = targetItem.getBoundingClientRect();
            
            // Hitung posisi absolut dan posisikan grid TEPAT di tengah layar
            const absoluteY = parseInt(savedScroll) + rect.top;
            const centerPos = absoluteY - window.innerHeight / 2 + rect.height / 2;
            window.scrollTo(0, centerPos);

            const targetImgContainer = targetItem.querySelector('.aspect-\\[16\\/10\\]');
            targetImgContainer.style.opacity = 0;

            // Buat kloningan layar penuh
            const clone = targetImgContainer.cloneNode(true);
            document.body.appendChild(clone);
            gsap.set(clone, {
                position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                zIndex: 9999, margin: 0, borderRadius: 0, objectFit: "cover"
            });

            // Animasi kembali ke grid
            const freshRect = targetImgContainer.getBoundingClientRect();
            gsap.to(clone, {
                top: freshRect.top, left: freshRect.left, width: freshRect.width, height: freshRect.height,
                borderRadius: "0.5rem", duration: 1, ease: "power3.inOut",
                onComplete: () => {
                    targetImgContainer.style.opacity = 1;
                    clone.remove();
                }
            });
        }
        sessionStorage.removeItem('returningFromProject');
        sessionStorage.removeItem('scrollPos');
        sessionStorage.removeItem('clickedProjectIndex');
    }

    // 2. PROJECT CLICK LOGIC (Saat diklik masuk)
    projectItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const imgContainer = item.querySelector('.aspect-\\[16\\/10\\]');
            const rect = imgContainer.getBoundingClientRect();

            sessionStorage.setItem('returningFromProject', 'true');
            sessionStorage.setItem('scrollPos', window.scrollY);
            sessionStorage.setItem('clickedProjectIndex', index);

            const clone = imgContainer.cloneNode(true);
            document.body.appendChild(clone);
            
            gsap.set(clone, {
                position: "fixed", top: rect.top, left: rect.left, width: rect.width, height: rect.height,
                zIndex: 9999, margin: 0
            });

            imgContainer.style.opacity = 0;

            gsap.to(clone, {
                top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0,
                duration: 0.8, ease: "power3.inOut"
            });

            gsap.to("#header, #custom-scrollbar, section", { opacity: 0, duration: 0.5, delay: 0.3 });

            setTimeout(() => {
                window.location.href = `project-${index + 1}.html`;
            }, 900);
        });
    });