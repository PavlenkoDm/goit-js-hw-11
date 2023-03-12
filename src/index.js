import { Notify } from 'notiflix/build/notiflix-notify-aio';


const axios = require('axios').default;


//============================================== Cсылки на элементы ДОМ ============================================================//
const refs = {
    form: document.querySelector("#search-form"),
    gallery: document.querySelector(".gallery"),
    buttonLoadMore: document.querySelector(".load-more")
}



let currentPage = 1;
let userInput = "";
const itemsOnPage = 40;
let totalItems = 0;
let isActive = false;



//======================================================== Слушатели событий ============================================================//
refs.form.addEventListener("submit", onSubmit);
refs.buttonLoadMore.addEventListener("click", onLoadMore);




//====================================================== Функция обработчик по сабмиту ========================================================//
async function onSubmit(event) {
    event.preventDefault();
    if (isActive === true) return;
    toggleIsActiveProp(true);
    refs.gallery.innerHTML = "";
    totalItems = 0;
    
    userInput = event.currentTarget.elements[0].value.trim();
    if (!userInput) return;    

    const options = createUrlParameters(userInput, currentPage, itemsOnPage);
    const gotImages = await getImages(options);
    createMurkup(gotImages, totalItems);
    toggleIsActiveProp(false);
}


//=================================================Асинхронная функция обработчик по клику догрузки ========================================================//
async function onLoadMore(event) {
    event.preventDefault();
    if (isActive === true) return;
    toggleIsActiveProp(true);
    
    const options = createUrlParameters(userInput, currentPage, itemsOnPage);
    const gotImages = await getImages(options);
    createMurkup(gotImages, totalItems);
    toggleIsActiveProp(false);
}



//=================================================Асинхронная функция стягивания картинок =============================================//
async function getImages(urlOptions) {
    try {
        const response = await axios.get('https://pixabay.com/api/', urlOptions);
        return response.data;
    } catch (error) {
        toggleIsActiveProp(false);
        console.log(error.message);
        Notify.failure(error.message);
        return error;
    }
}



//==================================================Функция создания разметки ===========================================================//
function createMurkup(data, amounOfItemsOnPage) {
    if (!data.hasOwnProperty("totalHits")) return;

    refs.buttonLoadMore.classList.remove("hide");

    const { hits, totalHits } = data; 
    
    if (hits.length === 0) {
        console.log("Sorry, there are no images matching your search query. Please try again.");
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        onHideButtonLoadMore();
        return;
    }

    const galleryMurkup = hits.map((image) => {
        const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;
        return `<div class="photo-card">
                    <img src=${webformatURL} alt=${tags} loading="lazy" width=320 height=240 />
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

    if (amounOfItemsOnPage >= totalHits) {
            Notify.failure("We're sorry, but you've reached the end of search results.", {timeout: 5000});
            console.log("We're sorry, but you've reached the end of search results.");
            onHideButtonLoadMore();
        }
        
        currentPage += 1;
        totalItems = currentPage * itemsOnPage;
        
        return refs.gallery.insertAdjacentHTML("beforeend", galleryMurkup);

}


//============================================= Функция скрытия кнопки Загрузить больше =======================================//
function onHideButtonLoadMore() {
    refs.buttonLoadMore.classList.add("hide");
}



//============================================= Функция переключения состояния активности поиска =============================//
function toggleIsActiveProp(bool) {
    isActive = bool;
}



//==================================================== Функция создания объекта параметров запроса URL ================//
function createUrlParameters(inputValue, pageCurrent, amountOnPage) {
    return {
        params: {
        key: "34323245-7786a126c6836dc3f9fefa48e",
        q: inputValue,
        page: pageCurrent,
        per_page: amountOnPage,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
    }  
    }
}
