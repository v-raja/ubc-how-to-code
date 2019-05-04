

export class CounterService {
  activeToInactiveCounter = 0;
  inactiveToActiveCounter = 0;

  incrementActiveToInactiveCounter() {
    this.activeToInactiveCounter++;
  }

  incrementInactiveToActiveCounter() {
    this.inactiveToActiveCounter++;
  }
}
