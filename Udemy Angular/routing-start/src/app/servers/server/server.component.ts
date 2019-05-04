import { Component, OnInit } from '@angular/core';

import { ServersService } from '../servers.service';
import {ActivatedRoute, Data, Params, Router} from '@angular/router';
import {ServerResolver} from './server-resolver.service';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {
  server: {id: number, name: string, status: string};


  constructor(private serversService: ServersService, private route: ActivatedRoute,
              private router: Router) {
    // this.server = this.serversService.getServer(1);
  }

  ngOnInit() {
    this.route.data.subscribe((data: Data) => {
      this.server = data['serverResolver'];
    });


    // this.server = this.serversService.getServer(Number(this.route.snapshot.params['id']));
    // this.route.params.subscribe((params: Params) => {
    //   this.server = this.serversService.getServer(Number(params['id']));
    // });
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }
}
