import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Log, Level } from 'ng2-logger/ng2-logger';
const log = Log.create('AddCmp()');
log.color = 'orange';

import { AddTaskCmp } from './add-task';

@Component({
  templateUrl: './add.html'
})
export class AddCmp {
  type: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.type = params['type'];
    });
  }
}