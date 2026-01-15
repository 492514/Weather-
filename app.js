const input = document.querySelector(".search input");
const alertbox = document.querySelector(".alert");
const Searchbtn = document.querySelector(".search button");
const Weatherimg = document.querySelector(".weather img");
const Temperature = document.querySelector(".weather h1");
const City = document.querySelector(".weather h2");
const Seassion = document.querySelector(".weather p");
const humidity = document.querySelector(".details .card h3");
const WindSpeed = document.querySelector(".wind");
const Sunrise = document.querySelector(".risetime");
const Sunset = document.querySelector(".settime");
const weatherapp = document.querySelector(".backvideo");
const Pressure = document.querySelector(".pressure");
const Visibility = document.querySelector(".visibility");

// Day Loading Bar
const sunSection = document.querySelector(".sun-section")
const sunLine = document.querySelector(".sun-line");
const sunIndicator = document.querySelector(".sun-indicator");
const dayRise = document.querySelector(".day-rise")
const daySet = document.querySelector(".day-set")

// Night Loading Bar
const nightSection = document.querySelector(".night-container")
const nightLine = document.querySelector(".night-line");
const nightIndicator = document.querySelector(".night-indicator");
const nightRise = document.querySelector(".night-rise")
const nightSet = document.querySelector(".night-set")

const errorBox = document.getElementById("errorBox");

function convertTime(unix) {
    let date = new Date(unix * 1000);
    let h = date.getHours();
    let m = date.getMinutes();
    let ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    m = m < 10 ? "0" + m : m;
    return `${h}:${m} ${ampm}`;
}

function showError(massage) {
  errorBox.querySelector(".error-text").textContent = massage;
  errorBox.classList.add("show");

  setTimeout(() => {
    errorBox.classList.remove("show");
  }, 3000);
}

async function weather(city){

try{
    let rawdata  = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=83c6c5f9c9ca033e443730d50b128625`);
 if(!rawdata.ok){
    showError("City Not Found!!")
      throw new Error("Somthing went wrong");  
    }else{ 

let realdata = await rawdata.json();

function imageRendering(){
    if (realdata.main.temp <= 0){
    Weatherimg.src = "./images/snow.png"
}else if( realdata.weather[0].description === "clear sky"){
     Weatherimg.src = "./images/clearweather.png"
     
}else{
    Weatherimg.src = "./images/sunnyweather.png"
    
}
}


function daynight(){
    const sunrise = realdata.sys.sunrise * 1000;
const sunset = realdata.sys.sunset * 1000;

let currenttime = Date.now();


const eveningStart = sunset - (2 * 60 * 60 * 1000);


if(currenttime >= sunrise && currenttime < eveningStart){
    weatherapp.src = "./images/clearweather.mp4"
}else if(currenttime >= eveningStart && currenttime < sunset){
 weatherapp.src = "./images/sunsetvideo.mp4"
}else{
    weatherapp.src = "./images/nightsky2.mp4"
}
}

function getCityTime(realdata) {
  const localOffset = new Date().getTimezoneOffset() * 60000;
  return Date.now() + localOffset + realdata.timezone * 1000;
}

function toCityTime(unix, timezone) {
  const localOffset = new Date().getTimezoneOffset() * 60000;
  return unix * 1000 + localOffset + timezone * 1000;
}


function submitDetail(){
Temperature.textContent = Math.floor(realdata.main.temp) + `°C`;
City.textContent = realdata?.name
  ? realdata.name + (realdata?.sys?.country ? " " + realdata.sys.country : "")
  : "";
Seassion.textContent = realdata.weather[0].description;
humidity.textContent = realdata.main.humidity + `%`;
let mph = (realdata.wind.speed *  2.23694).toFixed(2);

WindSpeed.textContent = mph + 'mph';
Pressure.textContent = realdata.main.pressure +" "+ 'hPa'
let vision = realdata.visibility;
let km = vision / 1000;
Visibility.textContent = km +" "+"km"
Sunrise.textContent = convertTime(realdata.sys.sunrise);

Sunset.textContent = convertTime(realdata.sys.sunset);
}

function dayLoading(realdata, curr, sunrise, sunset){
dayRise.textContent = convertTime(realdata.sys.sunrise )
daySet.textContent = convertTime(realdata.sys.sunset)


if(curr <= sunrise){
 sunLine.style.width = "0%" 
 sunIndicator.style.left = '0%'
}else if(curr >= sunset){
sunLine.style.width = "100%" 
sunIndicator.style.left = '100%'
}
else{
    let total = sunset - sunrise;
    let passed = curr - sunrise
    let per = (passed / total) * 100;
    
    let p = Math.floor(per)
    console.log(p)
     sunLine.style.width = p + '%' 
     sunIndicator.style.left = p + '%'
}
}

function nightLoading(realdata, curr, sunrise, sunset) {
  nightSet.textContent = convertTime(realdata.sys.sunrise )
nightRise.textContent = convertTime(realdata.sys.sunset)

 
  console.log(curr)


  const isNight = curr < sunrise || curr > sunset;


  if (!isNight) {
   
    nightLine.style.width = "0%";
    nightIndicator.style.left = "0%";
    return;
  }

  
 if (sunset < sunrise) {
  sunset += 24 * 60 * 60 * 1000;
}

let nightStart = sunset;
let nightEnd   = sunrise + 24 * 60 * 60 * 1000;

if (curr < sunrise) {
  curr += 24 * 60 * 60 * 1000;
}

let percent = ((curr - nightStart) / (nightEnd - nightStart)) * 100;
percent = Math.min(Math.max(percent, 0), 100);

nightLine.style.width = percent + "%";
nightIndicator.style.left = percent + "%";
;
}

function toggleDayNight(realdata) {

  const curr = getCityTime(realdata);

  const sunrise = toCityTime(realdata.sys.sunrise, realdata.timezone);
  const sunset  = toCityTime(realdata.sys.sunset, realdata.timezone);

  const isNight = curr > sunset || curr < sunrise;

  sunSection.classList.add("hidden");
  nightSection.classList.add("hidden");

  if (isNight) {
    nightSection.classList.remove("hidden");
    nightLoading(realdata, curr, sunrise, sunset);
  } else {
    sunSection.classList.remove("hidden");
    dayLoading(realdata, curr, sunrise, sunset);
  }
}


imageRendering()
daynight()
toggleDayNight(realdata)
submitDetail()

    }
    
}

catch(err){
    console.log(err.message)
}

}

document.addEventListener("DOMContentLoaded",function(){
    input.focus();
    let savecity = localStorage.getItem("city");
    if(savecity){
        weather(savecity);
    }
})

Searchbtn.addEventListener("click",function(){
if(input.value === "" ){
  showError("Enter City!!")
}else{
        localStorage.setItem("city",input.value)
weather(input.value)
input.value  = "";

}

})

input.addEventListener("keydown",function(e){
if(e.key === "Enter"){
 Searchbtn.click();
}
})








