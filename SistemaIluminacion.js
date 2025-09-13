class SistemaIluminacion { // Clase para manejar la ilumiancion
    constructor(scene) {
        this.scene = scene; // Guarda la escena
        this.configurarLuces(); // Llama al metodo para configurar las luces
    }
    configurarLuces() { // Configura las luces de la escena

        const luzSol = new THREE.DirectionalLight(0xffffff, 1.2); // luz blanca intensa simulando el sol
        luzSol.position.set(10, 10, 5); // posicion de la luz
        luzSol.castShadow = true; // habilita sombras
        luzSol.shadow.mapSize.width = 2048; // mejora la calidad de las sombras
        luzSol.shadow.mapSize.height = 2048; // mejora la calidad de las sombras
        this.scene.add(luzSol); // agrega la luz a la escena
    }
}