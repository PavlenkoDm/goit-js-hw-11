const e={form:document.querySelector("#search-form"),gallery:document.querySelector(".gallery"),buttonLoadMore:document.querySelector(".load-more")},o={key:"34323245-7786a126c6836dc3f9fefa48e",perPage:40,imageType:"photo",orientation:"horizontal",safesearch:!0};e.form.addEventListener("submit",(function(e){e.preventDefault();const t=e.currentTarget.elements[0].value.trim();t||async function(e,o,t){try{const{key:a,perPage:n,imageType:r,orientation:c,safesearch:i}=e,s=await fetch(`https://pixabay.com/api/?key=${a}&q=${o}&page=${t}&per_page=${n}&image_type=${r}&orientation=${c}&safesearch=${i}`),l=await s.json();console.log(l)}catch(e){console.log(e)}}(o,t,1)})),e.buttonLoadMore.addEventListener("click",(function(e){console.log(e)}));
//# sourceMappingURL=index.e7c1dcca.js.map
