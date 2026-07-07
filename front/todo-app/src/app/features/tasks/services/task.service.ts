import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Task } from "../models/task.model";

@Injectable({
    providedIn: "root"
})
export class TasksService {
    private _http: HttpClient = inject(HttpClient);
    private _baseUrl = 'http://localhost:5262';

    getTasks(): Observable<Task[]> {
        return this._http.get<Task[]>(`${this._baseUrl}/api/tasks`);
    }

    createTask(title: string): Observable<Task> {
        return this._http.post<Task>(`${this._baseUrl}/api/tasks`, { title });
    }

    updateStatusTask(id: number): Observable<Task> {
        return this._http.put<Task>(`${this._baseUrl}/api/tasks/${id}`, {});
    }
}