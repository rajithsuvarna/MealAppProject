//array to store favorite meal's id
let favorite = [];

//initializing the elements fro dom
const itemList = document.getElementById("Meal-List");
const randombutton = document.getElementById("random");
const favouritebutton = document.getElementById("favourite");
const searchInput = document.getElementById("search");
const icon = document.getElementById("icon");
let URL;

//to inialize the local storage
if (!localStorage.getItem("favorite")) {
  localStorage.setItem("favorite", JSON.stringify(favorite));
} else {
  favorite = JSON.parse(localStorage.getItem("favorite"));
}

//to fetch data from api for search result
async function fetchDataFromApi(URL) {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    renderList(data);
  } catch (error) {
    console.log("error", error);
  }
}

//to add details to dom
function addToDomfordetails(meal) {
  itemList.innerHTML = `
  <div id="details-container">
  <h1>${meal.strMeal}</h1>
  <hr/>
  <small id="modal-img-text-container">
    <img src="${meal.strMealThumb}" class="meal-image details-image" />
    <span id="details-span">
      <span id="main-details">
        <p>Category</p>
        <p>Cuisine</p>
      </span>
      <span>
        <p>: ${meal.strCategory}</p>
        <p>: ${meal.strArea}</p>
      </span>
    </span>
  </small>
  <p id="instruction-text">${meal.strInstructions}</p>
  <hr/>
  <div class="footer">
    <a href="${meal.strYoutube}"><button type="button" 
      class="btn btn-danger"
    >YouTube</button></a>
  </div>
  </div>
`;
}

//to renderthe details
function renderDetails(data) {
  itemList.innerHTML = "";
  for (let meals of data.meals) {
    addToDomfordetails(meals);
  }
}

//to fetch Data From Api for Details
async function fetchDataFromApiforDetails(URL) {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    renderDetails(data);
  } catch (error) {
    console.log("error", error);
  }
}

//to show the meal details
function showMealDetails(dataid) {
  URL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${dataid}`;
  fetchDataFromApiforDetails(URL);
}

//to toggle the favorites
function toggleFavorites(id) {
  let icon = document.getElementById(`icon-${id}`);
  let index = favorite.indexOf(id);
  if (index == -1) {
    favorite.push(id);
    icon.classList.add("clicked");
  } else {
    favorite.splice(index, 1);
    icon.classList.remove("clicked");
  }
  console.log(favorite);
  localStorage.setItem("favorite", JSON.stringify(favorite));
}

//for adding meal to dom
function addToDom(meal) {
  const div = document.createElement("div");
  div.setAttribute("data-id", `${meal.idMeal}`);
  div.innerHTML = `
  <div class="div-container">
    <img src="${meal.strMealThumb}" class="meal-image"  id='${meal.idMeal}' />
    <p>${meal.strMeal}</p>;
    <span id="details-container">
      <button type="button"
      class="btn m-auto btn-danger"
      onclick="showMealDetails(${meal.idMeal})">More Details</button>
      <button class="button-icon" id="${
        meal.idMeal
      }" onclick="toggleFavorites(${meal.idMeal})">
      ${
        favorite.includes(Number(meal.idMeal))
          ? `<i  class="fa-solid fa-heart icon clicked" id="icon-${meal.idMeal}"></i>`
          : `<i  class="fa-solid fa-heart icon" id="icon-${meal.idMeal}"></i>`
      }
      </button>
      
    </span>
    </div>
    `;
  itemList.append(div);
}

//for rendering the search results from data object
function renderList(data) {
  itemList.innerHTML = "";
  for (let meals of data.meals) {
    addToDom(meals);
  }
}

//for displaying the search meals
function displaySearchResults() {
  let keyword = searchInput.value;
  URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`;
  fetchDataFromApi(URL);
}

//for displaying the random meal result
function displayRandomResults() {
  URL = `https://www.themealdb.com/api/json/v1/1/random.php`;
  fetchDataFromApi(URL);
}

//for displaying thefavourite meals
async function displayFavoriteMeals() {
  itemList.innerHTML = "";

  if (favorite.length > 0) {
    for (let id of favorite) {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      let meal = data.meals[0];
      addToDom(meal);
    }
  } else {
    itemList.innerHTML = `<div><h1>No Favorites</h1></div>`;
  }
}

//adding event listeners
randombutton.addEventListener("click", displayRandomResults);
searchInput.addEventListener("input", displaySearchResults);
favouritebutton.addEventListener("click", displayFavoriteMeals);
