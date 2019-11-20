/*
Metaboverse
Metaboverse is designed for analysis of metabolic networks
https://github.com/j-berg/Metaboverse/
alias: metaboverse

Copyright (C) 2019 Jordan A. Berg
Email: jordan<dot>berg<at>biochem<dot>utah<dot>edu

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program.  If not, see <https://www.gnu.org/licenses/>.


Portions of the force graphing below based on or adapted from code from Mike Bostock
The original code is under the GNU General Public License v3.0, allowing for modification
and distribution
License and copyright notice: GNU General Public License v3.0
Changes:
  - Heavily modified and added to the style CSS for more flexibility in plotting
  - Adapted general D3 plotting functions and commands to work with input data and accept flexibility
  - Modified plotting functions to allow for the differential shading of nodes
  - All other components are original
Source:
http://bl.ocks.org/mbostock/1153292
https://bl.ocks.org/mbostock/1212215
*/

// Change user selection based on input
var selection = null;
console.log(selection)
function selectPathway() {

  var selection = document.getElementById("pathwayMenu").value;
  console.log(selection)
  return selection;
};

// Populate dictionary to access component reactions for each pathway
function make_pathway_dictionary(data) {

  // Get pathway name and ID
  var master = data[0].master_reference;
  var pathways = data[0].pathway_dictionary;
  var pathway_dict = {}
  for (var key in pathways) {

    if (key in master) {
      var name = master[key];
      pathway_dict[name] = {
        'id': key,
        'reactions': pathways[key]
      };

    } else {
      //var name = key; //eventually need to figure out mapping for remaining pathways that dont have a name, maybe they should be R-ALL
    };

  };

  return pathway_dict;
};

// Make Pathway menu for users to
function make_menu(pathway_dict) {

  // Get species names (keys) as list
  pathways_list = Object.getOwnPropertyNames(
    pathway_dict
  ).map(function(k) {
    return k;
  });
  pathways_list.sort();
  pathways_list.unshift("Select a pathway..."); // Add select prompt to menu bar

  // Generate drop-down menu for species select
  var menu = document.getElementById("pathwayMenu");
  for (var i = 0; i < pathways_list.length; i++) {

    var option = document.createElement("option");
    option.innerHTML = pathways_list[i];
    option.value = pathways_list[i];
    menu.appendChild(option);

  };

};

function initialize_nodes(nodes, node_dict, type_dict) {

  var expression_dict = {};
  var display_analytes_dict = {};
  var display_reactions_dict = {};

  // Make dictionary of node color values and types
  nodes.forEach(function(node) {

    node_dict[node['name']] = node['rgba_js']
    type_dict[node['name']] = node['type']
    expression_dict[node['name']] = node['expression']

    if (node['type'] === 'reaction') {
      display_analytes_dict[node['name']] = 'none'
      display_reactions_dict[node['name']] = 'inline'
    } else {
      display_reactions_dict[node['name']] = 'none'
      display_analytes_dict[node['name']] = 'inline'
    };

  });

  return node_dict, type_dict, expression_dict, display_analytes_dict, display_reactions_dict;

};

function initialize_links(links, nodex, node_dict, type_dict) {

  // Populate node object with relevant information and data
  links.forEach(function(link) {

    // Add pertinent node information
    link.source = nodex[link.source] || (nodex[link.source] = {name: link.source});
    link.target = nodex[link.target] || (nodex[link.target] = {name: link.target});
    nodex[link.source["name"]]["color"] = node_dict[link.source["name"]];
    nodex[link.target["name"]]["color"] = node_dict[link.target["name"]];

    // Prioritize reaction nodes in layout
    if (type_dict[link.source["name"]] == "reaction") {
        nodex[link.source["name"]]["weight"] = 100;
    } else {
        nodex[link.source["name"]]["weight"] = 1;
    };

    if (type_dict[link.target["name"]] == "reaction") {
        nodex[link.target["name"]]["weight"] = 100;
    } else {
        nodex[link.target["name"]]["weight"] = 1;
    };

  });

  return nodex, node_dict;

};

// Toggle zoom and pan by pressing the Alt key
// This section adapted from Pedro Tabacof, https://stackoverflow.com/a/34815469/9571488
var toggle_zoom = false;
function activate_zoom() {

    if (toggle_zoom === true) {

        svg.attr(
            "transform",
            "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")"

        );
    }
};

function initialize_graph() {

  // Allow flexible window dimensions based on initial window size when opened
  var width = window.innerWidth;
  var height = window.innerHeight;

  var svg = d3
      .select("body")
      .append("svg")
          .attr("width", width)
          .attr("height", height)
      .call(d3.behavior.zoom()
      .on("zoom", activate_zoom));

  var force = d3.layout.force()
      .gravity(0.1)
      .linkDistance(60)
      .charge(-500)
      .on("tick", tick)
      .size([width, height]);

  return svg, force;

};

// Draw curved edges
function tick() {

  path.attr("d", linkArc);
  circle.attr("transform", transform);
  text.attr("transform", transform);

};

function linkArc(d) {

  var dx = d.target.x - d.source.x;
  var dy = d.target.y - d.source.y;
  var dr = Math.sqrt(dx * dx + dy * dy);

  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;

};

function transform(d) {

  return "translate(" + d.x + "," + d.y + ")";

};

