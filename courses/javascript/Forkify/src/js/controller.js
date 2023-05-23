import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import RecipeView from "./views/recipeView.js";
import SearchView from "./views/searchView.js";
import ResultsView from "./views/resultsView.js";
import PaginationView from "./views/paginationView.js";
import BookmarksView from "./views/bookmarksView.js";
import AddRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime.js";
import { async } from "regenerator-runtime";

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    RecipeView.renderSpinner();

    ResultsView.update(model.getSearchResultsPage());
    BookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    RecipeView.render(model.state.recipe);
  } catch (err) {
    RecipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    ResultsView.renderSpinner();

    const query = SearchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);

    ResultsView.render(model.getSearchResultsPage(1));

    PaginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  ResultsView.render(model.getSearchResultsPage(goToPage));

  PaginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);

  RecipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  RecipeView.update(model.state.recipe);

  BookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  BookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    AddRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    RecipeView.render(model.state.recipe);

    AddRecipeView.renderMessage();

    BookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    setTimeout(function () {
      AddRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(`❤❤❤❤❤ ${err}`);
    AddRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log(`Here lies the new feature`);
};

const init = function () {
  BookmarksView.addHandlerRender(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  AddRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();
