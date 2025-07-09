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
            "Authorization": "Bearer 099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea" // token 
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
    
    fetch("https://gestionweb.frlp.utn.edu.ar/api/g8-episodios", {
        headers: {
            "Authorization": `Bearer 099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    
   .then(data => {
    if (!data || !Array.isArray(data.data)) {
        throw new Error("Formato de datos no válido");
    }

    console.log("Datos recibidos de Strapi:", data.data); 

    mainContent.innerHTML = "<h3>Episodios guardados en Strapi:</h3>";
    
    // Limitar a solo los primeros 10 episodios
    const episodiosLimitados = data.data.slice(0, 10);
    
episodiosLimitados.forEach(ep => {
    // En tu caso los datos ya están "planos", sin 'attributes'
    const episodio = ep; 

    // Ahora accedes directo a las propiedades:
    const epDiv = document.createElement("div");
    epDiv.innerHTML = `
        <strong>${episodio.nombre}</strong><br>
        Fecha: ${episodio.fecha_estreno || 'Sin fecha'}<br>
        Duración: ${episodio.duracion || 'N/D'} min<br>
        Votos: ${episodio.cant_votos || 0} (Prom: ${episodio.promedio_votos || 0})<br>
        <p>${episodio.sinopsis || ''}</p>
        <hr>
    `;
    mainContent.appendChild(epDiv);
});

})
;
}
