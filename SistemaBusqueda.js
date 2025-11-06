class SistemaBusqueda {
    constructor(pisoManager, habitacionDetector, cameraController) {
        this.pisoManager = pisoManager;
        this.habitacionDetector = habitacionDetector;
        this.cameraController = cameraController;
        this.inputBusqueda = null;
        this.resultadosContainer = null;
        this.tarjetaActiva = false;
        
        this.configurarEventos();
    }

    configurarEventos() {
        // Configurar input de búsqueda
        this.inputBusqueda = document.getElementById("search");
        if (!this.inputBusqueda) {
            console.warn("No se encontró el input de búsqueda");
            return;
        }

        // Crear contenedor de resultados si no existe
        this.crearContenedorResultados();

        // Eventos del input
        this.inputBusqueda.addEventListener("input", (e) => this.manejarBusqueda(e));
        this.inputBusqueda.addEventListener("focus", () => {
            if (this.inputBusqueda.value.length >= 2) {
                this.mostrarResultados();
            }
        });
        
        // Cerrar resultados al hacer click fuera
        document.addEventListener("click", (e) => {
            if (!e.target.closest('.search-container')) {
                this.ocultarResultados();
            }
        });

        // Buscar al presionar Enter
        this.inputBusqueda.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const primerResultado = this.resultadosContainer.querySelector('.resultado-item');
                if (primerResultado) {
                    primerResultado.click();
                }
            }
        });
    }

    crearContenedorResultados() {
        // Verificar si ya existe
        this.resultadosContainer = document.getElementById("search-results");
        
        if (!this.resultadosContainer) {
            // Crear nuevo contenedor
            this.resultadosContainer = document.createElement("div");
            this.resultadosContainer.id = "search-results";
            this.resultadosContainer.className = "search-results";
            this.resultadosContainer.style.display = "none";
            
            // Insertar después del input
            this.inputBusqueda.parentNode.appendChild(this.resultadosContainer);
        }
    }

    manejarBusqueda(event) {
        const consulta = event.target.value;
        
        if (!consulta || consulta.length < 2) {
            this.ocultarResultados();
            return;
        }

        // Buscar habitaciones que coincidan
        const resultados = this.habitacionDetector.buscarMultiples(consulta);
        
        if (resultados.length === 0) {
            this.mostrarSinResultados();
            return;
        }

        this.mostrarResultadosBusqueda(resultados);
    }

    mostrarResultadosBusqueda(resultados) {
        this.resultadosContainer.innerHTML = '';
        
        resultados.forEach(habitacion => {
            const item = document.createElement("div");
            item.className = "resultado-item";
            item.innerHTML = `
                <div class="resultado-nombre">${habitacion.nombre}</div>
                <div class="resultado-info">${habitacion.nombreCompleto} - ${habitacion.tipo}</div>
            `;
            
            item.addEventListener("click", () => {
                this.seleccionarHabitacion(habitacion);
            });
            
            this.resultadosContainer.appendChild(item);
        });
        
        this.mostrarResultados();
    }

    mostrarSinResultados() {
        this.resultadosContainer.innerHTML = `
            <div class="sin-resultados">
                No se encontraron salones con ese nombre
            </div>
        `;
        this.mostrarResultados();
    }

    seleccionarHabitacion(habitacion) {
        console.log("Habitación seleccionada:", habitacion);
        
        // 1. Detener la auto-rotación
        if (this.cameraController.controls) {
            this.cameraController.controls.autoRotate = false;
        }
        
        // 2. Cambiar al piso correcto
        this.pisoManager.mostrarPiso(habitacion.pisoEncontrado);
        
        // 3. Mover la cámara a la habitación
        if (habitacion.posicionCamara) {
            this.cameraController.enfocarHabitacion(habitacion.posicionCamara);
        }
        
        // 4. Mostrar tarjeta de información
        this.mostrarTarjetaInfo(habitacion);
        
        // 5. Limpiar búsqueda
        this.inputBusqueda.value = '';
        this.ocultarResultados();
        
        // 6. Marcar que hay una tarjeta activa
        this.tarjetaActiva = true;
    }

    mostrarTarjetaInfo(habitacion) {
        // Verificar si existe contenedor de tarjeta
        let tarjeta = document.getElementById("info-card");
        
        if (!tarjeta) {
            tarjeta = document.createElement("div");
            tarjeta.id = "info-card";
            tarjeta.className = "info-card";
            document.body.appendChild(tarjeta);
        }

        // Construir HTML de la tarjeta
        const equipamientoHTML = habitacion.equipamiento 
            ? habitacion.equipamiento.map(item => `<li>${item}</li>`).join('')
            : '<li>Sin información</li>';

        tarjeta.innerHTML = `
            <div class="info-card-header">
                <h3>${habitacion.nombre}</h3>
                <button class="cerrar-card" id="cerrar-tarjeta">×</button>
            </div>
            <div class="info-card-body">
                <p><strong>Nombre completo:</strong> ${habitacion.nombreCompleto}</p>
                <p><strong>Tipo:</strong> ${habitacion.tipo}</p>
                ${habitacion.capacidad ? `<p><strong>Capacidad:</strong> ${habitacion.capacidad} personas</p>` : ''}
                ${habitacion.equipamiento ? `
                    <p><strong>Equipamiento:</strong></p>
                    <ul>${equipamientoHTML}</ul>
                ` : ''}
                <p><strong>Piso:</strong> ${habitacion.pisoEncontrado.toUpperCase()}</p>
            </div>
        `;
        
        // Mostrar tarjeta con animación
        tarjeta.style.display = "block";
        setTimeout(() => tarjeta.classList.add('visible'), 10);
        
        // Configurar evento del botón cerrar
        const botonCerrar = document.getElementById('cerrar-tarjeta');
        if (botonCerrar) {
            botonCerrar.addEventListener('click', () => this.cerrarTarjeta());
        }
    }

    cerrarTarjeta() {
        const tarjeta = document.getElementById("info-card");
        if (tarjeta) {
            tarjeta.classList.remove('visible');
            setTimeout(() => {
                tarjeta.style.display = "none";
            }, 400);
        }
        
        // Reactivar la auto-rotación
        if (this.cameraController.controls) {
            this.cameraController.controls.autoRotate = true;
        }
        
        this.tarjetaActiva = false;
    }

    mostrarResultados() {
        this.resultadosContainer.style.display = "block";
    }

    ocultarResultados() {
        this.resultadosContainer.style.display = "none";
    }
}

export default SistemaBusqueda;