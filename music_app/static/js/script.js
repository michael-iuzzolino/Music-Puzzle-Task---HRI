var CURRENT_MELODY;
var MELODIES;
var TOTAL_MELODIES;

var USER_ANSWERS;

var ANSWER_BUTTON_HEIGHT = 70;
var ANSWER_BUTTON_WIDTH = 70;

var DROPDOWN_HOVER_COLOR = "#e6e6ff";
var DROPDOWN_HOVER_BORDER_COLOR = "#8000ff";

var current_selected_answer_box_num;

var NEXT_MELODY_BUTTON_X = 0;
var NEXT_MELODY_BUTTON_Y = 250;
var ANSWER_BOX_Y = 500;

var ANSWER_GROUP_X = 100;
var ANSWER_GROUP_Y = 275;


function gameOver() {
    alert("Game Over!");
}

function refreshTaskScreen() {
    d3.select("#current_melody_g").select("text")
        .transition().duration(1000).ease(d3.easeExp, 2)
        .text(function() {
            return CURRENT_MELODY.name;
        });

    initAnswerFrame();

    d3.select("#next_melody_button_g").transition().duration(1000).ease(d3.easeExp, 2)
        .attr("transform", "translate(2000, "+NEXT_MELODY_BUTTON_Y+")")
        .style("opacity", 0.0);

    setTimeout(function() {
        d3.select("#next_melody_button_g").remove();
    }, 500);
}

function nextMelody(init=false) {
    if (init) {
        CURRENT_MELODY = {"number" : 0, "audio" : MELODIES[0].audio, "name" : "Melody 1", "size" : MELODIES[0].info.length};
        USER_ANSWERS = {};
    }
    else {

        var next_melody_num = ++CURRENT_MELODY.number;

        if (next_melody_num >= TOTAL_MELODIES) {
            gameOver();
        }

        var current_melody_num = next_melody_num;
        CURRENT_MELODY.audio = MELODIES[current_melody_num].audio;
        CURRENT_MELODY.name = "Melody " + (current_melody_num+1);
        CURRENT_MELODY.size = MELODIES[current_melody_num].info.length;
    }

    USER_ANSWERS[CURRENT_MELODY.name] = [];
    for (var i=0; i < CURRENT_MELODY.size; i++) {
        USER_ANSWERS[CURRENT_MELODY.name].push({"active" : false, "answer" : undefined, "correct" : false});
    }
}



function initNextMelodyButton() {

    d3.select("#next_melody_button_g").remove();

    // Select main svg
    var current_melody_g = d3.select("#current_melody_g");

    // Add Next Melody Button
    var next_melody_button_g = current_melody_g.append("g")
        .attr("id", "next_melody_button_g")
        .attr("transform", "translate("+NEXT_MELODY_BUTTON_X+", "+NEXT_MELODY_BUTTON_Y+")")
        .style("cursor", "pointer")
        .style("opacity", 0.0)
        .on("click", function() {
            nextMelody();
            refreshTaskScreen();
        });

    // Button
    next_melody_button_g.append("rect")
        .attr("id", "next_melody_button_rect")
        .attr("height", 30)
        .attr("width", 140)
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", "white")
        .style("stroke", "black");


    // Button text
    next_melody_button_g.append("text")
        .attr("id", "next_melody_button_text")
        .attr("x", 24)
        .attr("y", 20)
        .style("fill", "black")
        .text("Next Melody");

    // Transition button
    next_melody_button_g.transition().duration(500)
        .style("opacity", 1.0);

}


function initPauseButton() {
    // Select main svg
    var current_melody_g = d3.select("#current_melody_g");

    // Init Play Button
    // Add Play Button
    var play_button_g = current_melody_g.append("g")
        .attr("id", "play_button_g")
        .attr("transform", "translate(15, 20)")
        .style("cursor", "pointer")
        .on("click", function() {

            CURRENT_MELODY.audio.play();

            d3.select(this).select("rect")
                .style("fill", "#ccffdd")
                .style("stroke", "#00ff00");

            d3.select(this).select("text").transition().duration(600)
                .attr("x", 20).transition().duration(800)
                .text("Playing...");

            d3.select(this).select("rect")
                .transition().delay(8000).duration(1000)
                .style("fill", "white")
                .style("stroke", "black");

            d3.select(this).select("text")
                .transition().delay(8000).duration(1000)
                .attr("x", 35)
                .text("Play");
        });

    // Button
    play_button_g.append("rect")
        .attr("id", "play_button_rect")
        .attr("height", 30)
        .attr("width", 100)
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", "white")
        .style("stroke", "black");


    // Button text
    play_button_g.append("text")
        .attr("id", "play_button_text")
        .attr("x", 35)
        .attr("y", 20)
        .style("fill", "black")
        .text("Play");
}



function initPlayButton() {
    // Select main svg
    var current_melody_g = d3.select("#current_melody_g");

    // Init Play Button
    // Add Play Button
    var play_button_g = current_melody_g.append("g")
        .attr("id", "play_button_g")
        .attr("transform", "translate(15, 20)")
        .style("cursor", "pointer")
        .on("click", function() {

            CURRENT_MELODY.audio.play();

            d3.select(this).select("rect")
                .style("fill", "#ccffdd")
                .style("stroke", "#00ff00");

            d3.select(this).select("text").transition().duration(600)
                .attr("x", 20).transition().duration(800)
                .text("Playing...");

            d3.select(this).select("rect")
                .transition().delay(8000).duration(1000)
                .style("fill", "white")
                .style("stroke", "black");

            d3.select(this).select("text")
                .transition().delay(8000).duration(1000)
                .attr("x", 35)
                .text("Play");
        });

    // Button
    play_button_g.append("rect")
        .attr("id", "play_button_rect")
        .attr("height", 30)
        .attr("width", 100)
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", "white")
        .style("stroke", "black");


    // Button text
    play_button_g.append("text")
        .attr("id", "play_button_text")
        .attr("x", 35)
        .attr("y", 20)
        .style("fill", "black")
        .text("Play");
}


