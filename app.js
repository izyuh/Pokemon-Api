let url = "https://pokeapi.co/api/v2/pokemon/";
const container = document.getElementById("pokemon-list");
const button = document.getElementById("load");

const pokemonCountSpan = document.getElementById("pokemon-count");
let count = 0;
let pokemonCount = 0;

async function fetchData() {
  if (button.innerHTML === "Fetch") {
    button.innerHTML = "Load More";
  }

  const response = await fetch(url);
  const data = await response.json();
  const pokemons = data.results;
  

  console.log(pokemons);

  pokemons.map((pokemon) => {

    const a = document.createElement("a");
    a.href = pokemon.url;
    a.target = "_blank"; // Open in new tab
    const li = document.createElement("li");

    //sets name to h3
    const capitalizedName =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    li.innerHTML = `<h3>${capitalizedName}</h3>`;

    //adds picture 
    const img = document.createElement("img");
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonCount + 1}.png`;
    li.appendChild(img);

    //adds to list and makes hidden
    li.classList.add("hidden"); // Add hidden class initially
    a.appendChild(li);
    container.appendChild(a);
    pokemonCount++;
    pokemonCountSpan.innerHTML = `${pokemonCount}`;
  });


  if(data.next) {
    if(count < 9) {
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



