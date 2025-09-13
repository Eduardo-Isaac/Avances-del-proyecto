class BotonesManager {
    constructor(pisoManager) {
        this.pisoManager = pisoManager;
        this.configurarBotones();
    }

    configurarBotones() {
        const botones = [ //eduardo aqui estan los botones 
            { selector: '.botonp1', piso: 'piso1' },// asocia cada boton con su piso correspondiente
            { selector: '.botonp2', piso: 'piso2' },
            { selector: '.botonp3', piso: 'piso3' },
            { selector: '.botonp4', piso: 'piso4' },
            { selector: '.botonp5', piso: 'piso5' },
            { selector: '.botonp6', piso: 'piso6' },
            { selector: '.botonp7', piso: 'piso7' },
            { selector: '.botonp8', accion: 'mostrarTodos' }
        ];

        botones.forEach(config => {
            const boton = document.querySelector(config.selector);
            if (boton) {
                boton.addEventListener('click', () => {
                    if (config.piso) {
                        this.pisoManager.mostrarPiso(config.piso);
                    } else if (config.accion === 'mostrarTodos') {
                        this.pisoManager.mostrarTodosLosPisos();
                    }
                });
            }
        });
    }
}