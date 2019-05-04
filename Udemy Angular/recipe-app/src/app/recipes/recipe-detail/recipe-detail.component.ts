import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';
import {ShoppingListService} from '../../shopping-list/shopping-list.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements  OnInit {
  recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe( (params: Params) => {
      this.id = +params['id'];
      if (this.recipeService.getRecipe(this.id) === undefined) {
        this.router.navigate(['/recipes']);
      } else {
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    });
  }

  ngOnInit() {
  }


  toShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onDelete() {
    this.recipeService.removeRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

}
