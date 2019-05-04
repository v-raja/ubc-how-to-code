import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RecipeService} from '../recipe.service';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ShoppingListService} from '../../shopping-list/shopping-list.service';
import {Recipe} from '../recipe.model';
import {Ingredient} from '../../shared/ingredient.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  recipeEditForm: FormGroup;
  editMode = false;
  units: string[];

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private slService: ShoppingListService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
    });

    this.units = this.slService.getUnits();
  }

  initForm() {
    let recipeName = '';
    let imagePath = '';
    let method = '';
    const ingredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      imagePath = recipe.imagePath;
      method = recipe.method;

      if (recipe['ingredients']) {
        for (const ingredient of recipe.ingredients) {
          ingredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
              'unit': new FormControl(ingredient.unit, Validators.required)
            })
          );
        }
      }
    }


    this.recipeEditForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(imagePath),
      'method': new FormControl(method, Validators.required),
      'ingredients': ingredients
    });
  }

  getControls() {
    return (<FormArray>this.recipeEditForm.get('ingredients')).controls;
  }

  onSave() {
    if (!this.editMode) {
      this.recipeService.addRecipe(this.recipeEditForm.value);
      this.router.navigate(['recipes', this.recipeService.getRecipes().length - 1]);
    } else {
      this.recipeService.updateRecipe(this.id, this.recipeEditForm.value);
      this.router.navigate(['../'], {relativeTo: this.route});
    }
  }

  onAddIngredient() {
    (<FormArray>this.recipeEditForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
        'unit': new FormControl('units', Validators.required)
      }));
  }

  onX(index: number) {
    (<FormArray>this.recipeEditForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}

// fix error when adding item and then removing it from recipe