function initAnswerFrame() {

    d3.select("#answer_frame_g").remove();

    var main_svg = d3.select("#main_svg");

    var answer_frame_g = main_svg.append("g").attr("id", "answer_frame_g")
        .attr("transform", function() {
            var new_x = (MAIN_WIDTH - CURRENT_MELODY.size*(ANSWER_BUTTON_WIDTH + 20) - 20)/2.0;
            return "translate("+new_x+", "+ANSWER_GROUP_Y+")";
        });

    // Create dummy data for answer groups
    var dummy_data = [];
    for (var i=0; i < CURRENT_MELODY.size; i++) {
        dummy_data.push(i);
    }

    // ANSWER GROUPS
    var answers_g = answer_frame_g.selectAll("g.answers_g")
        .data(dummy_data).enter()
        .append("g")
        .attr("id", function(d, i) {
            return "answer_g_"+i;
        })
        .attr("class", "answers_g")
        .attr("transform", function(d, i) {
            var new_x = i*(ANSWER_BUTTON_WIDTH+20) + 10;
            var new_y = 0;
            return "translate("+new_x+","+new_y+")";
        })
        .style("cursor", "pointer")
        .on("mouseover", function(d, i) {

            if (current_selected_answer_box_num !== i) {

                d3.select(this).select("rect").transition()
                    .style("fill", DROPDOWN_HOVER_COLOR)
                    .style("stroke", DROPDOWN_HOVER_BORDER_COLOR)
                    .style("opactiy", 0.9);
            }
        })
        .on("mouseout", function(d, i) {

            if (current_selected_answer_box_num !== i) {

                d3.select(this).select("rect").transition()
                    .style("fill", "white")
                    .style("stroke", "black")
                    .style("opactiy", 1.0);
            }
        })
        .on("click", function(d, i) {
            USER_ANSWERS[CURRENT_MELODY.name][i].active = !USER_ANSWERS[CURRENT_MELODY.name][i].active;

            var active = USER_ANSWERS[CURRENT_MELODY.name][i].active;
            if (active) {
                console.log("On");
                current_selected_answer_box_num = i;

                // Turn All Other Boxes OFF
                for (var j=0; j < USER_ANSWERS[CURRENT_MELODY.name].length; j++) {
                    if (j === i) {
                        continue;
                    }
                    USER_ANSWERS[CURRENT_MELODY.name][j].active = false;
                    d3.select("#answer_g_"+j).select("rect")
                        .style("fill", "white")
                        .style("stroke", "black")
                        .style("opactiy", 1.0)
                }

                // Activate rectangle
                d3.select(this).select("rect")
                    .style("fill", DROPDOWN_HOVER_COLOR)
                    .style("stroke", DROPDOWN_HOVER_BORDER_COLOR)
                    .style("opactiy", 0.9);
            }
            else {
                console.log("Off");
                current_selected_answer_box_num = undefined;

                d3.select(this).select("rect").transition()
                    .style("fill", "white")
                    .style("stroke", "black")
                    .style("opactiy", 1.0);
            }
        });

    // TEXT: ANSWER GROUPS
    answers_g.append("text")
        .attr("x", 10)
        .attr("y", 0)
        .text(function(d, i) {
            return "Note " + (i+1);
        })
        .style("fill", "black")
        .style("font-size", "20px");



    // DROPDOWNS : ANSWER GROUPS
    var answer_box_g = answers_g.append("g")
        .attr("id", "answer_box_g")
        .attr("transform", "translate(0, 5)");

    // Dropdown box
    answer_box_g.append("rect")
        .attr("height", ANSWER_BUTTON_HEIGHT)
        .attr("width", ANSWER_BUTTON_WIDTH)
        .style("fill", "white")
        .style("stroke", "black");


    // Text
    answer_box_g.append("text")
        .attr("id", function(d, i) {
            var answer_box_id = "answer_box_"+i;
            return answer_box_id
        })
        .attr("x", 7)
        .attr("y", 35)
        .style("font-size", "12px")
        .text("Select Note");
}



function checkCurrentMelodyComplete() {

    var current_melody_notes = CURRENT_MELODY.size;

    var user_selected_notes = 0;
    for (var i=0; i < USER_ANSWERS[CURRENT_MELODY.name].length; i++) {
        if (USER_ANSWERS[CURRENT_MELODY.name][i].answer) {
            user_selected_notes++;
        }
    }

    var current_task_complete = (user_selected_notes === current_melody_notes) ? true : false;

    if (current_task_complete) {
        initNextMelodyButton();
    }
}



function initializeTask() {

    // Select main svg
    var main_svg = d3.select("#main_svg");

    // Current Melody Label
    var current_melody_g = main_svg.append("g").attr("id", "current_melody_g")
        .attr("transform", "translate(500, 150)");

    // Melody Label text
    current_melody_g.append("text")
        .attr("id", "current_melody_g_text")
        .style("font-size", "36px")
        .text(function() {
            return CURRENT_MELODY.name;
        });

    // Init Play Button
    initPlayButton();

    // Init Pause Button
    initPauseButton();

    // Init Answer Area
    initAnswerFrame();

}