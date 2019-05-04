import {AfterContentInit, Component, OnInit} from '@angular/core';
import {DataStorageService} from './shared/data-storage.service';
import {RecipeService} from './recipes/recipe.service';
import * as firebase from 'firebase';
import {Recipe} from './recipes/recipe.model';
import {Ingredient} from './shared/ingredient.model';
import {ShoppingListService} from './shopping-list/shopping-list.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private dataService: DataStorageService, private recipeService: RecipeService, private slService: ShoppingListService) {
  }

  ngOnInit() {
    firebase.initializeApp({
      apiKey: 'AIzaSyCGWURfNlzjjZIb20zyzDQlj0VpNKN5lpo',
      authDomain: 'recipe-book-9b9d3.firebaseapp.com'
    });

    this.refreshData();
  }

  refreshData() {
    this.dataService.getRecipes().subscribe(
      (recipes: Recipe[]) => {
        this.recipeService.setRecipes(recipes);
      }
    );

    this.dataService.getShoppingList().subscribe(
      (ingredients: Ingredient[]) => {
        this.slService.setIngredients(ingredients);
      }
    );
  }
}
