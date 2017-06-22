import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Task } from '../../../interfaces';

@Injectable()
export class AddTaskApi {
  private tasks: Task[] = [];

  constructor(private http: Http) {

  }

  addTask(task: Task) {
    this.tasks.push(task);
    const body = JSON.stringify(task);
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post('http://localhost:8000/task', body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  getTasks() {
    return this.http.get('http://localhost:8000/task')
      .map((response: Response) => {
        const tasks = response.json().obj;
        let tasksFormatted: Task[] = [];
        
        for(let task of tasks) {
          tasksFormatted.push(new Task(task.name, 'desc', task.id, null));
        }

        this.tasks = tasksFormatted;
        return tasksFormatted;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  removeTask(task: Task) {
    this.tasks.splice(this.tasks.indexOf(task), 1);
  }
}