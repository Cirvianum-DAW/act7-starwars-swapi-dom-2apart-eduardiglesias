import swapi from './swapi.js';

//Exemple d'inicialització de la llista de pel·lícules. Falten dades!
export async function setMovieHeading(movieId, titleSelector, infoSelector, directorSelector) {
  try {
    // Obtenim els elements del DOM amb `querySelector` i els emmagatzemem en una variable
    const titleElement = document.querySelector(titleSelector);
    const infoElement = document.querySelector(infoSelector);
    const directorElement = document.querySelector(directorSelector);

    // Obtenim la informació de la pel·lícula cridant al mètode de `swapi.js`
    const movieInfo = await swapi.getMovieInfo(movieId);

    // Substituïm les dades fent servir un mètode de reemplaçament com `innerHTML`
    titleElement.innerHTML = movieInfo.name;
    infoElement.innerHTML = `Episodi ${movieInfo.episodeID} - ${movieInfo.release}`;
    directorElement.innerHTML = `Director: ${movieInfo.director}`;
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function initMovieSelect(selector) {
  try {
    // Obtenim l'element del DOM corresponent al selector de pel·lícules
    const selectElement = document.querySelector(selector);

    // Obtenim la llista de pel·lícules ordenades utilitzant listMoviesSorted() de swapi.js
    const movies = await swapi.listMoviesSorted();

    // Creem una opció inicial "Selecciona una pel·lícula"
    const initialOption = document.createElement('option');
    initialOption.value = '';
    initialOption.textContent = 'Selecciona una pel·lícula';

    // Afegim la opció inicial al selector de pel·lícules
    selectElement.appendChild(initialOption);

    // Recorrem les pel·lícules i afegim cada una com una opció al selector
    movies.forEach((movie) => {
      const option = document.createElement('option');
      // option.value = movie.episodeID; // Opció valor és l'ID de l'episodi
      option.textContent = `${movie.name} - Episodi ${movie.episodeID}`; // Opció text és el nom de la pel·lícula
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

function deleteAllCharacterTokens() {}

// EVENT HANDLERS //

function addChangeEventToSelectHomeworld() {}

async function _createCharacterTokens() {}

function _addDivChild(parent, className, html) {}

function setMovieSelectCallbacks() {}

async function _handleOnSelectMovieChanged(event) {}

function _filmIdToEpisodeId(episodeID) {}

// "https://swapi.dev/api/films/1/" --> Episode_id = 4 (A New Hope)
// "https://swapi.dev/api/films/2/" --> Episode_id = 5 (The Empire Strikes Back)
// "https://swapi.dev/api/films/3/" --> Episode_id = 6 (Return of the Jedi)
// "https://swapi.dev/api/films/4/" --> Episode_id = 1 (The Phantom Menace)
// "https://swapi.dev/api/films/5/" --> Episode_id = 2 (Attack of the Clones)
// "https://swapi.dev/api/films/6/" --> Episode_id = 3 (Revenge of the Sith)

let episodeToMovieIDs = [
  { m: 1, e: 4 },
  { m: 2, e: 5 },
  { m: 3, e: 6 },
  { m: 4, e: 1 },
  { m: 5, e: 2 },
  { m: 6, e: 3 },
];

function _setMovieHeading({ name, episodeID, release, director }) {}

function _populateHomeWorldSelector(homeworlds) {}

/**
 * Funció auxiliar que podem reutilitzar: eliminar duplicats i ordenar alfabèticament un array.
 */
function _removeDuplicatesAndSort(elements) {
  // Al crear un Set eliminem els duplicats
  const set = new Set(elements);
  // tornem a convertir el Set en un array
  const array = Array.from(set);
  // i ordenem alfabèticament
  return array.sort(swapi._compareByName);
}

const act7 = {
  setMovieHeading,
  setMovieSelectCallbacks,
  initMovieSelect,
  deleteAllCharacterTokens,
  addChangeEventToSelectHomeworld,
};

export default act7;
