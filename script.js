const pokemonList = document.getElementById('pokemon-list');
const typeButtons = document.querySelectorAll('.barra img');
const sortSelect = document.getElementById('type-filter');
let allPokemon = []; // Guardamos todos los Pokémon
let selectedTypes = []; // Aquí guardaremos los tipos seleccionados

// Cargar Pokémon
async function loadPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1600');
    const data = await response.json();
    const pokemons = data.results;

    for (let i = 0; i < pokemons.length; i++) {
        const pokemonData = await fetchPokemonDetails(pokemons[i].url);
        allPokemon.push(pokemonData);
        createPokemonCard(pokemonData, i + 1);
    }
}

// Obtener detalles de un Pokémon
async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    return response.json();
}

// Crear tarjeta de Pokémon
function createPokemonCard(pokemon, number) {
    const types = pokemon.types.map(type => type.type.name);

    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.setAttribute('data-types', types.join(',')); // Guardamos los tipos en el dataset
    card.setAttribute('data-number', number); // Guardamos el número de la Pokédex
    card.setAttribute('data-name', pokemon.name); // Guardamos el nombre
    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h3>#${number.toString().padStart(3, '0')} ${pokemon.name}</h3>
        <p>${types.join(', ')}</p>
    `;

    card.addEventListener('click', () => {
        window.location.href = `detalle.html?pokemon=${pokemon.name}`;
    });

    pokemonList.appendChild(card);
}

// Filtrar Pokémon por tipo (ahora permite solo hasta 2 tipos simultáneos y se deben cumplir ambos)
function filterByType() {
    const cards = document.querySelectorAll('.pokemon-card');

    cards.forEach(card => {
        const cardTypes = card.getAttribute('data-types').split(',');
        if (selectedTypes.length === 0 || (selectedTypes.length <= 2 && selectedTypes.every(type => cardTypes.includes(type)))) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Manejo de selección de tipos (máximo 2 seleccionados)
typeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.getAttribute('data-type');

        if (selectedTypes.includes(type)) {
            // Si ya estaba seleccionado, lo quitamos
            selectedTypes = selectedTypes.filter(t => t !== type);
            button.classList.remove('selected');
        } else {
            // Si hay menos de 2 tipos seleccionados, lo añadimos
            if (selectedTypes.length < 2) {
                selectedTypes.push(type);
                button.classList.add('selected');
            }
        }

        filterByType();
    });
});

// Ordenar Pokémon
function sortPokemon(criteria) {
    const cards = Array.from(document.querySelectorAll('.pokemon-card'));

    cards.sort((a, b) => {
        if (criteria === 'name') {
            return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
        } else if (criteria === 'number') {
            return parseInt(a.getAttribute('data-number')) - parseInt(b.getAttribute('data-number'));
        }
        return 0;
    });

    pokemonList.innerHTML = ""; // Limpiamos la lista
    cards.forEach(card => pokemonList.appendChild(card)); // Reagregamos en orden
}

// Evento para ordenar Pokémon
sortSelect.addEventListener('change', () => {
    const value = sortSelect.value;
    if (value === 'name') {
        sortPokemon('name');
    } else if (value === 'number') {
        sortPokemon('number');
    }
});

// Cargar Pokémon al iniciar
loadPokemon();
