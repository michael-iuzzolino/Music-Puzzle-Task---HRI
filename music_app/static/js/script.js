var CURRENT_MELODY;
var MELODIES;
var TOTAL_MELODIES;

var USER_ANSWERS;
var USER_SCORES;

var ANSWER_BUTTON_HEIGHT = 70;
var ANSWER_BUTTON_WIDTH = 70;

var ACCURACY_BOX_X = 440;
var ACCURACY_BOX_Y = 200;

var PLAY_BUTTON_HOVER_COLOR = "#b3ffb3";
var PAUSE_BUTTON_HOVER_COLOR = "#ff0000";

var INSTRUCTIONS_BUTTON_CLICK_COLOR = "#b3ffb3";
var INSTRUCTIONS_BUTTON_CLICK_BORDER_COLOR = "#00ff00";
var SHOW_INSTRUCTIONS_BUTTON_HOVER_COLOR = "#e6e6ff";

var DROPDOWN_HOVER_COLOR = "#e6e6ff";
var DROPDOWN_HOVER_BORDER_COLOR = "#8000ff";

var NEXT_MELODY_BUTTON_HOVER_COLOR = "#00ff00";

var current_selected_answer_box_num;

var NEXT_MELODY_BUTTON_X = 0;
var NEXT_MELODY_BUTTON_Y = 350;

var ANSWER_GROUP_Y = 200;

var CURRENT_MELODY_X = 500;
var CURRENT_MELODY_Y = 75;

var melody_paused;
var melody_playing;
var melody_interval;

var instructions_display;

var busy_loading_next_melody;

var GAME_STARTED = false;



function startActivityTimer() {
    d3.select("#timer_g").remove();

    var timer_g = d3.select("#main_svg").append("g").attr("id", "timer_g")
        .attr("transform", "translate(900, 20)");


    // Text
    timer_g.append("text")
        .attr("x", 20)
        .attr("y", 20)
        .style("fill", "black")
        .style("font-size", "30px")
        .text(function() {
            var minutes = 5;
            var seconds = 0;

            return minutes + ":" + seconds + seconds;
        });

    var one_second = 1000;
    var one_minute = 60 * one_second;
    var five_minutes = 5 * one_minute;
    var time_elapsed = 0;
    var time_interval = 1000;

    var timer_interval = setInterval(function() {
        if (time_elapsed === five_minutes) {
            clearInterval(timer_interval);
            gameOver();
        }

        time_remaining = five_minutes - time_elapsed;

        // Text
        d3.select("#timer_g").select("text")
            .text(function() {
                var total_seconds = time_remaining / 1000;
                var minutes = parseInt(total_seconds / 60);
                var seconds = parseInt(total_seconds % 60);

                seconds = (seconds === 0) ? "00" : (seconds < 10) ? "0" + seconds : seconds;

                return minutes + ":" + seconds;
            });

        time_elapsed += time_interval;
    }, time_interval);


}

function gameOver() {
    refreshTaskScreen(gameover=true);
    var final_score = calculateFinalScore();
    showFinalScore(final_score);

    setTimeout(function() {
        alert("You may now exit the application.");
    }, 5000)
}

