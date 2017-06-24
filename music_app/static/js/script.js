var white_keys = ["A", "B", "C", "D", "E", "F", "G"];
var black_keys = ["G_sharp", "Bb", "C_sharp", "Eb", "F_sharp"];
var black_key_position = [-25, 75, 275, 375, 575];

$(document).ready(function() {
  d3.select("body").append("h1").html("Music Puzzle Activity");

  var main_div = d3.select("body").append("div").attr("id", "main_div");

  main_div.append("div").attr("id", "piano_div");

  createPianoBoard();

});

function createPianoBoard() {

  var piano_div = d3.select("#piano_div");

  var piano_svg = piano_div.append("svg")
    .attr("height", 200)
    .attr("width", 700)

  // background
  piano_svg.append("rect")
    .attr("height", 200)
    .attr("width", 700)
    .style("fill", "white")
    .style("stroke", "black")


  // White Keys
  var white_key_width = 100;
  var white_key_height = 200;

  var white_keys_g = piano_svg.append("g").attr("id", "white_keys_g");

  white_keys_g.selectAll("rect.white_keys")
    .data(white_keys).enter()
    .append("rect")
    .attr("class", "white_keys")
    .attr("id", function(d) { return d; })
    .attr("height", white_key_height)
    .attr("width", white_key_width)
    .attr("x", function(d, i) {
      return i*white_key_width;
    })
    .style("fill", "white")
    .style("stroke", "black")
    .on("click", function(d, i) {
      document.getElementById("audioElement_"+d).play();
      d3.select(this)
        .style("fill", "blue")
        .style("opacity", 0.4);

      d3.select(this)
        .transition().duration(500)
        .style("fill", function() {
          var key_color = (d.length == 1) ? "white" : "black";
          return key_color;
        })
        .style("opacity", 1.0);
    });



  // Black Keys
  var black_key_width = 50;
  var black_key_height = 100;

  var black_keys_g = piano_svg.append("g").attr("id", "black_keys_g");

  black_keys_g.selectAll("rect.black_keys")
    .data(black_keys).enter()
    .append("rect")
    .attr("class", "black_keys")
    .attr("id", function(d) { return d; })
    .attr("height", black_key_height)
    .attr("width", black_key_width)
    .attr("x", function(d, i) {
      return black_key_position[i];
    })
    .style("fill", "black")
    .style("stroke", "black")
    .on("click", function(d, i) {
      document.getElementById("audioElement_"+d).play();
      d3.select(this)
        .style("fill", "#00ffff");

      d3.select(this)
        .transition().duration(500)
        .style("fill", function() {
          var key_color = (d.length == 1) ? "white" : "black";
          return key_color;
        });
    });
}
