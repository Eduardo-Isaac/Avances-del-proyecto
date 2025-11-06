<<<<<<< Updated upstream
import * as THREE from "three";// libreria principal de three.js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"; // cargador de modelos glTF
import HabitacionDetector from './HabitacionDetector.js'; 

// Clase individual para cada piso
class Piso {
    constructor(config, scene) {
        this.nombre = config.nombre;
        this.archivo = config.archivo;
        this.color = config.color;
        this.posicionInicial = config.posicionInicial;
        this.scene = scene;
        this.modelo = null;
        this.habitaciones = new HabitacionDetector();
        this.cargado = false; 
        
        this.cargarModelo();
    }

    cargarModelo() { // carga el modelo 3D del piso
        const loader = new GLTFLoader();
        loader.load(this.archivo, (gltf) => { 
            gltf.scene.traverse((child) => { 
                if (child.isMesh) {
                    child.material.side = THREE.DoubleSide; // hace que las caras sean visibles desde ambos lados
                    if (this.color && child.material.color) {  // material con color
                        child.material.color.set(this.color);// aplica el color si se especifica
                    }
                }
            });
            
            this.modelo = gltf.scene; // guarda el modelo cargado
            this.scene.add(gltf.scene); // agrega el modelo a la escena
            this.cargado = true; // marca el piso como cargado
            console.log(`Piso ${this.nombre} cargado correctamente`); // confirma que el piso se cargo para verlo en consola (f12 en el navegador)
        }, undefined, (error) => {
            console.error(`Error cargando ${this.nombre}:`, error); // maneja errores de carga y lo notifica en consola (f12 en el navegador)
        });
    }

    mostrar() {
        if (this.modelo) {
            this.modelo.position.set(
                this.posicionInicial.x, // posicion inicial en x
                this.posicionInicial.y, // posicion inicial en y
                this.posicionInicial.z // posicion inicial en z
            );
        }
    }

    ocultar() {
        if (this.modelo) {
            this.modelo.position.set(0, 0, 100000); // mueve el piso fuera de la vista para ocultarlo
        }
    }

    posicionar(x, y, z) {
        if (this.modelo) {
            this.modelo.position.set(x, y, z); // posiciona el piso en coordenadas especificas
        }
    }

    estaListo() {
        return this.cargado && this.modelo; // verifica si el piso esta cargado y listo
    }

    detectarHabitacion(interseccion) {
        return this.habitaciones.detectar(interseccion); // usa HabitacionDetector para detectar habitaciones
    }
}

// Clase para manejar todos los pisos del edificio
class PisoManager {
    constructor(scene) {
        this.scene = scene;
        this.pisos = new Map();
        this.pisoActivo = null;
        this.inicializado = false;
        this.cargarPisos();
    }

    cargarPisos() {
        const configPisos = [ // configuracion de los pisos
            { nombre: 'piso1', archivo: 'piso1.glb', color: '#0080ff', posicionInicial: { x: 0, y: 0.48, z: 1.25 } }, // piso 1 es azul
            { nombre: 'piso2', archivo: 'piso2.glb', color: '#1fe200', posicionInicial: { x: 0, y: 0.25, z: 0 } }, // piso 2 es verde
            { nombre: 'piso3', archivo: 'piso3.glb', color: null, posicionInicial: { x: 0, y: 0, z: 0 } }, // piso 3 sin color
            { nombre: 'piso4', archivo: 'piso4.glb', color: '#ff6c00', posicionInicial: { x: 0, y: 0, z: 0 } }, // piso 4 es naranja
            { nombre: 'piso5', archivo: 'piso5.glb', color: '#fff700', posicionInicial: { x: 0, y: 0, z: 0 } }, // piso 5 es amarillo
            { nombre: 'piso6', archivo: 'piso6.glb', color: null, posicionInicial: { x: 0, y: 0, z: 0 } }, // piso 6 sin color
            { nombre: 'piso7', archivo: 'piso7.glb', color: null, posicionInicial: { x: 0, y: 0, z: 0 } }, // piso 7 sin color
            { nombre: 'pisot', archivo: 'pisot.glb', color: null, posicionInicial: { x: 0, y: 0.07, z: 0 } } // pisot sin color
        ];

        configPisos.forEach(config => { // crear y cargar cada piso
            const piso = new Piso(config, this.scene); // crear instancia del piso y cargar el modelo
            this.pisos.set(config.nombre, piso); // almacenar en el mapa de pisos
        }); // aguas con quitar esto que ya no cargan los pisos JAJAJAJA 
    }

