let url = "https://pokeapi.co/api/v2/pokemon/";
const container = document.getElementById("pokemon-list");
const button = document.getElementById("load");
const search = document.getElementById("search");
let debounceTimeout;



// pokemon type color map
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

// Gets data from localStorage if available
const savedData = localStorage.getItem("rawPokemon") //gets data from localStorage if there is any
  ? JSON.parse(localStorage.getItem("rawPokemon"))
  : [];
let pokemons;

let batchSize = 30;
let start = 0;
let end = start + batchSize;

let renderBatch = savedData.slice(start, end);

// Search function event listener
search.addEventListener("input", (e) => {

   clearTimeout(debounceTimeout);
   debounceTimeout = setTimeout(() => {
    filter(e.target.value);
  }, 500); // 700ms delay
});

// Search function
function filter(input) {
  if (input.trim() === "") {
    container.innerHTML = "";
    render(renderBatch); // Render the current batch if search is cleared
    return;
  }

  const filtered = savedData.filter(pokemon =>
    pokemon.name.toLowerCase().includes(input.toLowerCase().trim())
  );
  container.innerHTML = ""; // Clear the list
  render(filtered);         // Render only filtered Pokémon
};


// Fetch data from local storage if there is any
async function fetchData() {savedData.length === 0 ? await fetchApi() : render(renderBatch);} //renders from localStorage or fetches from API

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

  if (data.next) {
    url = data.next;
    await fetchApi();
  } 
    button.style.display = "none";
    render(renderBatch);
}


// General render function for both batch and all
function render(renderBatch) {
  search.style.transform = "translatey(60%)"; // show search bar
  console.log(renderBatch);

  renderBatch.forEach((pokemon) => {
    const li = document.createElement("li"); //creates li for each pokemon

    const id = document.createElement("span"); //creates span for pokemon number
    id.classList.add("id");
    id.textContent =
      pokemon.id < 100
        ? pokemon.id.toString().padStart(3, "0")
        : pokemon.id.toString();
    li.appendChild(id);

    const capitalizeName = // Capitalizes first letter and creates h3 for name
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const nameHTML = document.createElement("h3"); 
    nameHTML.innerHTML = capitalizeName;
    li.appendChild(nameHTML);

    const img = document.createElement("img"); // creates img for sprite
    img.loading = "lazy"; // Native lazy loading
    img.src = pokemon.sprite ? pokemon.sprite : "pokeball.png";
    li.appendChild(img);

    const typeDiv = document.createElement("div"); // creates div for types 
    const types = pokemon.types.map((typeObj) =>{
      return typeObj.type.name;
    });
    types.forEach((type) => { 
      const span = document.createElement("span");
      span.style.backgroundColor = typeMap.get(type);
      span.innerHTML = type.charAt(0).toUpperCase() + type.slice(1);
      typeDiv.appendChild(span);
    });
    li.appendChild(typeDiv);
    container.appendChild(li);
  })};

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && end < savedData.length && search.value.trim() === "") {
    start += batchSize;
    end = start + batchSize;
    const nextBatch = savedData.slice(start, end);
    render(nextBatch);
  }
});