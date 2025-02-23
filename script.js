const searchForm =document.getElementById("search-form");
const searchBox =document.getElementById("search-box");
const searchResult=document.getElementById("searchResult");
const showMoreBtn =document.getElementById("show-more-btn");
const startButton = document.getElementById("startButton");
const recommendSection = document.getElementById('recommend');
const clearButton = document.getElementById("clearButton");
let keyword="";
let page=1;

async function searchImages() {
    keyword = searchBox.value.trim(); // Trim spaces to prevent accidental empty search

     // Call Netlify function instead of Unsplash directly
    const url = `/.netlify/functions/fetchImages?query=${keyword}&page=${page}&per_page=12&cacheBust=${Date.now()}`;

    try {
        const response = await fetch(url);

        // Handle API errors properly
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Check if results exist before using them
        if (!data.results || data.results.length === 0) {
            alert(`No results found for "${keyword}". Try another search!`); // Show alert
            searchResult.innerHTML = `<p>No results found for "${keyword}".</p>`;
            showMoreBtn.style.display = "none";
            return;
        }

        //Refresh results only for a new search
        if (page === 1) {
            searchResult.innerHTML = "";
        }

        // Loop through API results and display images
        data.results.forEach((result) => {
            const image = document.createElement("img");
            image.src = result.urls.small;
            const imageLink = document.createElement("a");
            imageLink.href = result.links.html;
            imageLink.target = "_blank";

            imageLink.appendChild(image);
            searchResult.appendChild(imageLink);
        });

        // Always show "Show More" unless there are 0 images
        showMoreBtn.style.display = data.results.length > 0 ? "block" : "none";

    } catch (error) {
        alert("Something went wrong. Please try again later!"); // how alert for errors
        searchResult.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
}


// Voice Recognition Setup (Web Speech API)
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false; // Stop after recognizing one phrase (can change to true if needed)
    recognition.lang = 'en-US'; // Set the language to English
    recognition.interimResults = false; // No interim results, only final result

    // Show feedback when listening starts
    recognition.onstart = function () {
        alert("Listening... Speak now! 🎤");
    };

    // Handle the recognized speech result
    recognition.onresult = function (event) {
        const voiceResult = event.results[0][0].transcript;
        searchBox.value = voiceResult; // set voice input to the search box
        searchImages(); // Trigger search automatically
    };

    // Error handling with alerts
    recognition.onerror = function (event) {
        alert("Speech recognition error: " + event.error);
    };

    // Start voice search when the button is clicked
    startButton.addEventListener('click', function () {
        recognition.start(); // Start speech recognition
        recommendSection.style.display = 'none'; // Hide recommendations
    });

} else {
    alert("Your browser doesn't support speech recognition. ❌"); // Show alert instead of console log
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
    //clear the input field
    searchBox.value = '';

    //Reset keyword & page number to default
    keyword = '';
    page = 1;

    //Hide search results and the "Show More" button
    searchResult.innerHTML = '';
    showMoreBtn.style.display = 'none';

    // Show the recommendation section again
    recommendSection.style.display = 'block';
    //Prevent accidental API calls
    stopAPICall = true;
});


