class InterfazUsuario {
    constructor(edificioMapper) {
        this.edificioMapper = edificioMapper;
        this.botonesManager = new BotonesManager(edificioMapper.pisoManager);
        this.calificaciones = new SistemaCalificaciones(edificioMapper.analytics);
        
        this.configurarEventos();
    }

    configurarEventos() {
    }

    mostrarInfoHabitacion(habitacion) { // aun no se usa
        console.log(`¡Hiciste click en: ${habitacion.nombre}!`); // muestra en consola el nombre de la habitacion pero aun no lo usamos JAJA
    }
}