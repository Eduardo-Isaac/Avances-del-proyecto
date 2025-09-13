// Clase para detectar habitaciones en los pisos aun no se usa
class HabitacionDetector {
    constructor() {
        // Base de datos de habitaciones por posicion 
        this.habitaciones = {
            piso1: [
                { nombre: 'Aula 101', minX: -5, maxX: -2, minZ: -2, maxZ: 0 }, // ejemplo de habitacion en piso 1 asi pueden agregar mas
            ],
            piso2: [ // ejemplo de habitacion en piso 2 pero sin habitaciones jaja 
            ]
            // hola mucha , aqui pueden agregar mas pisos y habitaciones pero para otra entrega
        };
    }
}
export default HabitacionDetector;