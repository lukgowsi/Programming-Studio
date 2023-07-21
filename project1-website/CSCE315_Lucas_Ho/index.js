// varnum = 0;

// function button1(){
//     num++;
//     document.getElementById("output").innterHTML = "Press x"+num;
// }

//dark css

// key = "";
// var curr = "";

// function change() {
//     var stuff = document.getElementById("styleSheet");

//     var active_style;
//     if (stuff.getAttribute("href") == "./index.css") {
//         active_style = "./index2.css";
//     } else {
//         active_style = "./index.css";
//     }

//     content.setAttribute("href", curr_style);

//     localStorage.setItem("curr_style", curr_style);
// }

// window.onload = function curr_style() {
//     var local_style = localStorage.getItem("curr_style") || "./index.css";
//     var stuff = document.getElementById("styleSheet");
//     stuff.setAttribute("href", local_style);
// }

// var current_style = "";

function load_style(){
    active_style = localStorage.getItem("current_style");
    if(active_style == null || active_style == "index2.css"){
        active_style = "index.css";
        first_style();
        console.log("1st");
    } else {
        active_style = "index2.css";
        second_style();
        console.log("2nd");
    }
    console.log(active_style);
    document.getElementById("mainstyle").setAttribute("href", active_style);
    localStorage.setItem("current_style", active_style)
}

function first_style(){
    localStorage.setItem("current_style", "index.css");
}

function second_style(){
    localStorage.setItem("current_style", "index2.css");
}

window.onload = function() {
    active_style = localStorage.getItem("current_style");
    document.getElementById("mainstyle").setAttribute("href", active_style);
}

