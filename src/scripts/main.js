import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Howl } from 'howler';

gsap.registerPlugin(ScrollTrigger);

// ===== GLOBAL STATE =====
let audio = null;
let isAudioInitialized = false;
let isMuted = true;
let noButtonAttempts = 0;
const maxAttempts = 6;
let videosLoaded = false;

// ===== VIDEO PRELOADING =====
function preloadVideos() {
    if (videosLoaded) return;
    
    const videos = document.querySelectorAll('video');
    let loadedCount = 0;
    const totalVideos = videos.length;
    
    if (totalVideos === 0) {
        console.log('No videos found');
        return;
    }
    
    videos.forEach((video, index) => {
        console.log(`Loading video ${index + 1}/${totalVideos}:`, video.querySelector('source')?.src);
        
        video.load();
        
        video.addEventListener('loadeddata', () => {
            console.log(`Video ${index + 1} data loaded`);
            loadedCount++;
            if (loadedCount === totalVideos) {
                videosLoaded = true;
                console.log('All videos loaded');
            }
        }, { once: true });
        
        video.addEventListener('canplay', () => {
            console.log(`Video ${index + 1} can play`);
        }, { once: true });
        
        video.addEventListener('error', (e) => {
            console.log(`Video ${index + 1} error:`, e);
            loadedCount++;
        }, { once: true });
    });
}

// ===== AUDIO SYSTEM =====
let audioContext = null;

function initAudio() {
    if (isAudioInitialized) return;
    
    // Initialize AudioContext for mobile
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('AudioContext initialized');
    } catch (e) {
        console.log('AudioContext not supported:', e);
    }
    
    audio = new Howl({
        src: ['/src/assets/audio/musique-fond.mp3'],
        loop: true,
        volume: 0.5,
        html5: true,
        preload: true,
        onload: () => {
            console.log('Audio loaded');
        },
        onloaderror: (id, error) => {
            console.log('Audio load error:', error);
        },
        onplayerror: (id, error) => {
            console.log('Audio play error:', error);
        }
    });
    
    isAudioInitialized = true;
}

function unlockAudio() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('AudioContext resumed');
        }).catch(e => console.log('AudioContext resume error:', e));
    }
}

function playAudio() {
    if (!audio) return;
    
    // Unlock audio context first
    unlockAudio();
    
    // Force load if needed
    if (audio.state() === 'unloaded') {
        audio.load();
    }
    
    // Try to play
    audio.play().then(() => {
        console.log('Audio playing successfully');
        isMuted = false;
        updateAudioToggle();
    }).catch(error => {
        console.log('Audio play error:', error);
        
        // Aggressive fallback: try multiple times
        let attempts = 0;
        const maxAttempts = 5;
        
        const tryPlay = () => {
            if (attempts >= maxAttempts) {
                console.log('Max audio play attempts reached');
                return;
            }
            
            attempts++;
            console.log(`Audio play attempt ${attempts}`);
            
            unlockAudio();
            
            audio.play().then(() => {
                console.log('Audio playing on attempt', attempts);
                isMuted = false;
                updateAudioToggle();
            }).catch(e => {
                console.log(`Attempt ${attempts} failed:`, e);
                if (attempts < maxAttempts) {
                    setTimeout(tryPlay, 200 * attempts);
                }
            });
        };
        
        setTimeout(tryPlay, 100);
    });
}

function toggleAudio() {
    if (!audio) return;
    
    unlockAudio();
    
    if (isMuted) {
        audio.play().then(() => {
            isMuted = false;
            updateAudioToggle();
        }).catch(error => {
            console.log('Audio toggle play error:', error);
        });
    } else {
        audio.pause();
        isMuted = true;
        updateAudioToggle();
    }
}

function updateAudioToggle() {
    const toggle = document.getElementById('audio-toggle');
    if (toggle) {
        toggle.classList.toggle('muted', isMuted);
    }
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: true,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integrate with ScrollTrigger
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Disable ScrollTrigger's smooth scrolling since we're using Lenis
    ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
            return arguments.length ? lenis.scrollTo(value, 0, 0) : lenis.scroll;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.body.style.transform ? "transform" : "fixed"
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.lagSmoothing(0);
}

