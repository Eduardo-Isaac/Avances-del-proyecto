class ControlsManager {
    constructor(controls) {
        this.controls = controls;
        this.init();
    }

    init() {
        // Loader
        const loader = document.getElementById('loader');
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hide');
                setTimeout(() => loader.style.display = 'none', 500);
            }, 2000);
        });

        // Slider velocidad
        const slider = document.getElementById('speed-slider');
        const value = document.getElementById('speed-value');
        slider.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            this.controls.autoRotateSpeed = speed;
            value.textContent = speed.toFixed(1) + 'x';
        });

        // Toggle modo oscuro
        const toggle = document.getElementById('dark-checkbox');
        const saved = localStorage.getItem('darkMode');
        
        if (saved === 'on') {
            document.body.classList.add('dark-mode');
            toggle.checked = true;
        }

        toggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'on');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'off');
            }
        });
    }
}

export default ControlsManager;