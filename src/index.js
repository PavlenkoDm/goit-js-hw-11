import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './refs/reference';
import { getImages } from './api/get-images';
import 'simplelightbox/dist/simple-lightbox.min.css';


let currentPage = 1;
let userInput = "";
const itemsOnPage = 40;
let totalItems = 0;
let isActive = false;

const lightbox = new SimpleLightbox(".gallery a", {captionDelay: 300, captionsData: "alt"});



//=== СЛУШАТЕЛИ СОБЫТИЙ ============================================================//
refs.form.addEventListener("submit", onSubmit);
refs.buttonLoadMore.addEventListener("click", onLoadMore);



//=== АСИНХРОННАЯ ФУНКЦИЯ-ОБРАБОТЧИК ПО SUBMIT ========================================//
async function onSubmit(event) {
    event.preventDefault();
    if (isActive) return;
    toggleIsActiveProp(true);
    refs.gallery.innerHTML = "";
    totalItems = 0;
    currentPage = 1;
    
    userInput = event.currentTarget.elements.searchQuery.value.trim();

    if (!userInput) return;    

    try {
        const options = createUrlParameters(userInput, currentPage, itemsOnPage);
        const gotImages = await getImages(options);
        createMurkup(gotImages, totalItems);
    } catch (error) {
        console.log(error.message);
        Notify.failure(error.message);
    }
    toggleIsActiveProp(false);
}


//=== АСИНХРОННАЯ ФУНКЦИЯ-ОБРАБОТЧИК ПО КЛИКУ НА КНОПКУ ДОГРУЗКИ ИЗОБРАЖЕНИЙ ================//
async function onLoadMore(event) {
    event.preventDefault();
    if (isActive) return;
    toggleIsActiveProp(true);
    
    try {
        const options = createUrlParameters(userInput, currentPage, itemsOnPage);
        const gotImages = await getImages(options);
        createMurkup(gotImages, totalItems);
    } catch (error) {
        console.log(error.message);
        Notify.failure(error.message);
    }
    toggleIsActiveProp(false);
}



//=== ФУНКЦИЯ СОЗДАНИЯ РАЗМЕТКИ ===========================================================//
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

    if (hits.length < itemsOnPage) {
        onHideButtonLoadMore();
    }

    const galleryMurkup = hits.map((image) => {
        const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;
        return `<div class="photo-card">
                    <a href="${largeImageURL}">
                        <img src="${webformatURL}" alt="${tags}" title="" loading="lazy" width=320 height=240 />
                    </a>
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
        }).join("");

    if (amounOfItemsOnPage >= totalHits) {
            Notify.failure("We're sorry, but you've reached the end of search results.", {timeout: 5000});
            console.log("We're sorry, but you've reached the end of search results.");
            onHideButtonLoadMore();
        }
        
    currentPage += 1;
    totalItems = currentPage * itemsOnPage;
        
    return refs.gallery.insertAdjacentHTML("beforeend", galleryMurkup);

}


//=== ФУНКЦИЯ СКРЫТИЯ КНОПКИ ЗАГРУЗИТЬ БОЛЬШЕ =======================================//
function onHideButtonLoadMore() {
    refs.buttonLoadMore.classList.add("hide");
}



//=== ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ СОСТОЯНИЯ ПОИСКА(АКТИВНЫЙ, НЕАКТИВНЫЙ) =============================//
function toggleIsActiveProp(bool) {
    isActive = bool;
}



//=== ФУНКЦИЯ СОЗДАНИЯ ОБЪЕКТА НАСТРОЙКИ URL ЗАПРОСА ================//
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


