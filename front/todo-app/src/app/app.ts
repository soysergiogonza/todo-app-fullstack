import { Component, inject, signal, WritableSignal } from '@angular/core';
import { TasksService } from './features/tasks/services/task.service';
import { Task } from './features/tasks/models/task.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected tasks: WritableSignal<Task[]> = signal([]);
  protected isLoading: WritableSignal<boolean> = signal(true);
  protected error: WritableSignal<string | null> = signal(null);
  private _taskService: TasksService = inject(TasksService);
  private _fb: FormBuilder = inject(FormBuilder);

  taskForm = this._fb.group({
    newTaskTitle: ['', Validators.required],
  })

  ngOnInit() {
    this._loadTasks()
  }

  private _loadTasks() {
    this.isLoading.set(true);

    this._taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set('Error al cargar tareas: ' + error.message);
        this.isLoading.set(false);
      },
    })
  }

  protected onSubmit() {
    const title = this.taskForm.value.newTaskTitle;
    if (title) {
      this.createTask(title);
    }
    this.taskForm.reset();
  }

  protected createTask(title: string) {
    this._taskService.createTask(title).subscribe({
      next: (task: Task) => {
        this.tasks.set([...this.tasks(), task]);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set('Error al crear tarea: ' + error.message);
      },
    })
  }

  protected updateStatusTask(id: number) {
    this._taskService.updateStatusTask(id).subscribe({
      next: (response: Task) => {
        this.tasks.update((tasks) => tasks.map((task) => task.id === response.id ? response : task));
      },
      error: (error: HttpErrorResponse) => {
        this.error.set('Error al crear tarea: ' + error.message);
      },
    })
  }
}