function refreshTaskScreen(gameover=false) {

    if (gameover) {

        // Transition melody group off screen
        d3.select("#current_melody_g").transition().duration(1000).ease(d3.easeExp, 2)
            .attr("transform", "translate(2000, "+50+")");

        // Remove melody group
        setTimeout(function () {
            d3.select("#current_melody_g").remove();
        }, 1000);

        // Transition instructions button off screen
        d3.select("#show_instructions_button_g").transition().duration(1000).ease(d3.easeExp, 2)
            .attr("transform", "translate(2000, "+50+")");

        // Remove instructions button
        setTimeout(function () {
            d3.select("#show_instructions_button_g").remove();
        }, 1000);

        // Transition piano group off screen
        d3.select("#piano_g").transition().duration(1000).ease(d3.easeExp, 2)
            .attr("transform", "translate(2000, "+PIANO_SVG_Y+")");

        // Remove piano group
        setTimeout(function () {
            d3.select("#piano_g").remove();
        }, 1000);

        // Transition timer off of screen
        d3.select("#timer_g").transition().duration(1000).ease(d3.easeExp, 2)
            .attr("transform", "translate(2000, "+50+")")
            .style("opacity", 0.0);

        // Remove timer
        setTimeout(function() {
            d3.select("#timer_g").remove();
        }, 500);
    }
    else {
        d3.select("#current_melody_g").select("text")
            .transition().duration(1000).ease(d3.easeExp, 2)
            .text(function () {
                return CURRENT_MELODY.name;
            });
    }

    // Transition answer frame off screen
    d3.select("#answer_frame_g")
        .transition().duration(1000).ease(d3.easeExp, 2)
        .attr("transform", "translate(2000, "+ANSWER_GROUP_Y+")");

    if (!gameover) {
        setTimeout(function () {
            initAnswerFrame();
        }, 1000);
    }

    // Transition next melody button off of screen
    d3.select("#next_melody_button_g").transition().duration(1000).ease(d3.easeExp, 2)
        .attr("transform", "translate(2000, "+NEXT_MELODY_BUTTON_Y+")")
        .style("opacity", 0.0);

    // Remove next melody button
    setTimeout(function() {
        d3.select("#next_melody_button_g").remove();
    }, 500);


    // Transition score off of screen
    d3.select("#score_g").transition().duration(1000).ease(d3.easeExp, 2)
        .attr("transform", "translate(2000, "+ACCURACY_BOX_Y+")")
        .style("opacity", 0.0);

    // Remove score
    setTimeout(function() {
        d3.select("#score_g").remove();
    }, 500);







}

function nextMelody(init=false) {
    if (init) {
        CURRENT_MELODY = {"number" : 0,
                          "audio" : MELODIES[0].audio,
                          "name" : "Melody 1",
                          "size" : MELODIES[0].info.length,
                          "answers" : MELODIES[0].info};

    }
    else {

        var next_melody_num = ++CURRENT_MELODY.number;

        if (next_melody_num >= TOTAL_MELODIES) {
            gameOver();
            return;
        }

        var current_melody_num = next_melody_num;
        CURRENT_MELODY.audio = MELODIES[current_melody_num].audio;
        CURRENT_MELODY.name = "Melody " + (current_melody_num+1);
        CURRENT_MELODY.size = MELODIES[current_melody_num].info.length;
        CURRENT_MELODY.answers = MELODIES[current_melody_num].info;
    }



    melody_paused = false;
    melody_playing = false;


    refreshTaskScreen();
}


