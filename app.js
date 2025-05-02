let url = "https://pokeapi.co/api/v2/pokemon/";
const container = document.getElementById("pokemon-list");
const button = document.getElementById("load");

const search = document.getElementById("search");

let count = 1;

let storedData = localStorage.getItem("pokemonData"); //gets data from local storage
let allPokemonData = storedData ? JSON.parse(storedData) : []; // if data, then convert to json, else empty array

const typeMap = new Map([
  ["normal", "gray"],
  ["fighting", "orange"],
  ["flying", "lightblue"],
  ["poison", "purple"],
  ["ground", "brown"],
  ["rock", "gray"],
  ["bug", "lightgreen"],
  ["ghost", "purple"],
  ["steel", "#5f646e"],
  ["fire", "red"],
  ["water", "blue"],
  ["grass", "green"],
  ["electric", "#fff700"],
  ["psychic", "#f25ae6"],
  ["ice", "lightblue"],
  ["dragon", "darkblue"],
  ["dark", "#0d2a45"],
  ["fairy", "#eda8f0"],
]);

async function fetchData() {
  const data = await fetch(url).then((response) => response.json()); // vvv fetches data
  const pokemons = data.results; // vvv
  const pokemonDetails = await Promise.all(
    //gets all details at the same time
    pokemons.map((pokemon) =>
      fetch(pokemon.url).then((response) => response.json())
    )
  );
  const sortedDetails = pokemonDetails.sort((a, b) => a.id - b.id); // sorts details by id

  sortedDetails.forEach((pokemon) => {
    const a = document.createElement("a");
    a.href = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
    a.target = "_blank"; // Open in new tab

    const li = document.createElement("li"); //creates li for each pokemon

    ////////////////////////////////////////////////////////add name////////////////////////////////////////////////////////
    const capitalizedName =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    li.innerHTML = `<h3>${capitalizedName}</h3>`; //capitalizes the first letter and adds to li

    ////////////////////////////////////////////////////////add image////////////////////////////////////////////////////////
    const img = document.createElement("img");
    img.src = pokemon.sprites.front_default; // Use the sprite URL from the detailed data
    li.appendChild(img); // adds image to li

    ////////////////////////////////////////////////////////add type////////////////////////////////////////////////////////
    const typeDiv = document.createElement("div"); //makes div for types
    const types = pokemon.types.map((type) => type.type.name); //loops through and sets types to pokemon types

    types.forEach((type) => {
      //for each type saved, create a span and capitalize the first letter
      const span = document.createElement("span");

      span.style.backgroundColor = typeMap.get(type); // Set background color based on type
      span.innerHTML = type.charAt(0).toUpperCase() + type.slice(1);
      typeDiv.appendChild(span); //add it to the div
    });
    li.appendChild(typeDiv);

    ////////////////////////////////////////////////////////hides card for animation////////////////////////////////////////////////////////
    // Add to list and make hidden
    li.classList.add("hidden"); // Add hidden class initially
    a.appendChild(li);

    container.appendChild(a);
  });

  search.style.transform = "translateY(150%)";

  // if (data.next) {
  //   url = data.next;
  //   fetchData();
  // } else {
  //   console.log("All data fetched");
  // }
}
