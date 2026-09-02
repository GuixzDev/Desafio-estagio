import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id: number;
  nome: string;
  departamento: string;
}

export interface RecordPayload {
  funcionario_id: number;
  data_referencia: string;
  quantidade_entregas: number;
  observacao?: string;
}

export interface RecordResponse {
  id: number;
  funcionario_id: number;
  funcionario_nome: string;
  departamento: string;
  data_referencia: string;
  quantidade_entregas: number;
  observacao?: string;
  criado_em?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
  }

  createRecord(payload: RecordPayload): Observable<RecordResponse> {
    return this.http.post<RecordResponse>(`${this.apiUrl}/records`, payload);
  }
}

