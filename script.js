function obtenerEpiYGuardarEnStrapi() {
    const API_KEY = '9aea13583e5dea10e8f390a9773868ec';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const url = `${BASE_URL}/tv/1418/season/3?api_key=${API_KEY}&language=es-ES`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const episodios = data.episodes.slice(0,10);
            episodios.forEach(ep => {
                guardarEpisodioEnStrapi({
                    nombre: ep.name,
                    fecha_estreno: ep.air_date,
                    sinopsis: ep.overview,
                    duracion: ep.runtime,
                    cantidad_votos: ep.vote_count,
                    promedio_votos: ep.vote_average
                });
            });
            alert("Datos cargados en Strapi");
        })
        .catch(error => console.error("Error al cargar datos desde TMDb:", error));
}

function guardarEpisodioEnStrapi(episodio) {
    fetch("https://gestionweb.frlp.utn.edu.ar/api/g8-episodios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer TU_TOKEN" // token 
        },
        body: JSON.stringify({
            data: {
                nombre: episodio.nombre,
                fecha_estreno: episodio.fecha_estreno,
                sinopsis: episodio.sinopsis,
                duracion: episodio.duracion,
                cant_votos: episodio.cantidad_votos,
                promedio_votos: episodio.promedio_votos
            }
        })
    })
    .then(res => res.json())
    .then(data => console.log("Guardado en Strapi:", data))
    .catch(error => console.error("Error al guardar en Strapi:", error));
}

function mostrarDatosDesdeStrapi() {
    mainContent.innerHTML = "<p>Cargando datos desde Strapi...</p>";
    fetch("https://gestionweb.frlp.utn.edu.ar/api/g8-episodios")
        .then(response => response.json())
        .then(data => {
            mainContent.innerHTML = "<h3>Episodios guardados en Strapi:</h3>";
            data.data.forEach(ep => {
                const episodio = ep.attributes;
                const epDiv = document.createElement("div");
                epDiv.innerHTML = `
                    <strong>${episodio.nombre}</strong><br>
                    Fecha: ${episodio.fecha_estreno}<br>
                    Duración: ${episodio.duracion} min<br>
                    Votos: ${episodio.cant_votos} (Prom: ${episodio.promedio_votos})<br>
                    <p>${episodio.sinopsis}</p>
                    <hr>
                `;
                mainContent.appendChild(epDiv);
            });
        })
        .catch(error => {
            mainContent.innerHTML = `<p>Error al obtener datos de Strapi: ${error}</p>`;
        });
}
