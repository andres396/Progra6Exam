import { Component, ViewChild } from '@angular/core';
import { Tarea } from './models/tarea.model';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sistema de Gestión de Tareas Personales';
  tareaToEdit?: Tarea;

  @ViewChild('taskList') taskList!: TaskListComponent;

  onTareaCreated(tarea: Tarea): void {
    this.taskList.loadTareas();
  }

  onTareaUpdated(tarea: Tarea): void {
    this.taskList.loadTareas();
    this.tareaToEdit = undefined;
  }

  onEditTarea(tarea: Tarea): void {
    this.tareaToEdit = tarea;
  }
}