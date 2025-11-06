// Clase para detectar habitaciones en los pisos
class HabitacionDetector {
    constructor() {
        // Base de datos completa de habitaciones con toda su información
        this.habitaciones = {
            piso1: [
                { 
                    nombre: 'CIT-101', 
                    nombreCompleto: 'Salón CIT-101',
                    tipo: 'Aula',
                    capacidad: 30,
                    equipamiento: ['Proyector', 'Pizarra', 'Aire acondicionado'],
                    minX: -8, maxX: -5, minZ: -3, maxZ: 0,
                    posicionCamara: { x: -6.5, y: 2, z: 3 }
                    
                },
                { 
                    nombre: 'CIT-102', 
                    nombreCompleto: 'Salón CIT-102',
                    tipo: 'Aula',
                    capacidad: 35,
                    equipamiento: ['Proyector', 'Pizarra', 'Aire acondicionado'],
                    minX: -5, maxX: -2, minZ: -3, maxZ: 0,
                    posicionCamara: { x: -3.5, y: 2, z: 3 }
                },
                { 
                    nombre: 'CIT-103', 
                    nombreCompleto: 'Salón CIT-103',
                    tipo: 'Aula',
                    capacidad: 35,
                    equipamiento: ['Proyector', 'Pizarra', 'Aire acondicionado'],
                    minX: -2, maxX: 1, minZ: -3, maxZ: 0,
                    posicionCamara: { x: -0.5, y: 2, z: 3 }
                },
                { 
                    nombre: 'CIT-104', 
                    nombreCompleto: 'Salón CIT-104',
                    tipo: 'Aula',
                    capacidad: 30,
                    equipamiento: ['Proyector', 'Pizarra', 'Aire acondicionado'],
                    minX: 1, maxX: 4, minZ: -3, maxZ: 0,
                    posicionCamara: { x: 2.5, y: 2, z: 3 }
                }
            ],
            piso2: [
                { 
                    nombre: 'CIT-201', 
                    nombreCompleto: 'Laboratorio CIT-201',
                    tipo: 'Laboratorio',
                    capacidad: 25,
                    equipamiento: ['Computadoras', 'Proyector', 'Aire acondicionado'],
                    minX: -8, maxX: -5, minZ: -3, maxZ: 0,
                    posicionCamara: { x: -6.5, y: 2, z: 3 }
                },
                { 
                    nombre: 'CIT-202', 
                    nombreCompleto: 'Laboratorio CIT-202',
                    tipo: 'Laboratorio',
                    capacidad: 25,
                    equipamiento: ['Computadoras', 'Proyector', 'Aire acondicionado'],
                    minX: -5, maxX: -2, minZ: -3, maxZ: 0,
                    posicionCamara: { x: -3.5, y: 2, z: 3 }
                }
            ],
            piso3: [
                { 
                    nombre: 'CIT-301', 
                    nombreCompleto: 'Aula CIT-301',
                    tipo: 'Aula',
                    capacidad: 40,
                    equipamiento: ['Proyector', 'Pizarra', 'Sistema de audio'],
                    minX: -8, maxX: -5, minZ: -3, maxZ: 0,
                    posicionCamara: { x: -6.5, y: 2, z: 3 }
                }
            ],
            piso4: [
                { 
                    nombre: 'CIT-401', 
                    nombreCompleto: 'Sala de Conferencias',
                    tipo: 'Sala de Conferencias',
                    capacidad: 50,
                    equipamiento: ['Proyector', 'Sistema de audio', 'Video conferencia'],
                    minX: -8, maxX: -5, minZ: -3, maxZ: 0,
                    posicionCamara: { x: -6.5, y: 2, z: 3 }
                }
            ],
            piso5: [],
            piso6: [],
            piso7: []
        };
    }