    // NUEVA FUNCIÓN: Mostrar un piso específico y ocultar los demás
    mostrarPiso(nombrePiso) {
        console.log(`Mostrando piso: ${nombrePiso}`);
        
        // Ocultar TODOS los pisos (incluyendo pisot)
        this.pisos.forEach(piso => piso.ocultar());
        
        // Mostrar SOLO el piso seleccionado
        const piso = this.pisos.get(nombrePiso);
        if (piso && piso.estaListo()) {
            piso.mostrar();
            this.pisoActivo = piso; // establecer como piso activo
            console.log(`✅ Piso ${nombrePiso} visible`);
        } else {
            console.warn(`Piso ${nombrePiso} no encontrado o no está listo`);
        }
    }

    // NUEVA FUNCIÓN: Mostrar todos los pisos a la vez
    mostrarTodosLosPisos() {
        console.log('Mostrando todos los pisos');
        
        // Mostrar todos los pisos en sus posiciones iniciales
        this.pisos.forEach((piso, nombre) => {
            if (piso.estaListo()) {
                piso.mostrar();
                console.log(`${nombre} visible`);
            }
        });
        
        // Establecer piso1 como piso activo para detectar clicks
        this.pisoActivo = this.pisos.get('piso1');
    }
    
    obtenerPisoActivo() { // devuelve el piso activo
        return this.pisoActivo;
    } // tambien sirve para detectar clicks si quitan esto falla cada vez que se da click asi que aguas

    actualizar() {
        // Logica de actualizacion inicial es decir posicionar los pisos en su lugar
        if (!this.inicializado && this.pisos.get('piso1')?.estaListo() && this.pisos.get('piso2')?.estaListo() && this.pisos.get('pisot')?.estaListo()) {
            this.pisos.get('piso1').posicionar(0, 0.48, 1.25);
            this.pisos.get('pisot').posicionar(0, 0.07, 0);
            this.pisos.get('piso2').posicionar(0, 0.25, 0);
            
            // Mostrar todos los pisos al inicio
            this.mostrarTodosLosPisos();
            
            this.inicializado = true;
            console.log('todos los pisos visibles');
        }
    }
}

=======
import * as THREE from "three";// libreria principal de three.js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"; // cargador de modelos glTF
import HabitacionDetector from './HabitacionDetector.js'; 

// Clase individual para cada piso
class Piso {
    constructor(config, scene) {
        this.nombre = config.nombre;
        this.archivo = config.archivo;
        this.color = config.color;
        this.posicionInicial = config.posicionInicial;
        this.scene = scene;
        this.modelo = null;
        this.habitaciones = new HabitacionDetector();
        this.cargado = false; 
        
        this.cargarModelo();
    }

    cargarModelo() { // carga el modelo 3D del piso
        const loader = new GLTFLoader();
        loader.load(this.archivo, (gltf) => { 
            gltf.scene.traverse((child) => { 
                if (child.isMesh) {
                    child.material.side = THREE.DoubleSide; // hace que las caras sean visibles desde ambos lados
                    if (this.color && child.material.color) {  // material con color
                        child.material.color.set(this.color);// aplica el color si se especifica
                    }
                }
            });
            
            this.modelo = gltf.scene; // guarda el modelo cargado
            this.scene.add(gltf.scene); // agrega el modelo a la escena
            this.cargado = true; // marca el piso como cargado
            console.log(`Piso ${this.nombre} cargado correctamente`); // confirma que el piso se cargo para verlo en consola (f12 en el navegador)
        }, undefined, (error) => {
            console.error(`Error cargando ${this.nombre}:`, error); // maneja errores de carga y lo notifica en consola (f12 en el navegador)
        });
    }

    mostrar() {
        if (this.modelo) {
            this.modelo.position.set(
                this.posicionInicial.x, // posicion inicial en x
                this.posicionInicial.y, // posicion inicial en y
                this.posicionInicial.z // posicion inicial en z
            );
        }
    }

    ocultar() {
        if (this.modelo) {
            this.modelo.position.set(0, 0, 100000); // mueve el piso fuera de la vista para ocultarlo
        }
    }

    posicionar(x, y, z) {
        if (this.modelo) {
            this.modelo.position.set(x, y, z); // posiciona el piso en coordenadas especificas
        }
    }

    estaListo() {
        return this.cargado && this.modelo; // verifica si el piso esta cargado y listo
    }

