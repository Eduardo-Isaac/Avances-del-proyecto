// PantallaCarga.js
class PantallaCarga {
    constructor() {
        this.tiempoCarga = 5500; // 5.5 segundos
        this.elementoCarga = null;
        this.inicializado = false;
    }

    inicializar() {
        if (this.inicializado) return;
        
        // Crear elemento de pantalla de carga
        this.elementoCarga = document.createElement('div');
        this.elementoCarga.id = 'pantalla-carga';
        this.elementoCarga.innerHTML = `
            <div class="contenido-carga">
                <div class="icono-carga">
                    <img src="icono-carga.gif" alt="Cargando...">
                </div>
                <h1 class="titulo-carga">Mapeo UVG</h1>
                <div class="barra-progreso">
                    <div class="progreso"></div>
                </div>
            </div>
        `;
        
        // Aplicar estilos
        this.aplicarEstilos();
        
        // Agregar al DOM
        document.body.appendChild(this.elementoCarga);
        
        this.inicializado = true;
    }

    aplicarEstilos() {
        const estilos = `
            <style>
                #pantalla-carga {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #00ca02;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                .contenido-carga {
                    text-align: center;
                    color: white;
                    max-width: 90%;
                }
                
                .icono-carga {
                    margin-bottom: 30px;
                }
                
                .icono-carga img {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                }
                
                .titulo-carga {
                    font-size: 3.5rem;
                    font-weight: 700;
                    margin-bottom: 30px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                    letter-spacing: 2px;
                }
                
                .barra-progreso {
                    width: 300px;
                    height: 8px;
                    background-color: rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                    margin: 0 auto;
                    overflow: hidden;
                }
                
                .progreso {
                    height: 100%;
                    width: 0%;
                    background-color: white;
                    border-radius: 4px;
                    transition: width 0.3s ease;
                }
                
                /* Animación de fade out */
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                
                .ocultando {
                    animation: fadeOut 0.5s ease forwards;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .titulo-carga {
                        font-size: 2.5rem;
                    }
                    
                    .icono-carga img {
                        width: 80px;
                        height: 80px;
                    }
                    
                    .barra-progreso {
                        width: 250px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', estilos);
    }

    mostrar() {
        this.inicializar();
        
        // Iniciar animación de la barra de progreso
        const barraProgreso = this.elementoCarga.querySelector('.progreso');
        let progreso = 0;
        const incremento = 100 / (this.tiempoCarga / 50); // Actualizar cada 50ms
        
        const intervalo = setInterval(() => {
            progreso += incremento;
            if (progreso >= 100) {
                progreso = 100;
                clearInterval(intervalo);
            }
            barraProgreso.style.width = `${progreso}%`;
        }, 50);
        
        // Ocultar después del tiempo especificado
        setTimeout(() => {
            this.ocultar();
        }, this.tiempoCarga);
    }

    ocultar() {
        if (!this.elementoCarga) return;
        
        // Aplicar animación de salida
        this.elementoCarga.classList.add('ocultando');
        
        // Eliminar del DOM después de la animación
        setTimeout(() => {
            if (this.elementoCarga && this.elementoCarga.parentNode) {
                this.elementoCarga.parentNode.removeChild(this.elementoCarga);
                this.elementoCarga = null;
            }
        }, 500);
    }
}

export default PantallaCarga;
