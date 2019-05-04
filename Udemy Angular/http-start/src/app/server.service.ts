import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class ServerService {
  constructor(private http: Http) {
  }

  storeServers(servers: any[]) {
    return this.http.put('https://ng-http-a05ca.firebaseio.com/data.json', servers);
  }

  getServers() {
    return this.http.get('https://ng-http-a05ca.firebaseio.com/data.json')
      .map(
        (response: Response) => {
        const data = response.json();
        return data;
      });
  }
}
