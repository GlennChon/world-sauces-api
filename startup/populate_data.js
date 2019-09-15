
const assert = require('assert');

const countries = require('../data/countries.json');
const tasteProfiles = require('../data/tasteProfiles.json');
const recipes = require('../data/recipes.json');
const { Country } = require("../models/country");
const { TasteProfile } = require("../models/tasteProfile");
const { Recipe } = require("../models/recipe");

module.exports = function populate_data(){

    const countryCount = await Country.count();
    if (countryCount < 1){
       importData(Country, countries);
    }

    const tprofileCount = await TasteProfile.count();
    if (tprofileCount < 1){
        importData(TasteProfile, tasteProfiles);
    }

    
    const recipeCount = await Recipe.count();
    if (recipeCount < 1){
        importData(Recipe, recipes);
    }

}

function importData(model, data){
    model.collection.insertMany(data, function(err,r) {
        assert.equal(null, err);
          assert.equal(3, r.insertedCount);
        })
}

