import {Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import {ShoppingListService} from './shopping-list.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private subscription: Subscription;
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.subscription = this.shoppingListService.ingredientsChanged.subscribe( (ingredients: Ingredient[]) => {
      this.ingredients = ingredients;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  // ngDoCheck() {
  //   if (this.ingredients !== this.shoppingListService.getIngredients()) {
  //     this.ingredients = this.shoppingListService.getIngredients();
  //   }
  // }

  onEditItemClick(index: number) {
    this.shoppingListService.itemToEditIndex.next(index);
  }

}
