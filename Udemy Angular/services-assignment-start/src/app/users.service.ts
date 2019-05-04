import {EventEmitter, Injectable} from '@angular/core';
import {CounterService} from './counter.service';

@Injectable()
export class UsersService {
  activeUsers = ['Max', 'Anna'];
  inactiveUsers = ['Chris', 'Manu'];

  constructor(private countService: CounterService) {
  }

  setToActive(user: string) {
    this.activeUsers.push(user);
    this.inactiveUsers.splice(this.inactiveUsers.indexOf(user), 1);
    this.countService.incrementInactiveToActiveCounter();
  }

  setToInactive(user: string) {
    this.inactiveUsers.push(user);
    this.activeUsers.splice(this.activeUsers.indexOf(user), 1);
    this.countService.incrementActiveToInactiveCounter();
  }


}
