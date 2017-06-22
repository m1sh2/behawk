import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AddTaskApi } from './add-task.api';
import { Task } from '../../../interfaces';

import { Log, Level } from 'ng2-logger/ng2-logger';
const log = Log.create('AddTaskCmp()');
log.color = 'orange';

@Component({
  selector: 'add-task',
  templateUrl: './add-task.html'
})
export class AddTaskCmp {
  tasks: Task[] = [];

  constructor(private addTaskApi: AddTaskApi) {
    
  }

  ngOnInit() {
    this.addTaskApi.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

  onSubmit(form: NgForm) {
    log.d('onSubmit()', form);
    const task = new Task(form.value.name, '');
    this.addTaskApi
      .addTask(task)
      .subscribe(
        data => log.i('onSubmit() success', data),
        error => log.i('onSubmit() error', error)
      );
  }
}