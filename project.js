document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- LOGIKA NAVBAR ---
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
                musicWaves.classList.remove('opacity-100', 'scale-x-100', 'music-waves-active');
                musicWaves.classList.add('opacity-0', 'scale-x-0');
                setTimeout(() => { musicLine.classList.remove('opacity-0', 'scale-x-0'); }, 300);
            } else {
                bgMusic.play().catch(e => console.log("Menunggu audio...", e));
                fadeAudio(bgMusic, 0.3, 1200);
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

    // --- LOGIKA ANIMASI MASUK (ENTRY ANIMATIONS) ---
    const urlParams = new URLSearchParams(window.location.search);
    const isFromBridge = urlParams.get('bridge') === 'true'; 
    const isProject2 = document.body.classList.contains('is-project-2');
    const tlEntry = gsap.timeline();

    if (isProject2 && isFromBridge) {
        const actualTitle = document.querySelector(".proj-title");
        actualTitle.classList.remove('translate-y-10'); 
        actualTitle.style.opacity = 0; 
        
        const cloneTitle = document.createElement("h1");
        cloneTitle.innerHTML = actualTitle.innerHTML;
        cloneTitle.className = actualTitle.className; 
        cloneTitle.classList.remove('opacity-0', 'absolute', 'bottom-full', 'left-0', 'mb-4');
        
        gsap.set(cloneTitle, {
            position: "fixed", top: "50%", left: "50%",
            xPercent: -50, yPercent: -50, zIndex: 9999, textAlign: "center"
        });
        document.body.appendChild(cloneTitle);

        setTimeout(() => {
            const destRect = actualTitle.getBoundingClientRect();
            
            tlEntry.to(cloneTitle, {
                top: destRect.top, left: destRect.left, xPercent: 0, yPercent: 0,
                textAlign: "left", duration: 1.2, ease: "power3.inOut",
                onComplete: () => {
                    actualTitle.style.opacity = 1; 
                    cloneTitle.remove();           
                }
            }, 0.2)
            .to(".proj-text", { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.6")
            .to(".proj-img", { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=0.8");
        }, 50);

    } else {
        gsap.from("body", { opacity: 0, duration: 1, ease: "power2.out" });
        tlEntry.to(".proj-title", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0.2)
               .to(".proj-text", { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }, 0.4)
               .to(".proj-img", { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 0.5);
    }

    // --- HORIZONTAL SCROLL ---
    const scroller = document.getElementById("horizontal-scroller");
    const totalScroll = scroller.scrollWidth - window.innerWidth;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#project-wrapper", pin: true, scrub: 1,
            end: "+=" + totalScroll 
        }
    });

    tl.to(scroller, { x: -totalScroll, ease: "none", duration: 1 });

    // Efek Fade Scroll to Explore (Hanya aktif jika elemennya ada, misal di Project 1)
    if(document.getElementById("scroll-explore")) {
        gsap.to("#scroll-explore", {
            opacity: 0,
            scrollTrigger: { trigger: "#project-wrapper", start: "top top", end: "+=300", scrub: true }
        });
    }

    gsap.utils.toArray('.proj-img-extra').forEach(img => {
        gsap.to(img, {
            scale: 1, opacity: 1, duration: 1.2, ease: "power2.out",
            scrollTrigger: { trigger: img, containerAnimation: tl, start: "left 85%", toggleActions: "play none none reverse" }
        });
    });

    gsap.utils.toArray('.proj-img-large').forEach(img => {
        gsap.to(img, {
            y: 0, opacity: 1, duration: 1.8, ease: "elastic.out(1, 0.8)",
            scrollTrigger: { trigger: img, containerAnimation: tl, start: "left 80%", toggleActions: "play none none reverse" }
        });
    });

    // --- LOGIKA PROGRESS BAR CUSTOM UNTUK P1 & P2 ---
    let fillLevel = 0;
    let isNavigating = false;
    
    // Identifikasi letak progress bar di P1 atau P2
    const progressFill = document.getElementById("progress-fill") || document.getElementById("progress-fill-p2");

    if (progressFill) {
        window.addEventListener('wheel', (e) => {
            const st = tl.scrollTrigger;
            if (st && st.progress > 0.99) {
                if (e.deltaY > 0 && !isNavigating) {
                    fillLevel += 6; 
                    if (fillLevel > 100) fillLevel = 100;
                    gsap.to(progressFill, { width: fillLevel + "%", duration: 0.1 });
                    
                    if (fillLevel === 100) {
                        isNavigating = true;
                        if (isProject2) {
                            triggerComingSoon(); // Aksi untuk P2
                        } else {
                            triggerNextProject(); // Aksi untuk P1
                        }
                    }
                }
            }
        });

        // Drain effect (menyusut jika diam)
        setInterval(() => {
            if (!isNavigating && fillLevel > 0) {
                fillLevel -= 1; 
                gsap.to(progressFill, { width: fillLevel + "%", duration: 0.1 });
            }
        }, 50);
    }

    // Aksi Bridging P1 -> P2
    function triggerNextProject() {
        const nextBlock = document.querySelector('.next-project-block');
        const rect = nextBlock.getBoundingClientRect();
        
        const expander = document.createElement('div');
        expander.style.position = 'fixed'; expander.style.top = '0'; expander.style.right = '0'; 
        expander.style.width = rect.width + 'px'; expander.style.height = '100vh';
        expander.style.backgroundColor = '#f3f4f6'; expander.style.zIndex = '9999';
        expander.style.display = 'flex'; expander.style.justifyContent = 'center'; expander.style.alignItems = 'center';
        
        expander.innerHTML = `<h2 class="text-4xl md:text-[3.5rem] font-[500] tracking-tighter text-center leading-none text-black whitespace-nowrap">Stock<br>Updater</h2>`;
        document.body.appendChild(expander);
        
        nextBlock.style.opacity = 0;
        
        gsap.to(expander, { width: "100vw", duration: 1.2, ease: "power4.inOut" });
        setTimeout(() => { window.location.href = 'project-2.html?bridge=true'; }, 1500);
    }

    // Aksi Bridging P2 -> P3 (Coming Soon -> Index)
    function triggerComingSoon() {
        const nextTitle = document.getElementById('next-title-p2');
        
        // Ganti Teks dengan efek loncatan
        gsap.to(nextTitle, {
            opacity: 0, y: -20, duration: 0.3, 
            onComplete: () => {
                nextTitle.innerHTML = "Coming<br>Soon!";
                nextTitle.classList.add("text-[#ff5500]"); // Warna mencolok
                gsap.to(nextTitle, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)" });
            }
        });

        // Samarkan layar kemudian arahkan pulang ke Index
        setTimeout(() => {
            gsap.to("body", { opacity: 0, duration: 0.8 });
            setTimeout(() => { window.location.href = 'index.html#projects'; }, 800);
        }, 1200);
    }
});