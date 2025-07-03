import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tareas: Tarea[] = [];
  filtroCompletada: boolean | null = null;
  ordenamiento: string = 'fechaCreacion';
  busqueda: string = '';
  @Output() editTarea = new EventEmitter<Tarea>();

  constructor(private tareaService: TareaService) { }

  ngOnInit(): void {
    this.loadTareas();
  }

  loadTareas(): void {
    this.tareaService.getTareas(
      this.filtroCompletada ?? undefined,
      this.ordenamiento,
      this.busqueda || undefined
    ).subscribe({
      next: (tareas) => {
        this.tareas = tareas;
      },
      error: (error) => {
        console.error('Error al cargar tareas:', error);
      }
    });
  }

  toggleCompletada(tarea: Tarea): void {
    this.tareaService.toggleCompletada(tarea).subscribe({
      next: () => {
        this.loadTareas();
      },
      error: (error) => {
        console.error('Error al actualizar tarea:', error);
      }
    });
  }

  deleteTarea(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.tareaService.deleteTarea(id).subscribe({
        next: () => {
          this.loadTareas();
        },
        error: (error) => {
          console.error('Error al eliminar tarea:', error);
        }
      });
    }
  }

  onEditTarea(tarea: Tarea): void {
    this.editTarea.emit(tarea);
  }

  onFilterChange(): void {
    this.loadTareas();
  }

  onOrderChange(): void {
    this.loadTareas();
  }

  onSearchChange(): void {
    this.loadTareas();
  }

  getPrioridadText(prioridad: number): string {
    switch (prioridad) {
      case 1: return 'Baja';
      case 2: return 'Media';
      case 3: return 'Alta';
      default: return 'Baja';
    }
  }

  getPrioridadClass(prioridad: number): string {
    switch (prioridad) {
      case 1: return 'badge bg-success';
      case 2: return 'badge bg-warning';
      case 3: return 'badge bg-danger';
      default: return 'badge bg-success';
    }
  }
}