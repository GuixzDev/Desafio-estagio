import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee, RecordsService } from './records.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  recordForm: FormGroup;
  employees: Employee[] = [];
  isLoadingEmployees = false;
  isSubmitting = false;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' | null = null;

  constructor(
    private fb: FormBuilder,
    private recordsService: RecordsService
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.recordForm = this.fb.group({
      funcionario_id: ['', [Validators.required]],
      data_referencia: [today, [Validators.required]],
      quantidade_entregas: [0, [Validators.required, Validators.min(0)]],
      observacao: ['']
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoadingEmployees = true;
    this.recordsService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoadingEmployees = false;
      },
      error: () => {
        this.isLoadingEmployees = false;
      }
    });
  }

  onSubmit(): void {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      this.feedbackType = 'error';
      this.feedbackMessage = 'Preencha todos os campos obrigatórios corretamente.';
      return;
    }

    this.isSubmitting = true;
    this.feedbackMessage = null;
    this.feedbackType = null;

    const formValue = this.recordForm.value;
    const payload = {
      funcionario_id: Number(formValue.funcionario_id),
      data_referencia: formValue.data_referencia,
      quantidade_entregas: Number(formValue.quantidade_entregas),
      observacao: formValue.observacao?.trim() || undefined
    };

    this.recordsService.createRecord(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.feedbackType = 'success';
        this.feedbackMessage = 'Registro de entrega salvo com sucesso!';
        const today = new Date().toISOString().split('T')[0];
        this.recordForm.reset({
          funcionario_id: '',
          data_referencia: today,
          quantidade_entregas: 0,
          observacao: ''
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.feedbackType = 'error';
        if (err.status === 422) {
          this.feedbackMessage = 'Dados inválidos. A quantidade de entregas não pode ser negativa.';
        } else {
          this.feedbackMessage = 'Erro de comunicação com o servidor ao salvar o registro.';
        }
      }
    });
  }
}
