let url = "https://pokeapi.co/api/v2/pokemon/";
const container = document.getElementById("pokemon-list");
const button = document.getElementById("load");
const search = document.getElementById("search");

let count = 1;

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

const savedData = localStorage.getItem("rawPokemon")
  ? JSON.parse(localStorage.getItem("rawPokemon"))
  : [];
let pokemons;
////////////////////////////////////////////   All set functions above   ////////////////////////////////////////////////

// search function //
search.addEventListener("input", (e) => filter(e.target.value));

function filter(input) {
  const li = document.querySelectorAll("li");
  li.forEach((item) => {
    const parent = item.parentElement; // Get the parent <a> element
    if (item.textContent.toLowerCase().includes(input.toLowerCase().trim())) {
      parent.style.display = "block"; // Show the parent <a> tag
    } else {
      parent.style.display = "none"; // Hide the parent <a> tag
    }
  });
}

// fetch data from local storage if there is any //
async function fetchData() {
  if (savedData.length === 0) {
    fetchA();
  } else {
    renderPokemon();
  }

  async function fetchA() {
    const data = await fetch(url).then((res) => res.json());
    pokemons = data.results; //gets initial data

    const pokemonDetails = await Promise.all(
      pokemons.map((pokemon) => fetch(pokemon.url).then((res) => res.json())) //gets detailed data
    );

    let iDetails = pokemonDetails.map((pokemon) => ({
      name: pokemon.name,
      id: pokemon.id,
      sprite: pokemon.sprites.front_default || "pokeball.png",
      types: pokemon.types,
    }));

    savedData.push(...iDetails); // pushes details to variable to save
    localStorage.setItem("rawPokemon", JSON.stringify(savedData));
    renderBatch(iDetails);

    if (data.next) {
      url = data.next;
      fetchA();
    }
  }
}

function renderBatch(item) {
  item.forEach((pokemon) => {
    const a = document.createElement("a");
    a.href = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
    a.target = "_blank"; // Open in new tab

    const li = document.createElement("li"); //creates li for each pokemon

    ////////////////////////////////////////////////////////add id////////////////////////////////////////////////////////

    const id = document.createElement("span");
    id.classList.add("id");
    if (pokemon.id < 100) {
      id.textContent = pokemon.id.toString().padStart(3, "0");
    } else {
      id.textContent = pokemon.id.toString();
    }
    li.appendChild(id);

    ////////////////////////////////////////////////////////add name////////////////////////////////////////////////////////
    const capitalizedName =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    const nameHTML = document.createElement("h3");
    nameHTML.innerHTML = capitalizedName;
    li.appendChild(nameHTML);

    ////////////////////////////////////////////////////////add image////////////////////////////////////////////////////////
    const img = document.createElement("img");
    img.src = pokemon.sprite; // Use the sprite URL from the detailed data
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
}

function renderPokemon() {
  rawPokemon = JSON.parse(localStorage.getItem("rawPokemon"));
  rawPokemon.forEach((pokemon) => {
    const a = document.createElement("a");
    a.href = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
    a.target = "_blank"; // Open in new tab

    const li = document.createElement("li"); //creates li for each pokemon

    ////////////////////////////////////////////////////////add id////////////////////////////////////////////////////////

    const id = document.createElement("span");
    id.classList.add("id");
    id.textContent = pokemon.id.toString();
    if (pokemon.id < 100) {
      id.textContent = pokemon.id.toString().padStart(3, "0");
    }
    li.appendChild(id);

    ////////////////////////////////////////////////////////add name////////////////////////////////////////////////////////
    const capitalizedName =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    const nameHTML = document.createElement("h3");
    nameHTML.innerHTML = capitalizedName;
    li.appendChild(nameHTML);

    ////////////////////////////////////////////////////////add image////////////////////////////////////////////////////////
    const img = document.createElement("img");
    img.src = pokemon.sprite; // Use the sprite URL from the detailed data
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
}
