// Clase individual para cada piso
class Piso {
    constructor(config, scene) { // recibe la configuracion del piso y la escena de Three.js
        this.nombre = config.nombre; // nombre del piso
        this.archivo = config.archivo; 
        this.color = config.color;
        this.posicionInicial = config.posicionInicial;
        this.scene = scene;
        this.modelo = null;
        this.habitaciones = new HabitacionDetector();
        this.cargado = false;
        
        this.cargarModelo();
    }

    cargarModelo() { // Carga el modelo 3D del piso usando GLTFLoader
        const loader = new GLTFLoader();
        loader.load(this.archivo, (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.material.side = THREE.DoubleSide; // Hace que las caras sean visibles desde ambos lados
                    if (this.color && child.material.color) {
                        child.material.color.set(this.color);
                    }
                }
            });
            
            this.modelo = gltf.scene; // Guarda el modelo cargado
            this.scene.add(gltf.scene); // Agrega el modelo a la escena
            this.cargado = true;
            console.log(`Piso ${this.nombre} cargado correctamente`); // Confirmación de carga
        }, undefined, (error) => {
            console.error(`Error cargando ${this.nombre}:`, error); // Manejo de errores
        });
    }

    mostrar() { // Muestra el piso en su posición inicial
        if (this.modelo) {
            this.modelo.position.set(
                this.posicionInicial.x,
                this.posicionInicial.y,
                this.posicionInicial.z
            );
        }
    }

    ocultar() { // Oculta el piso moviéndolo lejos de la cámara
        if (this.modelo) {
            this.modelo.position.set(0, 0, 100000); // lo manda super lejos AJAJJAJA esque creiamos que iba a ser mas pesado cargar y ocultar
        }
    }

    posicionar(x, y, z) {
        if (this.modelo) {
            this.modelo.position.set(x, y, z); // posiciona el piso en las coordenadas dadas
        }
    }

    estaListo() {
        return this.cargado && this.modelo; // verifica si el modelo está cargado y listo
    }

    detectarHabitacion(interseccion) {
        return this.habitaciones.detectar(interseccion); // delega la detección de habitaciones a la clase HabitacionDetector
    }
}