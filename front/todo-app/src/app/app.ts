import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TasksService } from './features/tasks/services/tasks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected tasks: WritableSignal<any[]> = signal([]);
  private _taskService: TasksService = inject(TasksService);

  ngOnInit() {
    this.loadTasks()
  }

  private loadTasks() {
    this._taskService.getTasks().subscribe({
      next: (tasks: any) => {
        this.tasks.set(tasks);
      },
      error: () => { },
    })
  }
}