// ===== LANDING ANIMATION =====
function animateLanding() {
    const tl = gsap.timeline();
    
    tl.to('.landing-name', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out'
    })
    .to('.landing-subtitle', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5')
    .to('.start-button', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5');
}

// ===== TEXT REVEAL ANIMATIONS =====
function initTextReveal() {
    const allTextLines = document.querySelectorAll('.text-line');
    
    allTextLines.forEach((line, index) => {
        gsap.to(line, {
            scrollTrigger: {
                trigger: line,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse',
                scroller: document.body
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: index * 0.1,
            onStart: () => {
                line.classList.add('visible');
            }
        });
    });
}

// ===== SCENE-SPECIFIC ANIMATIONS =====
function initSceneAnimations() {
    // Scene 1: Video parallax
    gsap.to('.bg-video', {
        scrollTrigger: {
            trigger: '#scene-1',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            scroller: document.body
        },
        y: 50,
        scale: 1.1
    });

    // Scene 2: Memory reveal
    gsap.from('.memory-visual', {
        scrollTrigger: {
            trigger: '#scene-2',
            start: 'top 70%',
            scroller: document.body
        },
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: 'power3.out'
    });

    // Scene 4: Medallion
    gsap.from('.medallion-container', {
        scrollTrigger: {
            trigger: '#scene-4',
            start: 'top 70%',
            scroller: document.body
        },
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        ease: 'power3.out'
    });

    // Scene 7: Game reveal
    gsap.from('.game-content', {
        scrollTrigger: {
            trigger: '#scene-7',
            start: 'top 70%',
            scroller: document.body
        },
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out'
    });

    // Scene 8: Final
    gsap.from('.final-content', {
        scrollTrigger: {
            trigger: '#scene-8',
            start: 'top 70%',
            scroller: document.body
        },
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: 'power3.out'
    });

    // Final love message with special animation
    gsap.from('.final-love', {
        scrollTrigger: {
            trigger: '#scene-8',
            start: 'top 50%',
            scroller: document.body
        },
        opacity: 0,
        scale: 0.8,
        duration: 1.5,
        delay: 0.5,
        ease: 'elastic.out(1, 0.5)'
    });
}

// ===== PARTICLES =====
function createParticles(containerId, count = 30) {
    const container = document.getElementById(containerId);
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (8 + Math.random() * 4) + 's';
        container.appendChild(particle);
    }
}

// ===== GAME: NO BUTTON =====
const gameMessages = [
    "Essaie encore.",
    "Non non, celle-là ne compte pas.",
    "Tu es sûre ?",
    "Dernière chance de changer d'avis...",
    "Bon, ok, j'insiste un peu.",
    "Allez, le 'Oui' est juste à côté."
];

function moveNoButton() {
    const noBtn = document.getElementById('no-btn');
    const gameMessage = document.getElementById('game-message');
    
    if (!noBtn) return;

    // Calculate random movement
    const moveX = (Math.random() - 0.5) * 200; // -100 to 100px
    const moveY = (Math.random() - 0.5) * 150; // -75 to 75px

    // Apply movement using GSAP for smoother animation
    gsap.to(noBtn, {
        x: moveX,
        y: moveY,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
            // Reset position for next move
            gsap.set(noBtn, { x: 0, y: 0 });
        }
    });
    
    // Show message
    if (gameMessage && gameMessages[noButtonAttempts]) {
        gameMessage.textContent = gameMessages[noButtonAttempts];
        gameMessage.classList.add('visible');
        
        // Hide message after a delay
        setTimeout(() => {
            gameMessage.classList.remove('visible');
        }, 2000);
    }

    noButtonAttempts++;

    // Check if max attempts reached
    if (noButtonAttempts >= maxAttempts) {
        setTimeout(() => {
            gsap.to(noBtn, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    noBtn.style.display = 'none';
                    pulseYesButton();
                }
            });
        }, 300);
    }
}

