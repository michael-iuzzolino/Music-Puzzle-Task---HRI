

var MAIN_HEIGHT = 800;
var MAIN_WIDTH = 1200;


function initializeInstructions() {

}





function initializeMain() {

    // Main svg
    var main_svg = d3.select("#main_div").append("svg")
        .attr("id", "main_svg")
        .attr("height", MAIN_HEIGHT)
        .attr("width", MAIN_WIDTH);

    // Main svg background
    main_svg.append("rect")
        .attr("height", MAIN_HEIGHT)
        .attr("width", MAIN_WIDTH)
        .style("fill", "white")
        .style("stroke", "black");

}


function loadMelodies() {
    $.ajax({
        url: "load_melodies",
        success: (function(melody_result) {

            MELODIES = melody_result;
            TOTAL_MELODIES = melody_result.length;
            for (var i=0; i < TOTAL_MELODIES; i++) {
                var melody_audio_path = melody_result[i].audio_path;
                var melody_audio = new Audio(melody_audio_path);
                MELODIES[i]["audio"] = melody_audio;
            }

            // Initialize current melody
            nextMelody(init=true);

            initializeTask();
        })
    });
}


function initializeContainers() {
    var main_div = d3.select("body").append("div").attr("id", "main_div");

    // Task Window Div
    main_div.append("div").attr("id", "task_div");

    // Piano Div
    main_div.append("div").attr("id", "piano_div");
}


$(document).ready(function() {
    d3.select("body").append("h1").html("Music Puzzle Activity");
    loadMelodies();
    initializeContainers();
    initializeMain();


    initializeInstructions();

    initializePianoBoard();
});




