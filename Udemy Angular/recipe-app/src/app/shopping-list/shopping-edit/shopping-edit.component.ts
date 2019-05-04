import {Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {current} from 'codelyzer/util/syntaxKind';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  editMode = false;
  edittedIngredient: Ingredient;
  edittedIndex: number;
  units: string[];
  @ViewChild('unitGroup') unitGroup;

  shoppingEditForm: FormGroup;
  constructor(private shoppingListService: ShoppingListService, private renderer: Renderer2) { }

  ngOnInit() {
    this.shoppingEditForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, Validators.required),
      'unit': new FormControl('units')
    });

    this.units = this.shoppingListService.getUnits();

    this.shoppingListService.itemToEditIndex.subscribe( (index: number) => {
      this.editMode = true;
      this.edittedIngredient = this.shoppingListService.getIngredient(index);
      this.shoppingEditForm.setValue({
        'name': this.edittedIngredient.name,
        'amount': this.edittedIngredient.amount,
        'unit': this.edittedIngredient.unit
      });
      this.edittedIndex = index;
    });
  }

  onAdd() {
    this.shoppingListService.addIngredient(
      new Ingredient(this.shoppingEditForm.get('name').value,
      Number(this.shoppingEditForm.get('amount').value),
      this.shoppingEditForm.get('unit').value)
    );
  }

  onUpdate() {
    this.shoppingListService.updateIngredient(this.edittedIndex, new Ingredient(this.shoppingEditForm.get('name').value,
      Number(this.shoppingEditForm.get('amount').value),
      this.shoppingEditForm.get('unit').value));
    this.shoppingEditForm.reset();
    this.editMode = false;
  }

  onClear() {
    this.editMode = false;
    this.shoppingEditForm.reset({'unit': 'units'});

    const currentActiveLabel = this.unitGroup.nativeElement.querySelector('.active');
    const unitsLabel = this.unitGroup.nativeElement.children[0];
    if (currentActiveLabel !== unitsLabel) {
      console.log('here');
      this.renderer.removeClass(currentActiveLabel, 'active');
      this.renderer.addClass(unitsLabel, 'active');
    }
  }

  onUnitClick(button) {

    const label = button.parentElement;
    const currentActiveLabel = label.parentElement.querySelector('.active');
    if (currentActiveLabel != null) {
      this.renderer.removeClass(currentActiveLabel, 'active');
    }
    this.renderer.addClass(label, 'active');
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.edittedIndex);
    this.onClear();
  }

}
