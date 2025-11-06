import * as THREE from "three";

class CameraController {
    constructor(camera, controls) {
        this.camera = camera;
        this.controls = controls;
        this.animando = false;
        this.duracionAnimacion = 1500; // 1.5 segundos
    }

    // Enfocar una habitación específica con animación suave
    enfocarHabitacion(posicionObjetivo, callback) {
        if (this.animando) return;
        
        this.animando = true;
        
        // Pausar la auto-rotación durante el enfoque
        const autoRotateInicial = this.controls.autoRotate;
        this.controls.autoRotate = false;
        
        // Posiciones iniciales
        const posicionInicial = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };
        
        const targetInicial = {
            x: this.controls.target.x,
            y: this.controls.target.y,
            z: this.controls.target.z
        };
        
        // Posición objetivo de la cámara
        const posicionFinal = {
            x: posicionObjetivo.x,
            y: posicionObjetivo.y,
            z: posicionObjetivo.z
        };
        
        // Target objetivo (punto donde mira la cámara)
        const targetFinal = {
            x: posicionObjetivo.x || 0,
            y: posicionObjetivo.y - 1 || 0,
            z: posicionObjetivo.z - 2 || 0
        };
        
        // Tiempo de inicio
        const tiempoInicio = Date.now();
        
        // Función de animación
        const animar = () => {
            const tiempoTranscurrido = Date.now() - tiempoInicio;
            const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacion, 1);
            
            // Usar función easing para suavizar el movimiento
            const t = this.easeInOutCubic(progreso);
            
            // Interpolar posición de la cámara
            this.camera.position.x = posicionInicial.x + (posicionFinal.x - posicionInicial.x) * t;
            this.camera.position.y = posicionInicial.y + (posicionFinal.y - posicionInicial.y) * t;
            this.camera.position.z = posicionInicial.z + (posicionFinal.z - posicionInicial.z) * t;
            
            // Interpolar target (punto donde mira)
            this.controls.target.x = targetInicial.x + (targetFinal.x - targetInicial.x) * t;
            this.controls.target.y = targetInicial.y + (targetFinal.y - targetInicial.y) * t;
            this.controls.target.z = targetInicial.z + (targetFinal.z - targetInicial.z) * t;
            
            this.controls.update();
            
            if (progreso < 1) {
                requestAnimationFrame(animar);
            } else {
                this.animando = false;
                this.controls.autoRotate = autoRotateInicial;
                if (callback) callback();
            }
        };
        
        animar();
    }

    // Volver a la vista inicial
    volverVistaInicial() {
        this.enfocarHabitacion({
            x: 0,
            y: 3,
            z: 16
        });
        
        // Restablecer target
        setTimeout(() => {
            this.controls.target.set(-4, 0, 0);
            this.controls.update();
        }, this.duracionAnimacion);
    }

    // Función easing para suavizar animaciones
    easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Enfocar con zoom (acercar más)
    enfocarConZoom(posicionObjetivo, nivelZoom = 1.5) {
        const posicionConZoom = {
            x: posicionObjetivo.x,
            y: posicionObjetivo.y,
            z: posicionObjetivo.z / nivelZoom
        };
        
        this.enfocarHabitacion(posicionConZoom);
    }

    // Rotar alrededor de un punto específico
    orbitarAlrededor(centro, radio = 5, duracion = 3000) {
        if (this.animando) return;
        
        this.animando = true;
        const tiempoInicio = Date.now();
        
        const animar = () => {
            const tiempoTranscurrido = Date.now() - tiempoInicio;
            const progreso = tiempoTranscurrido / duracion;
            
            if (progreso < 1) {
                const angulo = progreso * Math.PI * 2;
                
                this.camera.position.x = centro.x + Math.cos(angulo) * radio;
                this.camera.position.z = centro.z + Math.sin(angulo) * radio;
                this.camera.position.y = centro.y + 2;
                
                this.controls.target.set(centro.x, centro.y, centro.z);
                this.controls.update();
                
                requestAnimationFrame(animar);
            } else {
                this.animando = false;
            }
        };
        
        animar();
    }
}

export default CameraController;