function parse_pathway(data, reactions) {

  // Extract links links from data for downstream use
  var links = data[0].links;

  // Set nodes variables up and extract node data
  var nodes = data[0].nodes;

  var master = data[0].master_reference;
  var pathways = data[0].pathway_dictionary;

  console.log("===")
  console.log(reactions)
  console.log(links)
  console.log(nodes)
  console.log(pathways['R-HSA-70555'])
  console.log(master['R-HSA-70555'])

};

d3.json("data/HSA_global_reactions.json", function(data) {

  var pathway_dict = make_pathway_dictionary(data);
  make_menu(pathway_dict);
  d3.select("#pathwayMenu").on("change", change);

  // Graphing
  function change() {

    var selection = document.getElementById("pathwayMenu").value;
    var reactions = pathway_dict[selection]['reactions'];

    var nodes, links = parse_pathway(data, reactions);

    // Initialize variables
    var nodex = {};
    var node_dict = {};
    var type_dict = {};

    var node_dict, type_dict, expression_dict, display_analytes_dict, display_reactions_dict = initialize_nodes(nodes, node_dict, type_dict);
    var nodex, node_dict = initialize_links(links, nodex, node_dict, type_dict);

    // Initialize force graph object
    //var svg, force = initialize_graph();
    //var g_nodes = d3.values(nodex);

    // Build graph
    //force
    //    .nodes(g_nodes)
    //    .links(links)
    //    .start();






    d3.select("body")
        .on("keydown", function () {

            toggle_zoom = d3.event.altKey;

        });

    d3.select("body")
        .on("keyup", function () {

        toggle_zoom = false;

    });

  };


}); //end of json import

   /*








   // Generate edges with style attributes
   svg.append("defs").selectAll("marker")
       .data([
          "reaction",
          "reactant",
          "product",
          "inhibitor",
          "catalyst",
          "complex_component"])
       .enter()
       .append("marker")
           .attr("id", function(d) { return d; })
           .attr("viewBox", "0 -5 10 10")
           .attr("refX", 15)
           .attr("refY", -1.5)
           .attr("markerWidth", 6)
           .attr("markerHeight", 6)
           .attr("orient", "auto")
       .append("path")
           .attr("d", "M0, -5L10, 0L0, 5");

   var path = svg.append("g").selectAll("path")
       .data(force.links())
       .enter().append("path")
           .attr("class", function(d) { return "link " + d.type; })
           .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

   var node = svg.selectAll(".node")
       .data(g_nodes)
       .enter().append("g")
           .attr("class", "node")
       .style("--node_color", function(d) { return "rgba(" + d.color + ")"; })
       .call(force.drag);

   var circle = node
       .append("circle")
           .attr("r", 6);

   var text = node
       .append("text")
           .attr("x", 16)
           .attr("y", ".31em")
       .text(function(d) {

         if (type_dict[d.name] === "reaction") {

           // If reaction node, do not display expression value
           return d.name;

         } else {

           // Label other nodes with expression value in parentheses
           return d.name + ' (' + parseFloat(expression_dict[d.name]).toFixed(2) + ')';

         }
       });


       // Not working right now
       toggle_e = false;
       d3.select("#toggleExpression")
           .on("click", function() {

               if (toggle_e === false) {
                 toggle_e = true;
                 text.text(function(d) {

                   if (type_dict[d.name] === "reaction") {

                     // If reaction node, do not display expression value
                     return d.name;

                   } else {

                     // Label other nodes with expression value in parentheses
                     return d.name + ' (' + parseFloat(expression_dict[d.name]).toFixed(2) + ')';

                   }
                 });
               } else {
                 toggle_e = false;
                 text.text(function(d) { return d.name });
               }

            });





       toggle_a = false;
       toggle_r = false;
       text.style("--node_display", function(d) { return "none"; });

       d3.select("#toggleAnalytes")
           .on("click", function() {

               if (toggle_a === false) {

                   toggle_a = true;
                   determine_displays(toggle_a, toggle_r);

               } else {

                   toggle_a = false;
                   determine_displays(toggle_a, toggle_r);
               }

           });


       d3.select("#toggleReactions")
           .on("click", function() {

               if (toggle_r === false) {

                   toggle_r = true;
                  determine_displays(toggle_a, toggle_r);

               } else {

                   toggle_r = false;
                   determine_displays(toggle_a, toggle_r);

               }

           });

    function determine_displays(toggle_a, toggle_r) {

      if ((toggle_a === false) && (toggle_r === false)) {
        var display_labels = "none";
      }
      else if ((toggle_a === false) && (toggle_r === true)) {
        var display_labels = "reactions";
      }
      else if ((toggle_a === true) && (toggle_r === false)) {
        var display_labels = "analytes";
      }
      else if ((toggle_a === true) && (toggle_r === true)) {
        var display_labels = "all";
      }
      else {
        var display_labels = "none";
      }

      // options:

      // none -> all labels hidden until hovered
      if (display_labels === "none") {
        text.style("--node_display", function(d) { return "none"; })
      }
      // analytes -> analytes shown, reactions hovered
      else if (display_labels === "analytes") {
        text.style("--node_display", function(d) { return display_analytes_dict[d.name]; })
      }
      // reactions -> reactions shown, analytes hovered
      else if (display_labels === "reactions") {
        text.style("--node_display", function(d) { return display_reactions_dict[d.name]; })
      }
      // analytes + reactions -> all -> all shown
      else if (display_labels === "all") {
        text.style("--node_display", function(d) { return "inline"; })
      }
      else {
        text.style("--node_display", function(d) { return "none"; })
      }

    };








   var cell = node
       .append("path")
           .attr("class", "cell");




   */