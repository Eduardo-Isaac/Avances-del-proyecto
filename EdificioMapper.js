<<<<<<< Updated upstream
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import PisoManager from './PisoManager.js';
import PantallaCarga from './PantallaCarga.js'; // Importar la nueva clase de pantalla de carga

class SistemaIluminacion { // Maneja la iluminación de la escena
    constructor(scene) { // recibe la escena de Three.js
        this.scene = scene;
        this.configurarLuces(); // configura las luces al inicializar la clase
    }

    configurarLuces() {
        // Luz direccional
        const luzDireccional = new THREE.DirectionalLight(0xFFFFFF); // blanca
        luzDireccional.position.set(1, 8, 3); // posicion de la luz
        this.scene.add(luzDireccional); // agrega la luz a la escena

        // Luz ambiental
        const luzAmbiental = new THREE.AmbientLight(0x404040); // luz suave blanca
        luzAmbiental.intensity = 2.5; // intensidad de la luz ambiental
        this.scene.add(luzAmbiental);
    }
}

class InterfazUsuario {
    constructor(edificioMapper) { // recibe la instancia del edificio
        this.edificioMapper = edificioMapper;
    }

    mostrarInfoHabitacion(habitacion) {
        console.log(`¡Hiciste click en: ${habitacion.nombre}!`); // muestra el nombre de la habitacion perooo no funciona aun JAJAJA
    }
}

class SistemaBusqueda { // Maneja la funcionalidad de búsqueda
    constructor() { // aun no funciona JAJAJAJAJA
    }

    configurarEventos() {
        const inputBusqueda = document.getElementById("search"); // input de busqueda
        if (inputBusqueda) { // verifica que el input exista
            inputBusqueda.addEventListener("input", (event) => this.manejarBusqueda(event));
        }
    }

    manejarBusqueda(event) {  //igual no funciona JAJAJAJAJA , igual solo nos servirá de guia para que lo muestre en la |consola
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
        
        // Instanciar pantalla de carga
        this.pantallaCarga = new PantallaCarga();
        
        this.inicializar();
    }

    inicializar() { // inicializa la escena, camara, renderer, controles y eventos
        // Mostrar pantalla de carga inmediatamente al iniciar
        this.pantallaCarga.mostrar();
        
        // Configurar el resto de componentes después de un breve delay
        // para asegurar que la pantalla de carga se muestre primero
        setTimeout(() => {
            this.configurarRenderer(); 
            this.configurarControles();
            this.configurarEventos();
            this.configurarBotones(); 
            this.iniciarRenderizado();
        }, 100);
    }

