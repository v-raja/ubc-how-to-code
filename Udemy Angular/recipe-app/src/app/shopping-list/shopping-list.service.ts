import {Ingredient} from '../shared/ingredient.model';
import {Subject} from 'rxjs';
import {DataStorageService} from '../shared/data-storage.service';

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  itemToEditIndex = new Subject<number>();
  units: string[] = ['units', 'grams', 'tbsp', 'tsp', 'litres', 'ml'];

  private ingredients: Ingredient[] = [];
  //   [
  //   new Ingredient('Apple', 5, 'units'),
  //   new Ingredient('Tomatos', 10, 'units')
  // ];

  // constructor(private dataService: DataStorageService) {}


  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  setIngredients(ingredients: Ingredient[]) {
    this.ingredients = ingredients;
    this.updateChanges();
  }

  getUnits() {
    return this.units;
  }

  addIngredient(newIngredient: Ingredient) {
    const index = this.ingredients.findIndex( (element: Ingredient) => {
      return (element.name === newIngredient.name) && (element.unit === newIngredient.unit);
    })
    if (index !== -1) {
      this.ingredients[index].amount += +newIngredient.amount;
    } else {
      this.ingredients.push(newIngredient);
    }
    this.updateChanges();
  }

  addIngredients(ingredients: Ingredient[]) {
    ingredients.forEach((ingredient: Ingredient) => this.addIngredient(ingredient));
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.updateChanges();
  }

  updateChanges() {
    const newIngredients = this.getIngredients();
    this.ingredientsChanged.next(newIngredients);
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.updateChanges();
  }
}
