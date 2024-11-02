const API_KEY = "DEMO_KEY";  
let paginaActual = 1;
let fechaSeleccionada = "2015-07-02";

async function buscarFotos() {
    const fechaInput = document.getElementById("fecha");
    fechaSeleccionada = fechaInput.value;
    paginaActual = 1;  
    await cargarFotos();
}

async function cargarFotos() {
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${fechaSeleccionada}&api_key=${API_KEY}&page=${paginaActual}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        mostrarFotos(data.photos);
    } catch (error) {
        console.error("Error al cargar fotos:", error);
    }
}

function mostrarFotos(fotos) {
    const tablaFotos = document.getElementById("tabla-fotos");
    tablaFotos.innerHTML = ""; 

    fotos.forEach(foto => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${foto.id}</td>
            <td>${foto.rover.name}</td>
            <td>${foto.camera.full_name}</td>
            <td><button onclick="mostrarDetalle(${foto.id})">More</button></td>
        `;
        tablaFotos.appendChild(fila);
    });

    if (fotos.length > 0) {
        mostrarDetalle(fotos[0].id);  
    } else {
        document.getElementById("info-detalle").textContent = "No hay fotos para esta fecha.";
        document.getElementById("foto-detalle").src = "";
    }
}

function cambiarPagina(direccion) {
    paginaActual += direccion;
    if (paginaActual < 1) paginaActual = 1;
    cargarFotos();
}

function mostrarDetalle(idFoto) {
    fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${fechaSeleccionada}&api_key=${API_KEY}&page=${paginaActual}`)
        .then(response => response.json())
        .then(data => {
            const foto = data.photos.find(f => f.id === idFoto);
            if (foto) {
                document.getElementById("foto-detalle").src = foto.img_src;
                document.getElementById("info-detalle").textContent = `Id: ${foto.id} | Martian sol: ${foto.sol} | Earth date: ${foto.earth_date}`;
            }
        });
}

window.onload = () => {
    document.getElementById("fecha").value = "2015-07-02";
    cargarFotos();
};

