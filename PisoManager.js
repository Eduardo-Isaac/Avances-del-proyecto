import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import HabitacionDetector from './HabitacionDetector.js';

// Clase individual para cada piso
class Piso {
    constructor(config, scene, habitacionDetectorGlobal) {
        this.nombre = config.nombre;
        this.archivo = config.archivo;
        this.color = config.color;
        this.posicionInicial = config.posicionInicial;
        this.scene = scene;
        this.modelo = null;
        this.habitacionDetectorGlobal = habitacionDetectorGlobal;
        this.cargado = false;
        
        this.cargarModelo();
    }

    cargarModelo() {
        const loader = new GLTFLoader();
        loader.load(this.archivo, (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.material.side = THREE.DoubleSide;
                    if (this.color && child.material.color) {
                        child.material.color.set(this.color);
                    }
                }
            });
            
            this.modelo = gltf.scene;
            this.scene.add(gltf.scene);
            this.cargado = true;
            console.log(`Piso ${this.nombre} cargado correctamente`);
        }, undefined, (error) => {
            console.error(`Error cargando ${this.nombre}:`, error);
        });
    }

    mostrar() {
        if (this.modelo) {
            this.modelo.position.set(
                this.posicionInicial.x,
                this.posicionInicial.y,
                this.posicionInicial.z
            );
        }
    }

    ocultar() {
        if (this.modelo) {
            this.modelo.position.set(0, 0, 100000);
        }
    }

    posicionar(x, y, z) {
        if (this.modelo) {
            this.modelo.position.set(x, y, z);
        }
    }

    estaListo() {
        return this.cargado && this.modelo;
    }

    detectarHabitacion(interseccion) {
        return this.habitacionDetectorGlobal.detectar(interseccion, this.nombre);
    }
}

// Clase para manejar todos los pisos del edificio
class PisoManager {
    constructor(scene) {
        this.scene = scene;
        this.pisos = new Map();
        this.pisoActivo = null;
        this.inicializado = false;
        
        // Crear UN SOLO detector de habitaciones para todo el edificio
        this.habitacionDetector = new HabitacionDetector();
        
        this.cargarPisos();
    }

    cargarPisos() {
        const configPisos = [
            { nombre: 'piso1', archivo: 'piso1.glb', color: '#0080ff', posicionInicial: { x: 0, y: 0.48, z: 1.25 } },
            { nombre: 'piso2', archivo: 'piso2.glb', color: '#1fe200', posicionInicial: { x: 0, y: 0.25, z: 0 } },
            { nombre: 'piso3', archivo: 'piso3.glb', color: null, posicionInicial: { x: 0, y: 0, z: 0 } },
            { nombre: 'piso4', archivo: 'piso4.glb', color: '#ff6c00', posicionInicial: { x: 0, y: 0, z: 0 } },
            { nombre: 'piso5', archivo: 'piso5.glb', color: '#fff700', posicionInicial: { x: 0, y: 0, z: 0 } },
            { nombre: 'piso6', archivo: 'piso6.glb', color: null, posicionInicial: { x: 0, y: 0, z: 0 } },
            { nombre: 'piso7', archivo: 'piso7.glb', color: null, posicionInicial: { x: 0, y: 0, z: 0 } },
            { nombre: 'pisot', archivo: 'pisot.glb', color: null, posicionInicial: { x: 0, y: 0.07, z: 0 } }
        ];

        configPisos.forEach(config => {
            const piso = new Piso(config, this.scene, this.habitacionDetector);
            this.pisos.set(config.nombre, piso);
        });
    }

    mostrarPiso(nombrePiso) {
        // Ocultar todos los pisos
        this.pisos.forEach(piso => piso.ocultar());
        
        // Mostrar el piso seleccionado
        const piso = this.pisos.get(nombrePiso);
        if (piso) {
            piso.mostrar();
            this.pisoActivo = piso;
            console.log(`Mostrando: ${nombrePiso}`);
        }
    }

    mostrarTodosLosPisos() {
        this.pisos.forEach(piso => piso.mostrar());
        this.pisoActivo = this.pisos.get('piso1');
        console.log('Mostrando todos los pisos');
    }

    obtenerPisoActivo() {
        return this.pisoActivo;
    }

    actualizar() {
        // Lógica de actualización inicial
        if (!this.inicializado && 
            this.pisos.get('piso1')?.estaListo() && 
            this.pisos.get('piso2')?.estaListo() && 
            this.pisos.get('pisot')?.estaListo()) {
            
            this.pisos.get('piso1').posicionar(0, 0.48, 1.25);
            this.pisos.get('pisot').posicionar(0, 0.07, 0);
            this.pisos.get('piso2').posicionar(0, 0.25, 0);
            this.inicializado = true;
            console.log('Pisos inicializados correctamente');
        }
    }
}

export default PisoManager;