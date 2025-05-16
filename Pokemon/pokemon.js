document.addEventListener("DOMContentLoaded", () => {
  const id = localStorage.getItem("selectedID");
  let url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  const h1 = document.querySelector('h1');
  const hp = document.getElementsByClassName('hp');

  async function main() {
    const data = await fetch(url).then((res) => res.json());
    console.log(data);


  function renderCard() {
  h1.innerText = data.name;

  const health = data.stats[0].base_stat;
  hp.innerText = health;

  }
    renderCard();
  }

  main();


});
