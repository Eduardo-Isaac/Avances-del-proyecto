class ControlsManager {
    constructor(controls) {
        this.controls = controls;
        this.init(); // Inicializa los controles
    }

    init() {
        // Loader
        const loader = document.getElementById('loader'); //loader element
        window.addEventListener('load', () => { // Espera a que la ventana cargue
            setTimeout(() => { // Simula tiempo de carga
                loader.classList.add('hide');
                setTimeout(() => loader.style.display = 'none', 500);
            }, 2000);
        });

        // Slider velocidad
        const slider = document.getElementById('speed-slider');
        const value = document.getElementById('speed-value'); // Muestra el valor de velocidad
        slider.addEventListener('input', (e) => { // Actualiza la velocidad al mover el slider
            const speed = parseFloat(e.target.value);
            this.controls.autoRotateSpeed = speed; // Actualiza la velocidad de rotación automática
            value.textContent = speed.toFixed(1) + 'x';
        });

        // Toggle modo oscuro
        const toggle = document.getElementById('dark-checkbox'); // Checkbox para modo oscuro
        const saved = localStorage.getItem('darkMode'); // Recupera la preferencia guardada
        
        if (saved === 'on') {
            document.body.classList.add('dark-mode'); // Activa el modo oscuro
            toggle.checked = true;
        }

        toggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-mode'); // Activa el modo oscuro
                localStorage.setItem('darkMode', 'on'); // Guarda la preferencia
            } else {
                document.body.classList.remove('dark-mode'); // Desactiva el modo oscuro
                localStorage.setItem('darkMode', 'off'); // Guarda la preferencia
            }
        });
    }
}

export default ControlsManager; // Necesario para importar la clase en otros módulos