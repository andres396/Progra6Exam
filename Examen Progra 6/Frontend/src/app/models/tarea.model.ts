export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  fechaLimite: Date;
  completada: boolean;
  prioridad: number;
  fechaCreacion: Date;
}

export interface TareaCreate {
  titulo: string;
  descripcion: string;
  fechaLimite: Date;
  prioridad: number;
}

export interface TareaUpdate {
  id: number;
  titulo: string;
  descripcion: string;
  fechaLimite: Date;
  completada: boolean;
  prioridad: number;
  fechaCreacion: Date;
}