    // Detectar habitación por intersección (click en el modelo 3D)
    detectar(interseccion, nombrePiso) {
        if (!interseccion || !interseccion.point) {
            return null;
        }

        const punto = interseccion.point; 
        const objeto = interseccion.object;
        
        // Intentar detectar por nombre del objeto primero
        if (objeto.name && objeto.name.length > 0) {
            const habitacionPorNombre = this.buscarPorNombre(objeto.name, nombrePiso);
            if (habitacionPorNombre) {
                return this.crearInfoHabitacion(habitacionPorNombre, punto, objeto);
            }
        }

        // Detectar por coordenadas si no tiene nombre
        const habitacionDetectada = this.detectarPorCoordenadas(punto, nombrePiso);
        if (habitacionDetectada) {
            return this.crearInfoHabitacion(habitacionDetectada, punto, objeto);
        }

        // Habitación genérica si no se puede detectar específicamente
        return {
            nombre: `Área en (${punto.x.toFixed(2)}, ${punto.z.toFixed(2)})`,
            nombreCompleto: 'Área no identificada',
            tipo: 'Desconocido',
            posicion: punto,
            objeto: objeto,
            tipoDeteccion: 'generica'
        };
    }

    // Detectar habitación por coordenadas del punto de intersección
    detectarPorCoordenadas(punto, nombrePiso) {
        const habitacionesPiso = this.habitaciones[nombrePiso] || [];
        
        for (const habitacion of habitacionesPiso) {
            if (punto.x >= habitacion.minX && punto.x <= habitacion.maxX &&
                punto.z >= habitacion.minZ && punto.z <= habitacion.maxZ) {
                return habitacion;
            }
        }
        
        return null;
    }

    // Buscar habitación por nombre exacto o parcial
    buscarPorNombre(consulta, pisoEspecifico = null) {
        const consultaNormalizada = consulta.toLowerCase().trim();
        
        // Definir en qué pisos buscar
        const pisosABuscar = pisoEspecifico 
            ? [pisoEspecifico] 
            : Object.keys(this.habitaciones);
        
        // Buscar en los pisos especificados
        for (const piso of pisosABuscar) {
            const habitacionesPiso = this.habitaciones[piso] || [];
            
            for (const habitacion of habitacionesPiso) {
                // Coincidencia exacta
                if (habitacion.nombre.toLowerCase() === consultaNormalizada) {
                    return { ...habitacion, pisoEncontrado: piso };
                }
                
                // Coincidencia parcial
                if (habitacion.nombre.toLowerCase().includes(consultaNormalizada) ||
                    habitacion.nombreCompleto.toLowerCase().includes(consultaNormalizada)) {
                    return { ...habitacion, pisoEncontrado: piso };
                }
            }
        }
        
        return null;
    }

    // Buscar múltiples habitaciones (para autocompletado)
    buscarMultiples(consulta) {
        if (!consulta || consulta.length < 2) return [];
        
        const consultaNormalizada = consulta.toLowerCase().trim();
        const resultados = [];
        
        Object.keys(this.habitaciones).forEach(piso => {
            this.habitaciones[piso].forEach(habitacion => {
                if (habitacion.nombre.toLowerCase().includes(consultaNormalizada) ||
                    habitacion.nombreCompleto.toLowerCase().includes(consultaNormalizada)) {
                    resultados.push({ ...habitacion, pisoEncontrado: piso });
                }
            });
        });
        
        return resultados.slice(0, 5); // Limitar a 5 resultados
    }

    // Crear objeto completo de información de habitación
    crearInfoHabitacion(habitacion, punto, objeto) {
        return {
            nombre: habitacion.nombre,
            nombreCompleto: habitacion.nombreCompleto,
            tipo: habitacion.tipo,
            capacidad: habitacion.capacidad,
            equipamiento: habitacion.equipamiento,
            posicion: punto,
            posicionCamara: habitacion.posicionCamara,
            objeto: objeto,
            pisoEncontrado: habitacion.pisoEncontrado,
            tipoDeteccion: 'exitosa'
        };
    }

    // Agregar nuevas habitaciones dinámicamente
    agregarHabitacion(piso, habitacion) {
        if (!this.habitaciones[piso]) {
            this.habitaciones[piso] = [];
        }
        this.habitaciones[piso].push(habitacion);
    }

    // Obtener todas las habitaciones de un piso
    obtenerHabitacionesPiso(piso) {
        return this.habitaciones[piso] || [];
    }

    // Obtener todas las habitaciones de todos los pisos
    obtenerTodasLasHabitaciones() {
        const todas = [];
        Object.keys(this.habitaciones).forEach(piso => {
            this.habitaciones[piso].forEach(hab => {
                todas.push({ ...hab, piso: piso });
            });
        });
        return todas;
    }
}

export default HabitacionDetector;