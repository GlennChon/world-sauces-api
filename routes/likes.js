// Increment Recipe Like Count
incrementRecipeLikes = async recipe => {
  return recipe.updateOne({ $inc: { likes: 1 } });
};

// Decerement Recipe Like Count
decrementRecipeLikes = async recipe => {
  return recipe.updateOne({ $inc: { likes: -1 } });
};
