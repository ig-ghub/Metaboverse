$.getJSON('https://reactome.org/ContentService/data/species/all', function(data) {

  // Get species name and ID from Reactome API
  var abbreviation_dict = {}
  data.forEach(function(datum) {

      abbreviation_dict[datum['displayName']] = datum['abbreviation']


  });

  // Get species names (keys) as list
  speciesList = Object.getOwnPropertyNames(
    abbreviation_dict
  ).map(function(k) {
    return k;
  });
  speciesList.unshift("Select an organism..."); // Add select prompt to menu bar

  console.log(speciesList)

  // Generate drop-down menu for species select
  var menu = document.getElementById('speciesMenu');
  for (var i = 0; i < speciesList.length; i++) {
    var option = document.createElement('option');
    option.innerHTML = speciesList[i];
    option.value = speciesList[i];
    menu.appendChild(option);
}

});
