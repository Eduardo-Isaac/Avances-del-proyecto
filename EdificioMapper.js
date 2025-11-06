import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import PisoManager from './PisoManager.js';
import BotonesManager from './BotonesManager.js';
import SistemaBusqueda from './SistemaBusqueda.js';
import CameraController from './CameraController.js';
import ControlsManager from './ControlsManager.js';

class SistemaIluminacion {
    constructor(scene) {
        this.scene = scene;
        const luz1 = new THREE.DirectionalLight(0xFFFFFF);
        luz1.position.set(1, 8, 3);
        this.scene.add(luz1);
        
        const luz2 = new THREE.AmbientLight(0x404040);
        luz2.intensity = 2.5;
        this.scene.add(luz2);
    }
}

class InterfazUsuario {
    constructor(edificioMapper) {
        this.edificioMapper = edificioMapper;
        this.botonesManager = new BotonesManager(edificioMapper.pisoManager);
    }

    mostrarInfoHabitacion(habitacion) {
        this.mostrarTarjetaInfo(habitacion);
        if (this.edificioMapper.controls) {
            this.edificioMapper.controls.autoRotate = false;
        }
    }

    mostrarTarjetaInfo(habitacion) {
        let tarjeta = document.getElementById("info-card");
        
        if (!tarjeta) {
            tarjeta = document.createElement("div");
            tarjeta.id = "info-card";
            document.body.appendChild(tarjeta);
        }

        const equipHTML = habitacion.equipamiento 
            ? habitacion.equipamiento.map(i => `<li>${i}</li>`).join('')
            : '<li>Sin información</li>';

        tarjeta.innerHTML = `
            <div class="info-card-header">
                <h3>${habitacion.nombre || 'Área'}</h3>
                <button class="cerrar-card" onclick="this.closest('#info-card').classList.remove('visible'); document.querySelector('.controls-wrapper') ? null : document.querySelector('body').dispatchEvent(new CustomEvent('reactivarRotacion'))">×</button>
            </div>
            <div class="info-card-body">
                <p><strong>Nombre:</strong> ${habitacion.nombreCompleto || habitacion.nombre}</p>
                ${habitacion.tipo ? `<p><strong>Tipo:</strong> ${habitacion.tipo}</p>` : ''}
                ${habitacion.capacidad ? `<p><strong>Capacidad:</strong> ${habitacion.capacidad} personas</p>` : ''}
                ${habitacion.equipamiento ? `<p><strong>Equipamiento:</strong></p><ul>${equipHTML}</ul>` : ''}
            </div>
        `;
        
        tarjeta.style.display = "block";
        setTimeout(() => tarjeta.classList.add('visible'), 10);
        
        // Evento para cerrar
        document.body.addEventListener('reactivarRotacion', () => {
            if (this.edificioMapper.controls) {
                this.edificioMapper.controls.autoRotate = true;
            }
        }, { once: true });
    }
}

class EdificioMapper {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.pisoManager = new PisoManager(this.scene);
        this.iluminacion = new SistemaIluminacion(this.scene);
        
        this.inicializar();
    }

    inicializar() {
        this.configurarRenderer();
        this.configurarControles();
        
        this.cameraController = new CameraController(this.camera, this.controls);
        this.controlsManager = new ControlsManager(this.controls);
        this.interfazUsuario = new InterfazUsuario(this);
        this.busqueda = new SistemaBusqueda(
            this.pisoManager, 
            this.pisoManager.habitacionDetector,
            this.cameraController
        );
        
        this.configurarEventos();
        this.iniciarRenderizado();
    }

    configurarRenderer() {
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        document.body.appendChild(this.renderer.domElement);
    }

    configurarControles() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1.0;
        this.camera.position.z = 16;
        this.controls.maxDistance = 40;
        this.controls.target.set(-4, 0, 0);
        this.controls.update();
    }

    configurarEventos() {
        window.addEventListener('mousedown', (e) => this.manejarClick(e));
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });
    }

    manejarClick(event) {
        if (event.target.closest('.search-container') || 
            event.target.closest('#controls') ||
            event.target.closest('#info-card')) {
            return;
        }

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const pisoActivo = this.pisoManager.obtenerPisoActivo();
        if (pisoActivo) {
            const intersects = this.raycaster.intersectObject(pisoActivo.modelo, true);
            if (intersects.length > 0) {
                const habitacion = pisoActivo.detectarHabitacion(intersects[0]);
                if (habitacion && habitacion.tipoDeteccion === 'exitosa') {
                    this.interfazUsuario.mostrarInfoHabitacion(habitacion);
                    if (habitacion.posicionCamara) {
                        this.cameraController.enfocarHabitacion(habitacion.posicionCamara);
                    }
                }
            }
        }
    }

    iniciarRenderizado() {
        const render = () => {
            requestAnimationFrame(render);
            this.pisoManager.actualizar();
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        render();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    new EdificioMapper();
});