    configurarRenderer() {
        // Crear gradiente para el fondo
        this.renderer.setClearColor(0x000000, 0); // Transparente para usar gradiente CSS
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras más suaves
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
                #1e3c72 100%
            )
        `; // se maneja por porcentajes para que no se vea solo literarmente un pedazo de color va de 0 a 100%
        document.body.style.margin = '0'; // Eliminar margenes
        document.body.style.padding = '0';  // Eliminar padding
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

    //Configurar botones
    configurarBotones() {
        const botones = [ // Configuración de botones con sus pisos correspondientes
            { selector: '.botonp1', piso: 'piso1' },
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
                        console.log(`Mostrando: ${config.piso}`); // Confirma en consola , esto lo usamos bastante para verificar que los botones funcionan
                    } else if (config.accion === 'mostrarTodos') {
                        this.pisoManager.mostrarTodosLosPisos();
                        console.log('Mostrando todos los pisos');// Confirma en consola
                    }
                });
                console.log(`Botón configurado: ${config.selector}`);//nos confirma que fue configurado
            } else {
                console.warn(` Botón no encontrado: ${config.selector}`);// Advertencia si el botón no se encuentra
            }
        });
    }

    configurarEventos() {
        window.addEventListener('mousedown', (event) => this.manejarClick(event)); // maneja el click del mouse
        window.addEventListener('resize', () => this.manejarRedimensionado()); // maneja el redimensionado de la ventana
        window.addEventListener("load", () => this.manejarCargaCompleta());// maneja cuando la pagina y todos los recursos han cargado
    }

    manejarClick(event) {
        this.analytics.registrarClick();
        
        // Convertir coordenadas del mouse
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1; 
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; 
        
        // Lanzar raycaster es como un rayo que sale de la camara y va hacia donde apunta el mouse
        this.raycaster.setFromCamera(this.mouse, this.camera); //raycaster es el rayo que lanza la camara
        
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

    //esto maneja cuando se redimensiona la ventana del navegador es decirr cuando se cambia el tamaño de la ventana
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

// Inicializa la aplicación cuando el DOM esté listo y cargar el edificio
window.addEventListener("DOMContentLoaded", () => {
    new EdificioMapper();
});
=======
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import PisoManager from './PisoManager.js';

class SistemaIluminacion { // Maneja la iluminación de la escena
    constructor(scene) { // recibe la escena de Three.js
        this.scene = scene;
        this.configurarLuces(); // configura las luces al inicializar la clase
    }

    configurarLuces() {
        // Luz direccional
        const luzDireccional = new THREE.DirectionalLight(0xFFFFFF); // blanca
        luzDireccional.position.set(1, 8, 3); // posicion de la luz
        this.scene.add(luzDireccional); // agrega la luz a la escena

        // Luz ambiental
        const luzAmbiental = new THREE.AmbientLight(0x404040); // luz suave blanca
        luzAmbiental.intensity = 2.5; // intensidad de la luz ambiental
        this.scene.add(luzAmbiental);
    }
}

class InterfazUsuario {
    constructor(edificioMapper) { // recibe la instancia sdl edificio
        this.edificioMapper = edificioMapper;
    }

    mostrarInfoHabitacion(habitacion) {
        console.log(`¡Hiciste click en: ${habitacion.nombre}!`); // muestra el nombre de la habitacion perooo no funciona aun JAJAJA
    }
}

class SistemaBusqueda { // Maneja la funcionalidad de búsqueda
    constructor() { // aun no funciona JAJAJAJAJA
    }

    configurarEventos() {
        const inputBusqueda = document.getElementById("search"); // input de busqueda
        if (inputBusqueda) { // verifica que el input exista
            inputBusqueda.addEventListener("input", (event) => this.manejarBusqueda(event));
        }
    }

    manejarBusqueda(event) {  //igual no funciona JAJAJAJAJA , igual solo nos servirá de guia para que lo muestre en la |consola
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
        this.configurarBotones(); 
        this.iniciarRenderizado();
    }

    configurarRenderer() {
        // Crear gradiente para el fondo
        this.renderer.setClearColor(0x000000, 0); // Transparente para usar gradiente CSS
        this.renderer.setPixelRatio(window.devicePixelRatio); // para pantallas de alta resolucion
        this.renderer.shadowMap.enabled = true; // Habilitar sombras
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras más suaves
        this.renderer.setSize(window.innerWidth, window.innerHeight);// ajustar tamaño del renderer
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;// Configurar espacio de color
        this.renderer.antialias = true;// Habilitar antialiasing que eso suaviza los bordes
        
        // Crear fondo gradiente con CSS de 5 colores , lo que se ve detras del edificio el fondo
        document.body.style.background = ` 
            linear-gradient(135deg, 
                #1e3c72 0%, 
                #2a5298 25%, 
                #87ceeb 50%, 
                #14a8f8ff 75%, 
                #1e3c72 100%
            )
        `; // se maneja por porcentajes para que no se vea solo literarmente un pedazo de color va de 0 a 100%
        document.body.style.margin = '0'; // Eliminar margenes
        document.body.style.padding = '0';  // Eliminar padding
        document.body.style.overflow = 'hidden'; // Evitar barras de desplazamiento
        
        document.body.appendChild(this.renderer.domElement);
    }

    configurarControles() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement); 
        this.controls.autoRotate = true; // esto orbita la camara
        // this.controls.autoRotateSpeed = document.getElementById("Velocidad"); // esto controla la velocidad de la orbita (el giro pues JAJA)
        this.controls.autoRotateSpeed = 1.0; // esto controla la velocidad de la orbita (el giro pues JAJA)
        this.camera.position.z = 16; // posicion de la camara en el eje z
        this.controls.maxDistance = 40; // distancia maxima que puede alejarse la camara
        this.controls.target.set(-4, 0, 0); // apunta al centro del edificio
        this.controls.update(); // actualizar controles inmediatamente
    }

    //Configurar botones
    configurarBotones() {
        const botones = [ // Configuración de botones con sus pisos correspondientes
            { selector: '.botonp1', piso: 'piso1' },
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
                        console.log(`Mostrando: ${config.piso}`); // Confirma en consola , esto lo usamos bastante para verificar que los botones funcionan
                    } else if (config.accion === 'mostrarTodos') {
                        this.pisoManager.mostrarTodosLosPisos();
                        console.log('Mostrando todos los pisos');// Confirma en consola
                    }
                });
                console.log(`Botón configurado: ${config.selector}`);//nos confirma que fue configurado
            } else {
                console.warn(` Botón no encontrado: ${config.selector}`);// Advertencia si el botón no se encuentra
            }
        });
    }

    configurarEventos() {
        window.addEventListener('mousedown', (event) => this.manejarClick(event)); // maneja el click del mouse
        window.addEventListener('resize', () => this.manejarRedimensionado()); // maneja el redimensionado de la ventana
        window.addEventListener("load", () => this.manejarCargaCompleta());// maneja cuando la pagina y todos los recursos han cargado
    }

    manejarClick(event) {
        this.analytics.registrarClick();
        
        // Convertir coordenadas del mouse
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1; 
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; 
        
        // Lanzar raycaster es como un rayo que sale de la camara y va hacia donde apunta el mouse
        this.raycaster.setFromCamera(this.mouse, this.camera); //raycaster es el rayo que lanza la camara
        
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

    //esto maneja cuando se redimensiona la ventana del navegador es decirr cuando se cambia el tamaño de la ventana
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

// Inicializa la aplicación cuando el DOM esté listo y cargar el edificio
window.addEventListener("DOMContentLoaded", () => {
    new EdificioMapper();
});
>>>>>>> Stashed changes
