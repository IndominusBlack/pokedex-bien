const pokemonDetail = document.getElementById('pokemon-detail');

// Obtener el nombre del Pokémon de los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const pokemonName = params.get('pokemon');

if (pokemonName) {
    loadPokemonDetails(pokemonName);
} else {
    pokemonDetail.innerHTML = '<p>Error: No se proporcionó un Pokémon válido.</p>';
}

// Cargar los detalles del Pokémon
async function loadPokemonDetails(name) {
    try {
        const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const speciesData = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);

        if (!pokemonData.ok || !speciesData.ok) {
            throw new Error('Error al cargar los datos del Pokémon.');
        }

        const pokemon = await pokemonData.json();
        const species = await speciesData.json();

        displayPokemonDetails(pokemon, species);
    } catch (error) {
        console.error(error);
        pokemonDetail.innerHTML = '<p>Error al cargar los detalles del Pokémon.</p>';
    }
}

// Mostrar los detalles del Pokémon
function displayPokemonDetails(pokemon, species) {
    const types = pokemon.types.map(type => type.type.name).join(', ');
    const abilities = pokemon.abilities.map(ability => ability.ability.name).join(', ');

    const stats = pokemon.stats.map(stat => `
        <tr>
            <td>${stat.stat.name}</td>
            <td>${stat.base_stat}</td>
        </tr>
    `).join('');

    pokemonDetail.innerHTML = `
        <section class="pokemon-info">
            <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            <p>Tipo(s): ${types}</p>
            <p>Habilidades: ${abilities}</p>
            <p>Descripción: ${species.flavor_text_entries.find(entry => entry.language.name === 'es').flavor_text}</p>
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
                    ${stats}
                </tbody>
            </table>
        </section>
    `;
}
