import {Recipe} from './recipe.model';
import {Injectable, OnInit} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import {Subject} from 'rxjs';
import 'rxjs-compat/add/operator/map';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStorageService} from '../shared/data-storage.service';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [];
    // [new Recipe('Pepperoni Pizza',
    // 'This is a sample method',
    // 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfy2MJb-ZZj8ZTu-wXUyS1p4mn73MyRIIJWSrnr5tO8riw012y',
    // [new Ingredient('Pepperoni', 20, 'units'),
    // new Ingredient('Cheese', 1, 'units')]),
    // new Recipe('Burger Beef',
    //   'Second Sample',
    //   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI0LMXs_gZEJmmO1LOqfGQajjzvFWSDD-thTezr4bl_odrvJYL',
    //   [new Ingredient('Beef', 1, 'units'),
    //   new Ingredient('Buns', 2, 'units'),
    //   new Ingredient('Lettuce', 1, 'units')])];
  recipeChanged = new Subject<Recipe[]>();

  constructor(private slService: ShoppingListService, private dataService: DataStorageService) {
  }


  getRecipes() {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.getRecipes());
    this.dataService.getRecipes();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  updateRecipe(id: number, recipe: Recipe) {
    this.recipes[id] = recipe;
    this.updateChanges();
  }

  addRecipe(newRecipe: Recipe) {
    this.recipes.push(newRecipe);
    this.updateChanges();
  }

  removeRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.updateChanges();
  }

  updateChanges() {
    const newRecipes = this.getRecipes();
    this.recipeChanged.next(newRecipes);
    this.dataService.putRecipes(newRecipes);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }
}
