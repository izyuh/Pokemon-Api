let url = "https://pokeapi.co/api/v2/pokemon/";
const container = document.getElementById("pokemon-list");
const button = document.getElementById("load");

const pokemonCountSpan = document.getElementById("pokemon-count");
let count = 0;
let pokemonCount = 0;

const typeMap = new Map([
  ["normal", "gray"],
  ["fighting", "orange"],
  ["flying", "lightblue"],
  ["poison", "purple"],
  ["ground", "brown"],
  ["rock", "gray"],
  ["bug", "green"],
  ["ghost", "purple"],
  ["steel", "silver"],
  ["fire", "red"],
  ["water", "blue"],
  ["grass", "green"],
  ["electric", "yellow"],
  ["psychic", "pink"],
  ["ice", "lightblue"],
  ["dragon", "darkblue"],
  ["dark", "black"],
  ["fairy", "pink"],
]);

async function fetchData() {
  if (button.innerHTML === "Fetch") {
    button.innerHTML = "Load More";
  }

  const response = await fetch(url);
  const data = await response.json();
  const pokemons = data.results;

  // Fetch detailed data for each Pokémon
  const detailedData = await Promise.all(
    pokemons.map(async (pokemon) => {
      const pokemonResponse = await fetch(pokemon.url); // Fetch individual Pokémon data
      console.log(pokemonResponse);
      return pokemonResponse.json(); // Return the detailed data
    })
  );

  // Process the detailed data
  detailedData.forEach((pokemon) => {
    const a = document.createElement("a");
    a.href = pokemon.url;
    a.target = "_blank"; // Open in new tab
    const li = document.createElement("li");

    // Set name to h3
    const capitalizedName =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    li.innerHTML = `<h3>${capitalizedName}</h3>`;

    // Add picture
    const img = document.createElement("img");
    img.src = pokemon.sprites.front_default; // Use the sprite URL from the detailed data
    li.appendChild(img);

    //add type
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

    // Add to list and make hidden
    li.classList.add("hidden"); // Add hidden class initially
    a.appendChild(li);
    container.appendChild(a);
    pokemonCount++;
    pokemonCountSpan.innerHTML = `${pokemonCount}`;
  });

  // Handle pagination
  if (data.next) {
    if (count < 9) {
      count++;
      url = data.next;
      fetchData();
    } else {
      url = data.next;
      count = 0;
    }
  }

  return data;
}
