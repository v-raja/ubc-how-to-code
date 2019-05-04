import { Component, OnInit } from '@angular/core';

import { ServersService } from '../servers.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CanComponenetDeactivate} from './can-deactivate-guard.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit, CanComponenetDeactivate {
  server: {id: number, name: string, status: string};
  serverName = '';
  serverStatus = '';
  allowEdit = 0;
  changesSaved = false;


  constructor(private serversService: ServersService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.server = this.serversService.getServer(Number(this.route.snapshot.params['id']));
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
    this.route.queryParams.subscribe((params: Params) => {
      this.allowEdit = +params['allowEdit'];
    });
    this.route.params.subscribe((params: Params) => {
      this.server = this.serversService.getServer(Number(params['id']));
    });
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {name: this.serverName, status: this.serverStatus});
    this.changesSaved = true;
    this.router.navigate(['../'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.allowEdit) {
      return true;
    }
    if ((this.serverName !== this.server.name || this.serverStatus !== this.server.status)
     && !this.changesSaved) {
      return confirm('Do you want to discard the changes?');
    } else {
      return true;
    }
  }

}
