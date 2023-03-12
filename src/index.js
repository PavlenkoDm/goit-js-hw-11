const axios = require('axios').default;


//Cсылки на элементы ДОМ
const refs = {
    form: document.querySelector("#search-form"),
    gallery: document.querySelector(".gallery"),
    buttonLoadMore: document.querySelector(".load-more")
}
// const URL = "https://pixabay.com/api/?key=34323245-7786a126c6836dc3f9fefa48e&q=inputValue&page=1&per_page=40&image_type=photo&orientation=horizontal&safesearch=true";
let currentPage = 1;
let userInput = "";

//Слушатели событий
refs.form.addEventListener("submit", onSubmit);
refs.buttonLoadMore.addEventListener("click", onLoad);


//Функция обработчик по сабмиту
function onSubmit(event) {
    event.preventDefault();    
    userInput = event.currentTarget.elements[0].value.trim();
    if(!userInput) return;
    const options = {        
        params: {
            key: "34323245-7786a126c6836dc3f9fefa48e",
            q: userInput,
            page: currentPage,
            per_page: 40,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
        }        
    }

    getImages(options).then((data) => {
        console.log(data.hits[0]);
        const { hits, totalHits } = data;
        if (hits.length === 0) console.log("Sorry, there are no images matching your search query. Please try again."); // It could be moved to getImages function
        const galleryMurkup = hits.map((image) => {
            const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;
            return `<div class="photo-card">
                        <img src=${webformatURL} alt=${tags} loading="lazy" />
                        <div class="info">
                            <p class="info-item">
                                <b>Likes</b>
                                ${likes}
                            </p>
                            <p class="info-item">
                                <b>Views</b>
                                ${views}
                            </p>
                            <p class="info-item">
                                <b>Comments</b>
                                ${comments}
                            </p>
                            <p class="info-item">
                                <b>Downloads</b>
                                ${downloads}
                            </p>
                        </div>
                    </div>`;
        }).join(" ");
        return refs.gallery.innerHTML = galleryMurkup;
        //totalHits
    });

}


function onLoad(event) {
    console.log(event);
}


//Асинхронная функция стягивания картинок
async function getImages(urlOptions) {
    try {
        const response = await axios.get('https://pixabay.com/api/', urlOptions);
        return response.data;
    } catch (error) {
        console.log(error.status);//Сюда поставить кастомное предупреждение
    }    
}

//===========================================================================================================================================//

// async function fetchAndMurkup(optionsToURL, ) {

// }