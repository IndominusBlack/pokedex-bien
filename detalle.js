// Elemento donde se mostrarán los detalles del Pokémon
const pokemonDetail = document.getElementById('pokemon-detail');

// Obtener parámetros de la URL para identificar qué Pokémon se debe cargar
const parametros = new URLSearchParams(window.location.search);
const nombrePokemon = parametros.get('pokemon');

// Si hay un nombre de Pokémon en los parámetros, cargamos sus detalles
if (nombrePokemon) {
    cargarDetallesPoke(nombrePokemon);
} else {
    // Si no se proporciona un Pokémon válido, mostramos un mensaje de error
    pokemonDetail.innerHTML = '<p>Error: No se proporcionó un Pokémon válido.</p>';
}

// Función asincrónica para obtener y mostrar los detalles del Pokémon
async function cargarDetallesPoke(name) {
    try {
        // Realizamos las solicitudes a la API para obtener la información del Pokémon y su especie
        const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const especie = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);

        // Verificamos si las solicitudes fueron exitosas
        if (!pokemon.ok || !especie.ok) {
            throw new Error('Error al cargar los datos del Pokémon.');
        }

        // Convertimos las respuestas a formato JSON
        const datosPokemon = await pokemon.json();
        const datosEspecie = await especie.json();

        // Llamamos a la función para mostrar los detalles en la página
        mostrarDetallesPoke(datosPokemon, datosEspecie);
    } catch (error) {
        // En caso de error, lo mostramos en la consola y en la interfaz
        console.error(error);
        pokemonDetail.innerHTML = '<p>Error al cargar los detalles del Pokémon.</p>';
    }
}

// Función para mostrar los detalles del Pokémon en la página
function mostrarDetallesPoke(pokemon, especies) {
    // Obtener la lista de tipos del Pokémon
    let typeList = [];
    for (let i = 0; i < pokemon.types.length; i++) {
        typeList.push(pokemon.types[i].type.name);
    }

    // Obtener la lista de habilidades del Pokémon
    let listaHabilidades = [];
    for (let i = 0; i < pokemon.abilities.length; i++) {
        listaHabilidades.push(pokemon.abilities[i].ability.name);
    }

    // Generar el contenido de la tabla de estadísticas base
    let statsHTML = '';
    for (let i = 0; i < pokemon.stats.length; i++) {
        statsHTML += `
            <tr>
                <td>${pokemon.stats[i].stat.name}</td>
                <td>${pokemon.stats[i].base_stat}</td>
            </tr>
        `;
    }

    // Obtener la descripción en español del Pokémon desde la Pokédex
    let descripcionPokedex = 'Descripción no disponible en español.';
    for (let i = 0; i < especies.flavor_text_entries.length; i++) {
        if (especies.flavor_text_entries[i].language.name === 'es') {
            descripcionPokedex = especies.flavor_text_entries[i].flavor_text.replace(/[\n\f]/g, ' '); // Eliminamos saltos de línea
            break;
        }
    }

    // Insertamos la información del Pokémon en el HTML
    pokemonDetail.innerHTML = `
        <section class="pokemon-info">
            <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            <p><strong>Tipo(s):</strong> ${typeList.join(', ')}</p>
            <p><strong>Habilidades:</strong> ${listaHabilidades.join(', ')}</p>
            <p><strong>Descripción:</strong> ${descripcionPokedex}</p>
        </section>

        <section class="pokemon-stats">
            <h3>Estadísticas Base</h3>
            <table>
                <thead>
                    <tr>
                        <th>Estadística</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${statsHTML}
                </tbody>
            </table>
        </section>
    `;
}
