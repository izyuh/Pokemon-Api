let url = "https://pokeapi.co/api/v2/pokemon/";
const container = document.getElementById("pokemon-list");
const button = document.getElementById("load");
const search = document.getElementById("search");

let debounceTimeout;

const typeMap = new Map([
  ["normal", "gray"],
  ["fighting", "orange"],
  ["flying", "lightblue"],
  ["poison", "#9f82ed"],
  ["ground", "#94592c"],
  ["rock", "gray"],
  ["bug", "lightgreen"],
  ["ghost", "purple"],
  ["steel", "#5f646e"],
  ["fire", "#eb3838"],
  ["water", "blue"],
  ["grass", "green"],
  ["electric", "#fff700"],
  ["psychic", "#f25ae6"],
  ["ice", "lightblue"],
  ["dragon", "darkblue"],
  ["dark", "#2c3030"],
  ["fairy", "#eda8f0"],
]);

const savedData = localStorage.getItem("rawPokemon") //gets data from localStorage if there is any
  ? JSON.parse(localStorage.getItem("rawPokemon"))
  : [];
let pokemons;

// Search function
search.addEventListener("input", (e) => {
  
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    filter(e.target.value);
  }, 500); // 700ms delay
  }
);

function filter(input) {
  console.log(input);
  const li = document.querySelectorAll("li");
  li.forEach((pokemon) => {
    if (
      pokemon
        .querySelector("h3")
        .innerText.toLowerCase().includes(input.toLowerCase().trim())
    ) {
      pokemon.style.display = "block";
    } else {
      pokemon.style.display = "none";
    }
  });
}

// Fetch data from local storage if there is any
async function fetchData() {

  if (savedData.length === 0) {
    await fetchApi(); // fetches from api
  } else {
    renderPokemonBatch(savedData); //renders from localStorage
  }

  async function fetchApi() {
    //fetches from api
    const data = await fetch(url).then((res) => res.json());
    pokemons = data.results; // gets initial data

    const pokemonDetails = await Promise.all(
      pokemons.map((pokemon) => fetch(pokemon.url).then((res) => res.json()))
    );

    let iDetails = pokemonDetails.map((pokemon) => ({
      name: pokemon.name,
      id: pokemon.id,
      sprite: pokemon.sprites.front_default || "pokeball.png",
      types: pokemon.types,
    }));

    savedData.push(...iDetails); // pushes details to variable to save
    localStorage.setItem("rawPokemon", JSON.stringify(savedData));
    renderPokemonBatch(iDetails); //renders each batch as its fetched

    if (data.next) {
      url = data.next;
      await fetchApi();
    }
  }

  button.style.display = "none";
}

// General render function for both batch and all
function renderPokemonBatch(pokemonArray) {
  search.style.transform = "translatey(60%)";


  pokemonArray.forEach((pokemon) => {

    const li = document.createElement("li");

    const id = document.createElement("span");
    id.classList.add("id");
    id.textContent =
      pokemon.id < 100
        ? pokemon.id.toString().padStart(3, "0")
        : pokemon.id.toString();
    li.appendChild(id);

    const capitalizeName =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const nameHTML = document.createElement("h3");
    nameHTML.innerHTML = capitalizeName;
    li.appendChild(nameHTML);

    const img = document.createElement("img");
    img.loading = "lazy"; // Native lazy loading
    img.src = pokemon.sprite ? pokemon.sprite : "./pokeball.png";
    li.appendChild(img);

    const typeDiv = document.createElement("div");
    const types = pokemon.types.map((type) =>
      type.type ? type.type.name : type
    );
    types.forEach((type) => {
      const span = document.createElement("span");
      span.style.backgroundColor = typeMap.get(type);
      span.innerHTML = type.charAt(0).toUpperCase() + type.slice(1);
      typeDiv.appendChild(span);
    });
    li.appendChild(typeDiv);

    li.classList.add("hidden");
    container.appendChild(li);
  });
}
