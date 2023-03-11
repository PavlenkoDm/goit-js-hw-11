

//Cсылки на элементы ДОМ
const refs = {
    form: document.querySelector("#search-form"),
    gallery: document.querySelector(".gallery"),
    buttonLoadMore: document.querySelector(".load-more")
}


// const URL = "https://pixabay.com/api/?key=34323245-7786a126c6836dc3f9fefa48e&q=inputValue&page=1&per_page=40&image_type=photo&orientation=horizontal&safesearch=true";
const urlOptions = {
    key: "34323245-7786a126c6836dc3f9fefa48e",
    perPage: 40,
    imageType: "photo",
    orientation: "horizontal",
    safesearch: true
}
let currentPage = 1;

//Слушатели событий
refs.form.addEventListener("submit", onSubmit);
refs.buttonLoadMore.addEventListener("click", onLoad);


//Функция обработчик по сабмиту
function onSubmit(event) {
    event.preventDefault();    
    const userInput = event.currentTarget.elements[0].value.trim();
    if(!userInput) 
    getImages(urlOptions, userInput, currentPage);
}


function onLoad(event) {
    console.log(event);
}


//Асинхронная функция стягивания картинок
async function getImages(searchUrlOptions, inputValue, currentPage) {
    try {
        const { key, perPage, imageType, orientation, safesearch } = searchUrlOptions;
        const response = await fetch(`https://pixabay.com/api/?key=${key}&q=${inputValue}&page=${currentPage}&per_page=${perPage}&image_type=${imageType}&orientation=${orientation}&safesearch=${safesearch}`);
        const images = await response.json();
        console.log(images);
        return images;
    } catch (error) {
        console.log(error);//Сюда поставить кастомное предупреждение
    }    
}

