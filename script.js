document.addEventListener('DOMContentLoaded', () => {

    // --- SVG Icons (Unchanged) ---
    const moonIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#606770">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>`;
    const sunIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#e4e6eb">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>`;
    
    // =================================================================
    // --- MASTER CONFIGURATION PANEL ---
    // =================================================================
    const CONFIGURATION = {
        THEME_TRANSITION_DURATION: 350,
        STAR_COUNT: 600,
        ROTATION_SPEED: 0.001,
        ORBITAL_RINGS: 100,
        TRAIL_LENGTH: { min: 0.09, max: 0.11 },
        NORMAL_STAR_THICKNESS: { min: 0.5, max: 1.0 },
        SPECIAL_STAR_THICKNESS: { min: 1.0, max: 2.0 },
        SPECIAL_STAR_CHANCE: 0.04,
        GLOW_ENABLED: false,
        GLOW_RADIUS_MULTIPLIER: 7,
        GLOW_OPACITY: 0.3,
        ROTATION_CENTER: { x: 50, y: 180 },
        THEME_COLORS: {
            light: { bg: '#ffffffff', normal: '#000000ff', special: '#00aeff' },
            dark:  { bg: '#000000ff', normal: '#ffffffff', special: '#00aeff' }
        }
    };
    // =================================================================

    // --- Element Selectors & State ---
    const body = document.body;
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const themeSwitcher = document.getElementById('theme-switcher');
    const canvas = document.getElementById('star-canvas');
    const ctx = canvas.getContext('2d');
    let stars = [], totalAngle = 0, pivotX, pivotY;
    let isThemeTransitioning = false, transitionStartTime = 0, fromTheme, toTheme;

    Object.values(CONFIGURATION.THEME_COLORS).forEach(theme => {
        theme.bgRgb = hexToRgb(theme.bg);
        theme.normalRgb = hexToRgb(theme.normal);
        theme.specialRgb = hexToRgb(theme.special);
    });

    // --- Event Listeners ---
    showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); loginForm.classList.remove('active'); registerForm.classList.add('active'); });
    showLoginLink.addEventListener('click', (e) => { e.preventDefault(); registerForm.classList.remove('active'); loginForm.classList.add('active'); });
    
    themeSwitcher.innerHTML = moonIcon;
    themeSwitcher.addEventListener('click', () => {
        if (isThemeTransitioning) return;
        const isCurrentlyDark = body.classList.contains('dark-mode');
        fromTheme = isCurrentlyDark ? CONFIGURATION.THEME_COLORS.dark : CONFIGURATION.THEME_COLORS.light;
        toTheme = isCurrentlyDark ? CONFIGURATION.THEME_COLORS.light : CONFIGURATION.THEME_COLORS.dark;
        isThemeTransitioning = true;
        transitionStartTime = Date.now();
        body.classList.toggle('dark-mode');
        themeSwitcher.innerHTML = body.classList.contains('dark-mode') ? sunIcon : moonIcon;
    });

    // --- Core Functions ---
    function setCanvasDimensions() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        pivotX = canvas.width * (CONFIGURATION.ROTATION_CENTER.x / 100);
        pivotY = canvas.height * (CONFIGURATION.ROTATION_CENTER.y / 100);
    }

    function initStars() {
        stars = [];
        const maxRadius = Math.sqrt(Math.max(pivotX**2, (canvas.width - pivotX)**2) + Math.max(pivotY**2, (canvas.height - pivotY)**2));
        const radiusSteps = [];
        for (let i = 1; i <= CONFIGURATION.ORBITAL_RINGS; i++) {
            radiusSteps.push(Math.sqrt(i / CONFIGURATION.ORBITAL_RINGS) * maxRadius);
        }
        for (let i = 0; i < CONFIGURATION.STAR_COUNT; i++) {
            const isSpecial = Math.random() < CONFIGURATION.SPECIAL_STAR_CHANCE;
            const sizeConfig = isSpecial ? CONFIGURATION.SPECIAL_STAR_THICKNESS : CONFIGURATION.NORMAL_STAR_THICKNESS;
            stars.push({
                size: Math.random() * (sizeConfig.max - sizeConfig.min) + sizeConfig.min,
                isSpecial: isSpecial,
                r: radiusSteps[i % CONFIGURATION.ORBITAL_RINGS],
                theta: Math.random() * 2 * Math.PI,
                trailLength: Math.random() * (CONFIGURATION.TRAIL_LENGTH.max - CONFIGURATION.TRAIL_LENGTH.min) + CONFIGURATION.TRAIL_LENGTH.min
            });
        }
    }

    function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    
    function hexToRgb(hex) {
        const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : {r:0,g:0,b:0};
    }

    // --- UPDATED ANIMATE FUNCTION WITH LAYERED DRAWING ---
    function animate() {
        let currentCanvasTheme = {};

        if (isThemeTransitioning) {
            const elapsed = Date.now() - transitionStartTime;
            const linearProgress = Math.min(elapsed / CONFIGURATION.THEME_TRANSITION_DURATION, 1);
            const easedProgress = easeInOutCubic(linearProgress);
            const interpolate = (from, to) => `rgb(${Math.round(from.r + (to.r - from.r) * easedProgress)}, ${Math.round(from.g + (to.g - from.g) * easedProgress)}, ${Math.round(from.b + (to.b - from.b) * easedProgress)})`;
            currentCanvasTheme = {
                bg: interpolate(fromTheme.bgRgb, toTheme.bgRgb),
                normal: interpolate(fromTheme.normalRgb, toTheme.normalRgb),
                special: interpolate(fromTheme.specialRgb, toTheme.specialRgb),
            };
            if (linearProgress >= 1) isThemeTransitioning = false;
        } else {
            const theme = body.classList.contains('dark-mode') ? CONFIGURATION.THEME_COLORS.dark : CONFIGURATION.THEME_COLORS.light;
            currentCanvasTheme = { bg: theme.bg, normal: theme.normal, special: theme.special };
        }

        ctx.fillStyle = currentCanvasTheme.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        totalAngle += CONFIGURATION.ROTATION_SPEED;
        
        // --- PASS 1: Draw all glows first (background layer) ---
        if (CONFIGURATION.GLOW_ENABLED) {
            stars.forEach(s => {
                if (s.isSpecial) {
                    const headAngle = s.theta + totalAngle;
                    const headX = pivotX + s.r * Math.cos(headAngle);
                    const headY = pivotY + s.r * Math.sin(headAngle);
                    const glowRadius = s.size * CONFIGURATION.GLOW_RADIUS_MULTIPLIER;
                    const rgb = hexToRgb(currentCanvasTheme.special);
                    ctx.beginPath();
                    ctx.arc(headX, headY, glowRadius, 0, 2 * Math.PI);
                    ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${CONFIGURATION.GLOW_OPACITY})`;
                    ctx.fill();
                }
            });
        }

        // --- PASS 2: Draw all normal (gray) trails ---
        stars.forEach(s => {
            if (!s.isSpecial) {
                const headAngle = s.theta + totalAngle;
                const tailAngle = headAngle - s.trailLength;
                ctx.beginPath();
                ctx.strokeStyle = currentCanvasTheme.normal;
                ctx.lineWidth = s.size;
                ctx.lineCap = 'round';
                ctx.arc(pivotX, pivotY, s.r, tailAngle, headAngle);
                ctx.stroke();
            }
        });

        // --- PASS 3: Draw all special (blue) trails on top ---
        stars.forEach(s => {
            if (s.isSpecial) {
                const headAngle = s.theta + totalAngle;
                const tailAngle = headAngle - s.trailLength;
                ctx.beginPath();
                ctx.strokeStyle = currentCanvasTheme.special;
                ctx.lineWidth = s.size;
                ctx.lineCap = 'round';
                ctx.arc(pivotX, pivotY, s.r, tailAngle, headAngle);
                ctx.stroke();
            }
        });

        requestAnimationFrame(animate);
    }

    // --- Initialize and Run ---
    setCanvasDimensions();
    initStars(); 
    animate();

    window.addEventListener('resize', () => {
        isThemeTransitioning = false;
        setCanvasDimensions();
        initStars(); 
    });
});