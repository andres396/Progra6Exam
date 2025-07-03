import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea, TareaCreate, TareaUpdate } from '../models/tarea.model';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiUrl = 'https://localhost:7229/api/tareas';

  constructor(private http: HttpClient) { }

  // Obtener todas las tareas con filtros opcionales
  getTareas(completada?: boolean, orderBy?: string, buscar?: string): Observable<Tarea[]> {
    let params = new HttpParams();
    
    if (completada !== undefined) {
      params = params.set('completada', completada.toString());
    }
    
    if (orderBy) {
      params = params.set('orderBy', orderBy);
    }
    
    if (buscar) {
      params = params.set('buscar', buscar);
    }

    return this.http.get<Tarea[]>(this.apiUrl, { params });
  }

  // Obtener una tarea específica
  getTarea(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.apiUrl}/${id}`);
  }

  // Crear nueva tarea
  createTarea(tarea: TareaCreate): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, tarea);
  }

  // Actualizar tarea existente
  updateTarea(tarea: TareaUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${tarea.id}`, tarea);
  }

  // Eliminar tarea
  deleteTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Marcar tarea como completada/incompleta
  toggleCompletada(tarea: Tarea): Observable<void> {
    const tareaUpdate: TareaUpdate = {
      ...tarea,
      completada: !tarea.completada
    };
    return this.updateTarea(tareaUpdate);
  }
}