document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. NAVBAR MUSIC TOGGLE ---
    const musicToggleBtn = document.getElementById('music-toggle');
    const musicLine = document.getElementById('music-line');
    const musicWaves = document.getElementById('music-waves');

    if (musicToggleBtn && musicLine && musicWaves) {
        let isPlaying = false;
        let bgMusic = new Audio('bg-music.mp3'); 
        bgMusic.loop = true;
        bgMusic.volume = 0.3; 

        musicToggleBtn.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                musicLine.classList.remove('hidden');
                musicWaves.classList.add('hidden');
                musicWaves.classList.remove('flex');
            } else {
                bgMusic.play().catch(e => console.log("Menunggu audio...", e));
                musicLine.classList.add('hidden');
                musicWaves.classList.remove('hidden');
                musicWaves.classList.add('flex');
            }
            isPlaying = !isPlaying;
        });
    }

    // --- 2. MENU DROPDOWN LOGIC ---
    const menuBtn = document.getElementById('menu-btn');
    const menuText = document.getElementById('menu-text');
    const menuIcon = document.getElementById('menu-icon');
    const dropdownMenu = document.getElementById('dropdown-menu');
    let isMenuOpen = false;

    if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener('click', () => {
            if (isMenuOpen) {
                // Tutup Menu
                dropdownMenu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
                dropdownMenu.classList.add('opacity-0', 'pointer-events-none', 'translate-y-[-15px]');
                menuText.innerText = "Menu";
                menuIcon.classList.remove('rotate-90'); // Kembalikan posisi titik
            } else {
                // Buka Menu
                dropdownMenu.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-[-15px]');
                dropdownMenu.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
                menuText.innerText = "Close";
                menuIcon.classList.add('rotate-90'); // Putar titik jadi horizontal (seperti :)
            }
            isMenuOpen = !isMenuOpen;
        });

        // Opsional: Tutup menu jika mengklik di luar menu
        document.addEventListener('click', (e) => {
            // --- 3. MENU TEXT ANIMATION & SCROLL SPY LOGIC ---
    // Update menu click logic untuk menambahkan class 'is-open'
    if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener('click', () => {
            if (isMenuOpen) {
                dropdownMenu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0', 'is-open');
                dropdownMenu.classList.add('opacity-0', 'pointer-events-none', 'translate-y-[-15px]');
                menuText.innerText = "Menu";
                menuIcon.classList.remove('rotate-90');
            } else {
                dropdownMenu.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-[-15px]');
                dropdownMenu.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0', 'is-open');
                menuText.innerText = "Close";
                menuIcon.classList.add('rotate-90');
            }
            isMenuOpen = !isMenuOpen;
        });
    }

    // Scroll Spy untuk Titik Aktif
    const sections = document.querySelectorAll('section');
    const menuLinks = document.querySelectorAll('.menu-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Menandakan section aktif jika 50% layarnya terlihat
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                
                menuLinks.forEach(link => {
                    const dot = link.querySelector('.active-dot');
                    // Jika data-target di menu cocok dengan id section yang sedang dilihat
                    if (link.getAttribute('data-target') === targetId) {
                        dot.classList.remove('opacity-0', 'scale-0');
                        dot.classList.add('opacity-100', 'scale-100');
                    } else {
                        dot.classList.add('opacity-0', 'scale-0');
                        dot.classList.remove('opacity-100', 'scale-100');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Navbar pada saat Scroll
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Animasi Scroll Reveal (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Animasi berjalan ketika 15% elemen terlihat di layar
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Hanya animasi sekali
            }
        });
    }, observerOptions);

    // Memilih semua elemen dengan class 'hidden'
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // 3. Smooth Scrolling untuk navigasi anchor link
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
