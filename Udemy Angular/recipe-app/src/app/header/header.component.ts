import {Component} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import {Ingredient} from '../shared/ingredient.model';

@Component ({
  templateUrl: './header.component.html',
  selector: 'app-header',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent {
  constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService, private slService: ShoppingListService) {
  }

  onSaveData() {
    this.dataStorageService.putRecipes(this.recipeService.getRecipes());
    this.dataStorageService.putShoppingList(this.slService.getIngredients());
  }

  onFetchData() {
    this.dataStorageService.getRecipes().subscribe(
      (recipes: Recipe[]) => {
        this.recipeService.setRecipes(recipes);
      }
    );

    this.dataStorageService.getShoppingList().subscribe(
      (list: Ingredient[]) => {
        this.slService.setIngredients(list);
      }
    );
  }
}