    detectarHabitacion(interseccion) {
        return this.habitaciones.detectar(interseccion); // usa HabitacionDetector para detectar habitaciones
    }
}

// Clase para manejar todos los pisos del edificio
class PisoManager {
    constructor(scene) {
        this.scene = scene;
        this.pisos = new Map();
        this.pisoActivo = null;
        this.inicializado = false;
        this.cargarPisos();
    }

    cargarPisos() {
        const configPisos = [ // configuracion de los pisos
            { nombre: 'piso1', archivo: 'piso1.glb', color: '#0080ff', posicionInicial: { x: 0, y: 0.48, z: 1.25 } }, // piso 1 es azul
            { nombre: 'piso2', archivo: 'piso2.glb', color: '#1fe200', posicionInicial: { x: 0, y: 0.25, z: 0 } }, // piso 2 es verde
            { nombre: 'piso3', archivo: 'piso3.glb', color: null, posicionInicial: { x: 0, y: 0, z: 0 } }, // piso 3 sin color
            { nombre: 'piso4', archivo: 'piso4.glb', color: '#ff6c00', posicionInicial: { x: 0, y: 0, z: 0 } }, // piso 4 es naranja
            { nombre: 'piso5', archivo: 'piso5.glb', color: '#fff700', posicionInicial: { x: 0, y: 0, z: 0 } }, // piso 5 es amarillo
            { nombre: 'piso6', archivo: 'piso6.glb', color: null, posicionInicial: { x: 0, y: 0, z: 0 } }, // piso 6 sin color
            { nombre: 'piso7', archivo: 'piso7.glb', color: null, posicionInicial: { x: 0, y: 0, z: 0 } }, // piso 7 sin color
            { nombre: 'pisot', archivo: 'pisot.glb', color: null, posicionInicial: { x: 0, y: 0.07, z: 0 } } // pisot sin color
        ];

        configPisos.forEach(config => { // crear y cargar cada piso
            const piso = new Piso(config, this.scene); // crear instancia del piso y cargar el modelo
            this.pisos.set(config.nombre, piso); // almacenar en el mapa de pisos
        }); // aguas con quitar esto que ya no cargan los pisos JAJAJAJA 
    }

    // NUEVA FUNCIÓN: Mostrar un piso específico y ocultar los demás
    mostrarPiso(nombrePiso) {
        console.log(`Mostrando piso: ${nombrePiso}`);
        
        // Ocultar TODOS los pisos (incluyendo pisot)
        this.pisos.forEach(piso => piso.ocultar());
        
        // Mostrar SOLO el piso seleccionado
        const piso = this.pisos.get(nombrePiso);
        if (piso && piso.estaListo()) {
            piso.mostrar();
            this.pisoActivo = piso; // establecer como piso activo
            console.log(`✅ Piso ${nombrePiso} visible`);
        } else {
            console.warn(`Piso ${nombrePiso} no encontrado o no está listo`);
        }
    }

    // NUEVA FUNCIÓN: Mostrar todos los pisos a la vez
    mostrarTodosLosPisos() {
        console.log('Mostrando todos los pisos');
        
        // Mostrar todos los pisos en sus posiciones iniciales
        this.pisos.forEach((piso, nombre) => {
            if (piso.estaListo()) {
                piso.mostrar();
                console.log(`${nombre} visible`);
            }
        });
        
        // Establecer piso1 como piso activo para detectar clicks
        this.pisoActivo = this.pisos.get('piso1');
    }
    
    obtenerPisoActivo() { // devuelve el piso activo
        return this.pisoActivo;
    } // tambien sirve para detectar clicks si quitan esto falla cada vez que se da click asi que aguas

    actualizar() {
        // Logica de actualizacion inicial es decir posicionar los pisos en su lugar
        if (!this.inicializado && this.pisos.get('piso1')?.estaListo() && this.pisos.get('piso2')?.estaListo() && this.pisos.get('pisot')?.estaListo()) {
            this.pisos.get('piso1').posicionar(0, 0.48, 1.25);
            this.pisos.get('pisot').posicionar(0, 0.07, 0);
            this.pisos.get('piso2').posicionar(0, 0.25, 0);
            
            // Mostrar todos los pisos al inicio
            this.mostrarTodosLosPisos();
            
            this.inicializado = true;
            console.log('todos los pisos visibles');
        }
    }
}

>>>>>>> Stashed changes
export default PisoManager;