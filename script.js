const pokemonList = document.getElementById('pokemon-list'); // Contenedor donde se mostrarán los Pokémon
const typeButtons = document.querySelectorAll('.barra img'); // Botones para filtrar por tipo
const sortSelect = document.getElementById('type-filter'); // Selector para ordenar Pokémon
const searchInput = document.getElementById('search'); // Campo de búsqueda

let pokemonTotal = []; // Guardamos todos los Pokémon obtenidos de la API
let tiposSeleccionados = []; // Lista de tipos seleccionados para el filtrado

// Función asíncrona para cargar los datos de los Pokémon
async function cargarPokemon() {
    const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025'); // Petición a la API
    const datos = await respuesta.json(); // Convertimos la respuesta a JSON
    const resultados = datos.results; // Extraemos la lista de Pokémon

    // Recorremos la lista de Pokémon para obtener sus detalles
    for (let i = 0; i < resultados.length; i++) {
        const pokemonData = await obtenerDetallesPoke(resultados[i].url);
        pokemonTotal.push(pokemonData); // Guardamos los detalles en la lista
        crearTarjetaPoke(pokemonData, i + 1); // Creamos la tarjeta de presentación del Pokémon
    }
}

// Función para obtener detalles de un Pokémon específico
async function obtenerDetallesPoke(url) {
    const respuesta = await fetch(url); // Petición a la API con la URL del Pokémon
    return respuesta.json(); // Devolvemos los detalles en formato JSON
}

// Función para crear una tarjeta visual de cada Pokémon
function crearTarjetaPoke(pokemon, numero) {
    const tipos = pokemon.types.map(type => type.type.name); // Extraemos los tipos del Pokémon

    // Creamos el contenedor de la tarjeta
    const tarjeta = document.createElement('div');
    tarjeta.className = 'pokemon-card'; // Asignamos la clase CSS
    tarjeta.setAttribute('data-types', tipos.join(',')); // Guardamos los tipos en atributos
    tarjeta.setAttribute('data-number', numero); // Guardamos el número de Pokédex
    tarjeta.setAttribute('data-name', pokemon.name); // Guardamos el nombre del Pokémon
    
    // Contenido HTML de la tarjeta
    tarjeta.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h3>#${numero.toString().padStart(3, '0')} ${pokemon.name}</h3>
        <p>${tipos.join(', ')}</p>
    `;
    
    // Evento al hacer clic en la tarjeta para redirigir a la página de detalles
    tarjeta.addEventListener('click', () => {
        window.location.href = `detalle.html?pokemon=${pokemon.name}`;
    });

    pokemonList.appendChild(tarjeta); // Agregamos la tarjeta al contenedor
}

// Función para filtrar Pokémon por nombre y tipo
function filtrarPokemon() {
    const searchTerm = searchInput.value.toLowerCase(); // Texto de búsqueda en minúsculas
    const tarjetas = document.querySelectorAll('.pokemon-card'); // Obtenemos todas las tarjetas

    tarjetas.forEach(card => {
        const nombre = card.getAttribute('data-name').toLowerCase(); // Nombre del Pokémon en la tarjeta
        const tiposCartas = card.getAttribute('data-types').split(','); // Tipos del Pokémon en la tarjeta

        const matchesSearch = nombre.includes(searchTerm); // Verificamos si coincide con la búsqueda
        const matchesType =
            tiposSeleccionados.length === 0 || // Si no hay tipos seleccionados, mostrar todos
            (tiposSeleccionados.length <= 2 && tiposSeleccionados.every(tipo => tiposCartas.includes(tipo))); // Si los tipos seleccionados coinciden

        if (matchesSearch && matchesType) {
            card.style.display = 'block'; // Mostramos la tarjeta si cumple los criterios
        } else {
            card.style.display = 'none'; // Ocultamos la tarjeta si no cumple
        }
    });
}

// Evento para manejar la selección de tipos (máximo 2 seleccionados)
typeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tipo = button.getAttribute('data-type'); // Obtenemos el tipo del botón

        if (tiposSeleccionados.includes(tipo)) {
            // Si el tipo ya estaba seleccionado, lo quitamos
            tiposSeleccionados = tiposSeleccionados.filter(t => t !== tipo);
            button.classList.remove('selected'); 
        } else {
            // Si hay menos de 2 tipos seleccionados, lo añadimos
            if (tiposSeleccionados.length < 2) {
                tiposSeleccionados.push(tipo);
                button.classList.add('selected');
            }
        }
        filtrarPokemon(); // Aplicamos el filtrado combinado
    });
});

// Evento para actualizar la lista cuando se escribe en la barra de búsqueda
searchInput.addEventListener('input', filtrarPokemon);

// Función para ordenar los Pokémon según el criterio elegido
function ordenarPokemon(criteria) {
    const tarjetas = Array.from(document.querySelectorAll('.pokemon-card')); // Convertimos NodeList en array

    tarjetas.sort((a, b) => {
        if (criteria === 'name') {
            return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name')); // Orden alfabético
        } else if (criteria === 'number') {
            return parseInt(a.getAttribute('data-number')) - parseInt(b.getAttribute('data-number')); // Orden por número
        }
        return 0;
    });

    pokemonList.innerHTML = ""; // Limpiamos la lista antes de agregar los ordenados
    tarjetas.forEach(tarjeta => pokemonList.appendChild(tarjeta)); // Agregamos las tarjetas en orden
}

// Evento para detectar cambios en el selector de orden y aplicarlo
sortSelect.addEventListener('change', () => {
    const valor = sortSelect.value;
    if (valor === 'name') {
        ordenarPokemon('name'); // Ordenar por nombre
    } else if (valor === 'number') {
        ordenarPokemon('number'); // Ordenar por número de Pokédex
    }
});

// Llamamos a la función para cargar Pokémon al iniciar la página
cargarPokemon();