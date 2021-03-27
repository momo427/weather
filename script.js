/* Fetching weather api  with wtch function, 
with a city name as a parameter it pulls the °F
on that current city
*/
//Put variables for api calls maybe
var city = ""
let weather = {
  apiKey: "41e57c1f78973f401f5499f98795c5c2",
  fetchWeather: function (city) {
    var cityResult;
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=" +
      this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }else
        cityResult = response.json();
        console.log(cityResult);
        return cityResult;


//--------------------------------------------UV Call-------------------------------------------------------------------------------------//
//Use of direct geocoding//
//thats how the city information is connected to the lat and long  for uv 
var lat = cityResult.coord.lat;
var lon = cityResult.coord.lon;
var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=41e57c1f78973f401f5499f98795c5c2&lat=" + lat  + "&lon=" + lon;

        $.ajax({
            url: queryURLUV,
            method: 'GET'
        }).then(function (response) {
            $('.uv').empty();
            var uvlresults = response.value;
            //create HTML for new div
            var uvlEl = $("<button class='btn bg-success'>").text("UV Index: " + response.value);
      
            $('.uv').html(uvlEl);
    
        });

      })
      .then((data) => this.displayWeather(data));

  },
  /*show all weather data */
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°F";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};


/*event listener for search  */

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });
weather.fetchWeather("Baltimore");

// //--------------------------------------------UV Call-------------------------------------------------------------------------------------//
// //Use of direct geocoding//
// //thats how the city information is connected to the lat and long  for uv 
// var lat = cityResult.coord.lat;
// var lon = cityResult.coord.lon;
// var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=41e57c1f78973f401f5499f98795c5c2&lat=" + lat  + "&lon=" + lon;

//         $.ajax({
//             url: queryURLUV,
//             method: 'GET'
//         }).then(function (response) {
//             $('#uvl-display').empty();
//             var uvlresults = response.value;
//             //create HTML for new div
//             var uvlEl = $("<button class='btn bg-success'>").text("UV Index: " + response.value);
      
//             $('#uvl-display').html(uvlEl);
    
//         });
 

/*Future forcast */
//--------------------------------------------5 Day Forcast-------------------------------------------------------------------------//
$.ajax({
  url: queryURLforcast,
  method: 'GET'
}).then(function (response) {
  // Storing an array of results in the results variable
  var results = response.list;
  //empty 5day div--------
  $("#5day").empty();
  //create HTML for 5day forcast................
  for (var i = 0; i < results.length; i += 8) {
      // Creating a div
      var fiveDayDiv = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");
      
      //Storing the responses date temp and humidity.......
      var date = results[i].dt_txt;
      var setD = date.substr(0,10)
      var temp = results[i].main.temp;
      var hum = results[i].main.humidity;

      //creating tags with the result items information.....
      var h5date = $("<h5 class='card-title'>").text(setD);
      var pTemp = $("<p class='card-text'>").text("Temp: " + temp);;
      var pHum = $("<p class='card-text'>").text("Humidity " + hum);;

      var weather = results[i].weather[0].main

      if (weather === "Rain") {
          var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
          icon.attr("style", "height: 40px; width: 40px");
      } else if (weather === "Clouds") {
          var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
          icon.attr("style", "height: 40px; width: 40px");
      } 
       else if (weather === "Clear") {
          var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
          icon.attr("style", "height: 40px; width: 40px");
      }
       else if (weather === "Drizzle") {
          var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
          icon.attr("style", "height: 40px; width: 40px");
      }
       else if (weather === "Snow") {
          var icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
          icon.attr("style", "height: 40px; width: 40px");
      }

      //append items to.......
      fiveDayDiv.append(h5date);
      fiveDayDiv.append(icon);
      fiveDayDiv.append(pTemp);
      fiveDayDiv.append(pHum);
      $("#5day").append(fiveDayDiv);
  }

});

//save city to local storage
pageLoad();

$("#select-btn").on("click", function (event) {
  // Preventing the button from trying to submit the form......
  event.preventDefault();
  // Storing the city name........
  var cityInput = $("#city").val().trim();

  //save search term to local storage.....
  var textContent = $(this).siblings("input").val();
  var storearr = [];
  storearr.push(textContent);
  localStorage.setItem('city', JSON.stringify(storearr));

  searchCity(cityInput);
  pageLoad();
});

function pageLoad() {
  var lastSearch = JSON.parse(localStorage.getItem("city"));
  var searchDiv = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(lastSearch);
  var psearch = $("<div>");
  psearch.append(searchDiv)
  $("#locationhistory").prepend(psearch);
}

//Event deligation...
$("#locationhistory").on('click', '.btn', function (event) {
  event.preventDefault();
  console.log($(this).text());
  searchCity($(this).text());

});