function pulseYesButton() {
    const yesBtn = document.getElementById('yes-btn');
    if (yesBtn) {
        gsap.to(yesBtn, {
            scale: 1.1,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    }
}

function handleYesButton() {
    // Scroll to final scene
    const finalScene = document.getElementById('scene-8');
    if (finalScene) {
        window.scrollTo({
            top: finalScene.offsetTop,
            behavior: 'smooth'
        });
    }
}

// ===== START BUTTON =====
function handleStart() {
    // Initialize audio
    initAudio();
    
    // Multiple aggressive audio unlock attempts
    unlockAudio();
    
    // Force load and play with multiple attempts
    if (audio) {
        audio.load();
        
        // Try immediately
        audio.play().then(() => {
            console.log('Audio started immediately');
            isMuted = false;
            updateAudioToggle();
        }).catch(error => {
            console.log('Immediate play failed:', error);
            
            // Try with delays
            const delays = [100, 300, 500, 1000];
            delays.forEach((delay, index) => {
                setTimeout(() => {
                    unlockAudio();
                    audio.play().then(() => {
                        console.log(`Audio started on delay ${delay}ms`);
                        isMuted = false;
                        updateAudioToggle();
                    }).catch(e => {
                        console.log(`Play failed at ${delay}ms:`, e);
                    });
                }, delay);
            });
        });
    }

    // Play all videos after user interaction
    playAllVideos();

    // Scroll to first scene
    const scene1 = document.getElementById('scene-1');
    if (scene1) {
        scene1.scrollIntoView({ behavior: 'smooth' });
    }

    // Hide landing scene (optional, or keep it)
    // gsap.to('#scene-0', { opacity: 0, duration: 1 });
}

// ===== VIDEO PLAYBACK =====
function initVideoPlayback() {
    const videos = document.querySelectorAll('video');
    
    console.log('Found', videos.length, 'videos');
    
    videos.forEach((video, index) => {
        console.log(`Video ${index}:`, video.querySelector('source')?.src);
        
        // Set initial state
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        video.autoplay = true;
        video.load();
    });
}

// ===== FORCE ALL VIDEOS PLAY =====
function playAllVideos() {
    const videos = document.querySelectorAll('video');
    console.log('Playing all videos after user interaction');
    
    videos.forEach((video, index) => {
        // Reset and play
        video.currentTime = 0;
        video.play().then(() => {
            console.log(`Video ${index} playing successfully`);
        }).catch(error => {
            console.log(`Video ${index} play error:`, error);
        });
    });
}

// ===== INITIALIZATION =====
function init() {
    // Preload videos
    preloadVideos();

    // Initialize video system
    initVideoPlayback();

    // Setup scroll-based video control
    setupScrollVideoControl();

    // Create particles
    createParticles('particles-landing', 20);
    createParticles('particles-personality', 15);
    createParticles('particles-final', 25);

    // Initialize smooth scroll
    initSmoothScroll();

    // Animate landing
    animateLanding();

    // Initialize text reveal
    initTextReveal();

    // Initialize scene animations
    initSceneAnimations();

    // Event listeners
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', handleStart);
    }

    const audioToggle = document.getElementById('audio-toggle');
    if (audioToggle) {
        audioToggle.addEventListener('click', toggleAudio);
    }

    const noBtn = document.getElementById('no-btn');
    if (noBtn) {
        // Use both hover and touch events
        noBtn.addEventListener('mouseenter', moveNoButton);
        noBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            moveNoButton();
        });
    }

    const yesBtn = document.getElementById('yes-btn');
    if (yesBtn) {
        yesBtn.addEventListener('click', handleYesButton);
    }

    // Handle safe area updates for iOS
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            document.documentElement.style.setProperty('--safe-top', 
                `${window.visualViewport.paddingTop}px`);
            document.documentElement.style.setProperty('--safe-bottom', 
                `${window.visualViewport.paddingBottom}px`);
        });
    }
}

// ===== SCROLL VIDEO CONTROL =====
function setupScrollVideoControl() {
    const videos = document.querySelectorAll('video');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(e => console.log('Scroll play error:', e));
            } else {
                video.pause();
            }
        });
    }, {
        threshold: 0.3
    });
    
    videos.forEach(video => {
        observer.observe(video);
    });
}

// ===== START =====
document.addEventListener('DOMContentLoaded', init);