const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");


const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

//intially 
let currentTab= userTab;
const API_KEY="5f7925574aec80973b8edd6fc7c20814";//from open weather api
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab!=currentTab)//that means user wants to change the tab
    {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {   //is search form container invisible
        
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else{
            //I was previously on search tab , now i want to go to the your weather tab
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //Now i am in your weather tab
            //so weather to be displayed
            //so we have to check local storage first
            //for coordinates , if we have saved them there
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click',()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if coordinates are already present in session storage
//sessionStorage is a built-in Web API that lets you store key-value pairs for the duration of the browser tab
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        //if local coordinates not found ask for location access 
        grantAccessContainer.classList.add("active");
    }

    else{
       let coordinates= JSON.parse(localCoordinates);//converts json string to json object
       fetchUserWeatherInfo(coordinates); //function to make API call using the coordinates obtained from sessionStorage.getItem()
    }

}


//When user coords are present data is fetched and rendered
async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon}=coordinates;
    //make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API call

    try{
        const res= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await res.json();


        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        //render
        renderWeatherInfo(data);
    }

    catch(err){
        loadingScreen.classList.remove("active");
        //Home work
    }
}

//when coords of user not previously present
//go to grant access
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);

function getLocation(){
    //To check if geolocation api facility is available or not for current location
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    else{
        //HW-Show alert for no geolocation available
        alert("No geolocation available....");
    }
}

function showPosition(position){
    const userCoordinates={
      lat:position.coords.latitude,
      lon:position.coords.longitude
    };

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));//converts to string
    fetchUserWeatherInfo(userCoordinates);//scroll up to watch the function
}


function renderWeatherInfo(weatherInfo){

    //firstly we have to fetch the elements

    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");//for temperature
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    //fetch values from weather info object and put in UI elements
    cityName.innerText=weatherInfo?.name;
    //flag icon
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;


}


let searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (ev)=>{
    ev.preventDefault();
    let cityName=searchInput.value;
    if(cityName === "") return;

    else
    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active");

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }

    catch(err){

    }
}
