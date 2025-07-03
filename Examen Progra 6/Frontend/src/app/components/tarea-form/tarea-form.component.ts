import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TareaService } from '../../services/tarea.service';
import { Tarea, TareaCreate, TareaUpdate } from '../../models/tarea.model';

@Component({
  selector: 'app-tarea-form',
  templateUrl: './tarea-form.component.html',
  styleUrls: ['./tarea-form.component.css']
})
export class TareaFormComponent implements OnChanges {
  @Input() tareaToEdit?: Tarea;
  @Output() tareaCreated = new EventEmitter<Tarea>();
  @Output() tareaUpdated = new EventEmitter<Tarea>();

  tareaForm: FormGroup;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private tareaService: TareaService
  ) {
    this.tareaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      fechaLimite: ['', Validators.required],
      prioridad: [1, [Validators.required, Validators.min(1), Validators.max(3)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tareaToEdit'] && this.tareaToEdit) {
      this.isEditing = true;
      this.populateForm(this.tareaToEdit);
    }
  }

  populateForm(tarea: Tarea): void {
    const fechaLimiteFormatted = new Date(tarea.fechaLimite).toISOString().split('T')[0];
    
    this.tareaForm.patchValue({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fechaLimite: fechaLimiteFormatted,
      prioridad: tarea.prioridad
    });
  }

  onSubmit(): void {
    if (this.tareaForm.valid) {
      const formValue = this.tareaForm.value;
      
      if (this.isEditing && this.tareaToEdit) {
        const tareaUpdate: TareaUpdate = {
          id: this.tareaToEdit.id,
          titulo: formValue.titulo,
          descripcion: formValue.descripcion,
          fechaLimite: new Date(formValue.fechaLimite),
          completada: this.tareaToEdit.completada,
          prioridad: formValue.prioridad,
          fechaCreacion: this.tareaToEdit.fechaCreacion
        };

        this.tareaService.updateTarea(tareaUpdate).subscribe({
          next: () => {
            this.tareaUpdated.emit();
            this.resetForm();
          },
          error: (error) => {
            console.error('Error al actualizar tarea:', error);
          }
        });
      } else {
        const tareaCreate: TareaCreate = {
          titulo: formValue.titulo,
          descripcion: formValue.descripcion,
          fechaLimite: new Date(formValue.fechaLimite),
          prioridad: formValue.prioridad
        };

        this.tareaService.createTarea(tareaCreate).subscribe({
          next: (tarea) => {
            this.tareaCreated.emit(tarea);
            this.resetForm();
          },
          error: (error) => {
            console.error('Error al crear tarea:', error);
          }
        });
      }
    }
  }

  resetForm(): void {
    this.tareaForm.reset({
      titulo: '',
      descripcion: '',
      fechaLimite: '',
      prioridad: 1
    });
    this.isEditing = false;
    this.tareaToEdit = undefined;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  // Getters para acceder a los controles del formulario
  get titulo() { return this.tareaForm.get('titulo'); }
  get descripcion() { return this.tareaForm.get('descripcion'); }
  get fechaLimite() { return this.tareaForm.get('fechaLimite'); }
  get prioridad() { return this.tareaForm.get('prioridad'); }
}