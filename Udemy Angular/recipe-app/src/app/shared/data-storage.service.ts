import {Injectable, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {Recipe} from '../recipes/recipe.model';
import {Ingredient} from './ingredient.model';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

@Injectable()
export class DataStorageService implements OnInit {

  constructor(private http: Http, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getRecipes();
  }

  putRecipes(recipes: Recipe[]) {
    const token = this.authService.getToken();
    this.http.put('https://recipe-book-9b9d3.firebaseio.com/recipes.json?auth=' + token, recipes).subscribe(
      (response) => (console.log(response)),
      (error) => (console.log(error))
    );
  }

  getRecipes() {
    console.log('getting recipes');
    const token = this.authService.getToken();

    return this.http.get('https://recipe-book-9b9d3.firebaseio.com/recipes.json?auth=' + token)
      .map( (response) => {
        const recipes: Recipe[] = response.json();
        for (const recipe of recipes) {
          if (!recipe['ingredients']) {
            recipe['ingredients'] = [];
          }
        }
        return recipes;

      });
  }

  putShoppingList(list: Ingredient[]) {
    const token = this.authService.getToken();

    this.http.put('https://recipe-book-9b9d3.firebaseio.com/shoppinglist.json?auth=' + token, list).subscribe(
      (response) => (console.log(response)),
      (error) => (console.log(error))
    );
  }

  getShoppingList() {
    console.log('getting SL');

    const token = this.authService.getToken();

    return this.http.get('https://recipe-book-9b9d3.firebaseio.com/shoppinglist.json?auth=' + token)
      .map( (response) => {
        return response.json();
      });
  }
}
