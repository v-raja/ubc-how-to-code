import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {DataStorageService} from '../../shared/data-storage.service';
import {Recipe} from '../../recipes/recipe.model';
import {RecipeService} from '../../recipes/recipe.service';
import {ShoppingListService} from '../../shopping-list/shopping-list.service';
import {Ingredient} from '../../shared/ingredient.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private authService: AuthService, private dataService: DataStorageService, private recipeService: RecipeService,
              private slService: ShoppingListService) { }

  ngOnInit() {
  }

  onSignin(form: NgForm) {
    this.authService.userToSignIn.next({email: form.value.email, password: form.value.password});
    this.authService.signinUser(form.value.email, form.value.password)
    ;
    this.dataService.getRecipes().subscribe(
      (recipes: Recipe[]) => {
        this.recipeService.setRecipes(recipes);
    });

    this.dataService.getShoppingList().subscribe(
      (list: Ingredient[]) => {
      this.slService.setIngredients(list);
    });
  }
}
