import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class TasksService {
    private _http: HttpClient = inject(HttpClient);
    private _baseUrl = 'http://localhost:5262';

    getTasks() {
        return this._http.get(`${this._baseUrl}/api/tasks`)
    }
}