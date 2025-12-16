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



function convertTime(unix) {
    let date = new Date(unix * 1000);
    let h = date.getHours();
    let m = date.getMinutes();
    let ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    m = m < 10 ? "0" + m : m;
    return `${h}:${m} ${ampm}`;
}

async function weather(city){
try{
    let rawdata  = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=83c6c5f9c9ca033e443730d50b128625`);
 if(!rawdata.ok){
      throw new Error("Somthing went wrong");
    }
let realdata = await rawdata.json();

if (realdata.main.temp <= 0){
    Weatherimg.src = "./images/snow.png"
}else if( realdata.weather[0].description === "clear sky"){
     Weatherimg.src = "./images/clearweather.png"
}else{
    Weatherimg.src = "./images/sunnyweather.png"
}

Temperature.textContent = Math.floor(realdata.main.temp) + `°C`;
City.textContent = realdata.name;
Seassion.textContent = realdata.weather[0].description;
humidity.textContent = realdata.main.humidity + `%`;
WindSpeed.textContent = realdata.wind.speed + `m/s`;
Sunrise.textContent = convertTime(realdata.sys.sunrise);
Sunset.textContent = convertTime(realdata.sys.sunset);

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

function showalert(){
alertbox.style.display = "block";
 setTimeout(function(){
     alertbox.style.display = "none";
 },3000)
}

Searchbtn.addEventListener("click",function(){
if(input.value === "" ){
  showalert()
}else{
        localStorage.setItem("city",input.value)
weather(input.value)
}

})

input.addEventListener("keydown",function(e){
if(e.key === "Enter"){
 Searchbtn.click();
}
})


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch(err => console.log("SW error", err));
  });
}


