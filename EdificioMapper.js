import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import PisoManager from './PisoManager.js';

class SistemaIluminacion {
    constructor(scene) {
        this.scene = scene;
        this.configurarLuces();
    }

    configurarLuces() {
        // Luz direccional
        const luzDireccional = new THREE.DirectionalLight(0xFFFFFF); // blanca
        luzDireccional.position.set(1, 8, 3); // posicion de la luz
        this.scene.add(luzDireccional); // agrega la luz a la escena

        // Luz ambiental
        const luzAmbiental = new THREE.AmbientLight(0x404040);
        luzAmbiental.intensity = 2.5;
        this.scene.add(luzAmbiental);
    }
}
class InterfazUsuario {
    constructor(edificioMapper) {
        this.edificioMapper = edificioMapper;
        // Comentamos esto por ahora para evitar mÃ¡s errores
        // this.botonesManager = new BotonesManager(edificioMapper.pisoManager);
    }

    mostrarInfoHabitacion(habitacion) {
        console.log(`Â¡Hiciste click en: ${habitacion.nombre}!`);
    }
}
class SistemaBusqueda {
    constructor() {
        // Comentamos por ahora para evitar mÃ¡s errores
        // this.configurarEventos();
    }

    configurarEventos() {
        const inputBusqueda = document.getElementById("search");
        if (inputBusqueda) {
            inputBusqueda.addEventListener("input", (event) => this.manejarBusqueda(event));
        }
    }

    manejarBusqueda(event) { 
        console.log('Buscando:', event.target.value);
    }
}

class SistemaAnalytics { 
    constructor() {
        this.clicks = 0; //inicia el contador de clicks en 0
    }

    registrarClick() { // cada vez que se hace click en el edificio lo registra en consola
        this.clicks++;
        console.log('Click registrado'); // registra el click en la consola
    }
}

class EdificioMapper { // Clase principal que orquesta todo
    constructor() {
        this.scene = new THREE.Scene();// crea la escena 3D
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000); // camara perspectiva
        this.renderer = new THREE.WebGLRenderer({ antialias: true });// renderizador con antialiasing
        this.controls = null;
        this.raycaster = new THREE.Raycaster();// para detectar intersecciones con el mouse
        this.mouse = new THREE.Vector2();
        
        // Instanciar las clases especializadas
        
        this.pisoManager = new PisoManager(this.scene);
        this.iluminacion = new SistemaIluminacion(this.scene);
        this.interfazUsuario = new InterfazUsuario(this);
        this.busqueda = new SistemaBusqueda();
        this.analytics = new SistemaAnalytics();
        
        this.inicializar();
    }

    inicializar() { // inicializa la escena, camara, renderer, controles y eventos
        this.configurarRenderer(); 
        this.configurarControles();
        this.configurarEventos();
        this.iniciarRenderizado();
    }

configurarRenderer() {
    // Crear gradiente para el fondo
    this.renderer.setClearColor(0x000000, 0); // Transparente para usar gradiente CSS
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras mÃ¡s suaves
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.antialias = true;
    
    // Crear fondo gradiente con CSS de 5 colores , lo que se ve detras del edificio el fondo
    document.body.style.background = `
        linear-gradient(135deg, 
            #1e3c72 0%, 
            #2a5298 25%, 
            #87ceeb 50%, 
            #14a8f8ff 75%, 
            #070707ff 100%
        )
    `;
    document.body.style.margin = '0'; // Eliminar margenes
    document.body.style.padding = '0'; 
    document.body.style.overflow = 'hidden'; // Evitar barras de desplazamiento
    
    document.body.appendChild(this.renderer.domElement);
}

    configurarControles() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.autoRotate = true; // esto orbita la camara
        this.controls.autoRotateSpeed = 1.0; // esto controla la velocidad de la orbita (el giro pues JAJA)
        this.camera.position.z = 16; // posicion de la camara en el eje z
        this.controls.maxDistance = 40; // distancia maxima que puede alejarse la camara
        this.controls.target.set(-4, 0, 0); // apunta al centro del edificio
        this.controls.update(); // actualizar controles inmediatamente
    }

    configurarEventos() {
        window.addEventListener('mousedown', (event) => this.manejarClick(event));
        window.addEventListener('resize', () => this.manejarRedimensionado());
        window.addEventListener("load", () => this.manejarCargaCompleta());
    }

    manejarClick(event) {
        this.analytics.registrarClick();
        
        // Convertir coordenadas del mouse
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1; 
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; 
        
        // Lanzar raycaster es como un rayo que sale de la camara y va hacia donde apunta el mouse
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Detectar intersecciones
        const pisoActivo = this.pisoManager.obtenerPisoActivo();
        if (pisoActivo) {
            const intersects = this.raycaster.intersectObject(pisoActivo.modelo, true); 
            if (intersects.length > 0) {
                const habitacion = pisoActivo.detectarHabitacion(intersects[0]);
                if (habitacion) {
                    this.interfazUsuario.mostrarInfoHabitacion(habitacion);
                }
            }
        }
    }
    //esto maneja cuando se redimensiona la ventana del navegador es decirr cuando se cambia el tamaÃ±o de la ventana
    manejarRedimensionado() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    manejarCargaCompleta() { // cuando la pagina y todos los recursos han cargado
        setTimeout(() => {
            const bienvenida = document.getElementById("bienvenida");
            const contenido = document.getElementById("contenido");
            
            if (bienvenida) bienvenida.style.display = "none";
            if (contenido) contenido.style.display = "block";
        }, 3000);
    }

    iniciarRenderizado() { // esto inicia el ciclo de renderizado
        const render = () => {
            requestAnimationFrame(render);
            this.pisoManager.actualizar();
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        render();
    }
}

// Inicializa la aplicaciÃ³n cuando el DOM estÃ© listo y cargar el edificio
window.addEventListener("DOMContentLoaded", () => {
    new EdificioMapper();
});