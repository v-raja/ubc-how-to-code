export class Ingredient {
  constructor(public name: string, public amount: number, public unit: string) {
    if (unit === undefined) {
      this.unit = 'units';
    }
  }

}
