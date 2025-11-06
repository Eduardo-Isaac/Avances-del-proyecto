class BotonesManager {
    constructor(pisoManager) {
        this.pisoManager = pisoManager; // referencia al gestor de pisos
        this.configurarBotones(); // inicializa la configuración de los botones
    }

    configurarBotones() {
        const botones = [
            { selector: '.botonp1', piso: 'piso1' },// asocia cada boton con su piso correspondiente
            { selector: '.botonp2', piso: 'piso2' },
            { selector: '.botonp3', piso: 'piso3' },
            { selector: '.botonp4', piso: 'piso4' },
            { selector: '.botonp5', piso: 'piso5' },
            { selector: '.botonp6', piso: 'piso6' },
            { selector: '.botonp7', piso: 'piso7' },
            { selector: '.botonp8', accion: 'mostrarTodos' }
        ];

        botones.forEach(config => { // itera sobre cada configuración de botón
            const boton = document.querySelector(config.selector); // selecciona el botón en el DOM
            if (boton) {
                boton.addEventListener('click', () => { // agrega el evento click
                    if (config.piso) {
                        this.pisoManager.mostrarPiso(config.piso); // muestra el piso correspondiente
                    } else if (config.accion === 'mostrarTodos') {
                        this.pisoManager.mostrarTodosLosPisos(); // muestra todos los pisos
                    }
                });
            }
        });
    }
}

// IMPORTANTE: Agregar esta línea para exportar la clase a otros módulos
export default BotonesManager;