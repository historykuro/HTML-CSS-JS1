const search = document.querySelector('.search')
const city = document.querySelector('.heading-city')
const yearsTime = document.querySelector('years-time')
const value = document.querySelector('.value')
const shortDecs = document.querySelector('.short-decs')
const visibility = document.querySelector('.visibility span')
const wind = document.querySelector('.wind span')
const sun = document.querySelector('.cloud span')
const years = document.querySelector('.years')
const content = document.querySelector('.content')


// const value = document.querySelector('.value')

async function changeWeather(){
    let capitalSearch = search.value.trim()
    const apiUrl = ` https://api.openweathermap.org/data/2.5/weather?q=${capitalSearch}&units=metric&appid=d78fd1588e1b7c0c2813576ba183a667
    `
    const data = await fetch(apiUrl).then(res => res.json())
    console.log(data)
    // city.innerText = data.name
    // visibility.innerText = data.visibility + ' (m)'
    // shortDecs.innerText = data.weather[0] ? data.weather[0].main : ''
    // wind.innerText = data.wind.speed + ' (m/s)'
    // sun.innerText = data.main.humidity + " (%)"
    // value.innerText = Math.round(data.main.temp - 1)
    // yearsTime.innerText = new Date().toLocaleDateString()
    // years.innerText = new Date().toLocaleTimeString()
    // console.log(data.cod)
    if(data.cod == 200){
        content.classList.remove("hide")
        city.innerText = data.name
        visibility.innerText = data.visibility + ' (m)'
        shortDecs.innerText = data.weather[0] ? data.weather[0].main : ''
        wind.innerText = data.wind.speed + ' (m/s)'
        sun.innerText = data.main.humidity + " (%)"
        value.innerText = Math.round(data.main.temp)
    }else{
        content.classList.add("hide")
    }
}   
changeWeather();
search.addEventListener("keypress", function(e) {
    if(e.code === 'Enter'){
        changeWeather()
    }
})

