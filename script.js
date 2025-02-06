const pokemonList = document.getElementById('pokemon-list');
const searchInput = document.getElementById('search');
const typeFilter = document.getElementById('type-filter');

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=1025';

// Cargar los Pokémon al inicio
async function loadPokemon() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const pokemons = data.results;

        pokemons.forEach(async (pokemon, index) => {
            const pokemonData = await fetchPokemonDetails(pokemon.url);
            createPokemonCard(pokemonData, index + 1);
        });
    } catch (error) {
        console.error('Error cargando los Pokémon:', error);
    }
}

// Obtener detalles de un Pokémon
async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    return response.json();
}

// Crear tarjeta de Pokémon
function createPokemonCard(pokemon, number) {
    const types = pokemon.types.map(type => type.type.name).join(', ');
    
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h3>#${number.toString().padStart(3, '0')} ${pokemon.name}</h3>
        <p>${types}</p>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `detalle.html?pokemon=${pokemon.name}`;
    });

    pokemonList.appendChild(card);
}

// Filtrar Pokémon por nombre
searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.pokemon-card');

    cards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        if (name.includes(filter)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Cargar Pokémon al iniciar
loadPokemon();
