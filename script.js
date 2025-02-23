const accessKey=window.API_KEY;
const searchForm =document.getElementById("search-form");
const searchBox =document.getElementById("search-box");
const searchResult=document.getElementById("searchResult");
const showMoreBtn =document.getElementById("show-more-btn");
const startButton = document.getElementById("startButton");
const recommendSection = document.getElementById('recommend');
const clearButton = document.getElementById("clearButton");
let keyword="";
let page=1;

async function searchImages(){
  
    keyword=searchBox.value;
    const url=`https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;

    const response =await fetch(url);
    const data=await response.json();
    //Refreshing the page
    if(page==1)
    {
        searchResult.innerHTML="";
    }
    const results =data.results;
    
    results.map((result) => {
        const image = document.createElement("img");
        image.src = result.urls.small;
        const imageLink = document.createElement("a");
        imageLink.href = result.links.html;
        imageLink.target = "_blank";

        imageLink.appendChild(image);
        searchResult.appendChild(imageLink);
    });
    showMoreBtn.style.display="block";
}
  
// Voice Recognition Setup (Web Speech API)
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false; // Stop after recognizing one phrase
    recognition.lang = 'en-US'; // Set the language to English
    recognition.interimResults = false; // No interim results, only final result

    // Start listening
    recognition.onstart = function () {
        console.log("Voice recognition started");
    };

    // Handle the result
    recognition.onresult = function (event) {
        const voiceResult = event.results[0][0].transcript;
        searchBox.value = voiceResult; // Set the voice input to the search box
        searchImages(); // Trigger the search with the voice input
    };

    // Error handling
    recognition.onerror = function (event) {
        console.error("Speech recognition error: ", event.error);
    };

    // Start voice search when the button is clicked
    startButton.addEventListener('click', function () {
        recognition.start(); // Start the speech recognition
        recommendSection.style.display='none';
    });
} else {
    console.log("Your browser doesn't support speech recognition.");
}

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault(); 
    page=1;
    searchImages();
})

showMoreBtn.addEventListener("click",()=>{
    page++;
    searchImages();
    recommendSection.style.display='none';
})
searchBox.addEventListener('input', function() {
    // If there is text in the search box, hide the recommendations
    if (searchBox.value.trim() !== '') {
        recommendSection.style.display = 'none';
    } else {
        recommendSection.style.display = 'block'; // Show recommendations when search box is empty
        showMoreBtn.style.display = 'none';
    }
});
clearButton.addEventListener('click', function() {
    // Clear the input field
    searchBox.value = '';

    // Hide search results and the "Show More" button
    searchResult.innerHTML = '';
    showMoreBtn.style.display = 'none';

    // Show the recommendation section again
    recommendSection.style.display = 'block';
});