function initializeUserAnswers() {
    USER_ANSWERS = {};
    USER_SCORES = {};

    for (var i=0; i < MELODIES.length; i++) {

        current_melody_name = "Melody " + (i + 1);
        current_melody_size = MELODIES[i].info.length;

        USER_ANSWERS[current_melody_name] = [];
        for (var j = 0; j < current_melody_size; j++) {
            USER_ANSWERS[current_melody_name].push({"active": false, "answer": undefined, "correct": false});
        }
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
        .on("mouseover", function() {
            d3.select(this).select("rect").transition().duration(600)
                .style("fill", NEXT_MELODY_BUTTON_HOVER_COLOR);
        })
        .on("mouseout", function() {
            d3.select(this).select("rect").transition().duration(600)
                .style("fill", "white");
        })
        .on("click", function() {
            if (busy_loading_next_melody) {
                return;
            }

            busy_loading_next_melody = true;
            showScore();
            setTimeout(function(){
                nextMelody();
            }, 2000);

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




function initPlayButton() {

    // Select main svg
    var current_melody_g = d3.select("#current_melody_g");

    // Add Play Button
    var play_button_g = current_melody_g.append("g")
        .attr("id", "play_button_g")
        .attr("transform", "translate(15, 20)")
        .style("cursor", "pointer")
        .on("mouseover", function() {

            if (melody_playing || melody_paused) {
                return;
            }
            else {
                d3.select(this).select("rect").transition().duration(600)
                    .style("fill", PLAY_BUTTON_HOVER_COLOR);
            }
        })
        .on("mouseout", function() {
            if (melody_playing || melody_paused) {
                return;
            }
            else {
                d3.select(this).select("rect").transition().duration(600)
                    .style("fill", "white");
            }
        })
        .on("click", function() {

            if (melody_playing) {
                // Pause/Resume the playing
                melody_paused = !melody_paused;

                if (melody_paused) {

                    // Pause the melody
                    CURRENT_MELODY.audio.pause();

                    // Update Pause Button
                    d3.select(this).select("rect")
                        .style("fill", PAUSE_BUTTON_HOVER_COLOR)
                        .style("fill-opacity", 0.5)
                        .style("stroke", "#ff0000");


                    d3.select(this).select("text")
                        .transition().duration(500)
                        .text("Paused ||");

                }
                else {
                    // Resume the melody
                    CURRENT_MELODY.audio.play();

                    // Update Pause Button
                    d3.select(this).select("rect")
                        .style("fill", "white")
                        .style("fill-opacity", 1.0)
                        .style("stroke", "black");

                    // Update Play Button
                    d3.select("#play_button_rect")
                        .transition().duration(500)
                        .style("fill", "#ccffdd")
                        .style("fill-opacity", 1.0)
                        .style("stroke", "#00ff00");

                    d3.select("#play_button_text")
                        .transition().duration(500)
                        .attr("x", 20)
                        .text("Playing...");
                }
            }
            else if (!melody_playing) {
                // Start the melody

                melody_interval = setInterval(function () {
                    if (CURRENT_MELODY.audio.ended) {
                        melody_playing = false;

                        d3.select("#play_button_rect")
                            .transition().duration(1000)
                            .style("fill", "white")
                            .style("stroke", "black");

                        d3.select("#play_button_text")
                            .transition().duration(1000)
                            .attr("x", 35)
                            .text("Play");

                        clearInterval(melody_interval);

                    }
                }, 50);

                CURRENT_MELODY.audio.play();
                melody_playing = true;

                d3.select(this).select("rect")
                    .style("fill", "#ccffdd")
                    .style("stroke", "#00ff00");

                d3.select(this).select("text").transition().duration(600)
                    .attr("x", 20).transition().duration(800)
                    .text("Playing...");
            }

        });

    // Play Button
    play_button_g.append("rect")
        .attr("id", "play_button_rect")
        .attr("height", 30)
        .attr("width", 100)
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", "white")
        .style("stroke", "black");


    // Play Button text
    play_button_g.append("text")
        .attr("id", "play_button_text")
        .attr("x", 35)
        .attr("y", 20)
        .style("fill", "black")
        .text("Play");
}


function initAnswerFrame() {

    d3.select("#answer_frame_g").remove();

    var main_g = d3.select("#main_g");

    var answer_frame_g = main_g.append("g").attr("id", "answer_frame_g")
        .attr("transform", function() {
            var new_x = -2000;
            return "translate("+new_x+", "+ANSWER_GROUP_Y+")";
        });



    answer_frame_g.transition().duration(1000).ease(d3.easeBack)
        .attr("transform", function() {
            var new_x = (MAIN_WIDTH - 10*(ANSWER_BUTTON_WIDTH + 20) - 20)/2.0 + 10;
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
            if (i >= 10) {
                var new_x = (i%10)*(ANSWER_BUTTON_WIDTH+20) + 10;
                var new_y = ANSWER_BUTTON_HEIGHT+40;
            }
            else {
                var new_x = i*(ANSWER_BUTTON_WIDTH+20) + 10;
                var new_y = 0;
            }

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

    busy_loading_next_melody = false;
}



function checkCurrentMelodyComplete(note) {

    var current_melody_notes = CURRENT_MELODY.size;

    var user_selected_notes = 0;
    for (var i=0; i < USER_ANSWERS[CURRENT_MELODY.name].length; i++) {
        if (USER_ANSWERS[CURRENT_MELODY.name][i].answer) {
            user_selected_notes++;
        }
    }

    var current_task_complete = (user_selected_notes === current_melody_notes);

    if (current_task_complete) {
        calculateScore(note);
        initNextMelodyButton();
    }

}



function calculateFinalScore() {

    var total_score_sum = 0.0;
    var total_num = 0.0;
    for (var i in USER_SCORES) {
        total_score_sum += USER_SCORES[i];
        total_num++;
    }

    return total_score_sum/total_num;
}

function showFinalScore(final_score) {
    var score_box_height = 100;
    var score_box_width = 300;

    d3.select("#final_score_g").remove();

    var final_score_g = d3.select("#main_svg").append("g").attr("id", "final_score_g")
        .attr("transform", "translate(450, 0)").style("opacity", 0.0);

    var score = final_score * 100;
    var score_text = "Total Accuracy: " + score.toFixed(2) + "%";

    // Get text width and height
    var test_text_svg = d3.select("body").append("svg")
        .attr("id", "test_text_svg")
        .append("text")
        .style("font-size", "26px")
        .text(score_text);

    var text_width = test_text_svg.node().getBBox().width;

    d3.select("#test_text_svg").remove();

    // Background
    final_score_g.append("rect")
        .attr("height", score_box_height)
        .attr("width", score_box_width)
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", "#b3ffb3")
        .style("stroke", "black");


    // Text
    final_score_g.append("text")
        .attr("x", function() {
            return (score_box_width - text_width)/2.0;
        })
        .attr("y", function() {
            return score_box_height*0.6;
        })
        .style("fill", "black")
        .style("font-size", "26px")
        .text(score_text);

    final_score_g.transition().duration(3000)
        .attr("transform", "translate(450, 300)").style("opacity", 1.0);
}


function showScore() {

    var score_box_height = 100;
    var score_box_width = 250;

    d3.select("#score_g").remove();


    var score_g = d3.select("#main_svg").append("g").attr("id", "score_g")
        .attr("transform", "translate("+ACCURACY_BOX_X+", "+ACCURACY_BOX_Y+")");

    var score = USER_SCORES[CURRENT_MELODY.name] * 100;
    var score_text = "Accuracy: " + score.toFixed(2) + "%";

    // Get text width and height
    var test_text_svg = d3.select("body").append("svg")
        .attr("id", "test_text_svg")
        .append("text")
        .style("font-size", "26px")
        .text(score_text);

    var text_width = test_text_svg.node().getBBox().width;

    d3.select("#test_text_svg").remove();

    // Background
    score_g.append("rect")
        .attr("height", score_box_height)
        .attr("width", score_box_width)
        .attr("rx", 20)
        .attr("ry", 20)
        .style("fill", "#b3ffb3")
        .style("stroke", "black");


    // Text
    score_g.append("text")
        .attr("x", function() {
            return (score_box_width - text_width)/2.0;
        })
        .attr("y", function() {
            return score_box_height*0.6;
        })
        .style("fill", "black")
        .style("font-size", "26px")
        .text(score_text);
}

function calculateScore(note) {
    var current = USER_ANSWERS[CURRENT_MELODY.name];
    var num_correct = 0;
    var total_number = current.length * 1.0;
    for (var i=0; i < total_number; i++) {
        if (current[i].correct) {
            num_correct++;
        }
    }
    var accuracy = num_correct/total_number;

    USER_SCORES[CURRENT_MELODY.name] = accuracy;
}



function initializeTask() {

    // Select main svg
    var main_g = d3.select("#main_g");

    // Current Melody Label
    var current_melody_g = main_g.append("g").attr("id", "current_melody_g")
        .attr("transform", "translate("+CURRENT_MELODY_X+", "+CURRENT_MELODY_Y+")");

    // Melody Label text
    current_melody_g.append("text")
        .attr("id", "current_melody_g_text")
        .style("font-size", "36px")
        .text(function() {
            return CURRENT_MELODY.name;
        });

    // Init Play Button
    initPlayButton();

    // Init Answer Area
    initAnswerFrame();

}