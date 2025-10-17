class BotonesManager {
    constructor(pisoManager) { //recibe una instancia de PisoManager para controlar la visibilidad de los pisos
        this.pisoManager = pisoManager; // almacena la referencia al PisoManager
        console.log('BotonesManager inicializado'); // mensaje de confirmacion en la consola
        this.configurarBotones();// llama al metodo para configurar los botones
    }

    configurarBotones() {
        const botones = [ // configuracion de botones con sus pisos correspondientes
            { selector: '.botonp1', piso: 'piso1' }, // asocia cada boton con su piso correspondiente
            { selector: '.botonp2', piso: 'piso2' }, 
            { selector: '.botonp3', piso: 'piso3' },
            { selector: '.botonp4', piso: 'piso4' },
            { selector: '.botonp5', piso: 'piso5' },
            { selector: '.botonp6', piso: 'piso6' },
            { selector: '.botonp7', piso: 'piso7' },
            { selector: '.botonp8', accion: 'mostrarTodos' } // boton especial para mostrar todos los pisos
        ];

        let botonesConfigurados = 0; // contador para llevar registro de los botones configurados
        
        botones.forEach(config => {
            const boton = document.querySelector(config.selector);
            if (boton) {
                boton.addEventListener('click', () => { //advenlistener es un metodo que espera a que se haga click en el boton
                    if (config.piso) {
                        // Mostrar piso específico
                        this.pisoManager.mostrarPiso(config.piso); // Llama al método para mostrar el piso correspondiente
                        console.log(`Boton presionado: ${config.selector} - Mostrando ${config.piso}`); //esto se muestra en la consola, nos sirve para verificar que el boton funciona JSKLJAS
                    } else if (config.accion === 'mostrarTodos') {
                        // Mostrar todos los pisos
                        this.pisoManager.mostrarTodosLosPisos();
                        console.log('Boton presionado: Mostrar todos los pisos'); //como lo mencione antes muestra en la consola ese mensaje
                    }
                });
                botonesConfigurados++; //botones configurados se incrementa en 1 porque se ha configurado un boton
                console.log(`Boton configurado: ${config.selector}`); // Confirmación de que el botón fue configurado
            }
        });
    }
}

//Exportar la clase para que pueda ser usada en otros archivos
export default BotonesManager;