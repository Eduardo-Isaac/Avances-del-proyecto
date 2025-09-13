class BotonPiso {
    constructor(config, pisoManager) {
        this.config = config;
        this.pisoManager = pisoManager;
        this.elemento = document.querySelector(config.selector);
        
        if (this.elemento) {
            this.elemento.addEventListener('click', () => this.manejarClick()); // asocia el click al boton
        }
    }

    manejarClick() { // Maneja el evento de click
        if (this.config.piso) {
            this.pisoManager.mostrarPiso(this.config.piso); // Llama al mÃ©todo para mostrar el piso correspondiente
        } else if (this.config.accion === 'mostrarTodos') {
            this.pisoManager.mostrarTodosLosPisos(); // Llama al mÃ©todo para mostrar todos los pisos
        }
    }
}