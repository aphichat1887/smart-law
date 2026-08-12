// src/app/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminItem {
  email: string;
  role: 'admin' | 'super_admin';
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private get requesterEmail(): string {
    return localStorage.getItem('adminEmail') ?? '';
  }

  listAdmins(): Observable<AdminItem[]> {
    return this.http.get<AdminItem[]>(`${this.apiUrl}/admin/list`, {
      params: { requester_email: this.requesterEmail },
    });
  }

  createAdmin(newEmail: string, newPassword: string): Observable<{ success: boolean; email: string }> {
    return this.http.post<{ success: boolean; email: string }>(`${this.apiUrl}/admin/create`, {
      requester_email: this.requesterEmail,
      new_email: newEmail,
      new_password: newPassword,
    });
  }

  deleteAdmin(targetEmail: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `${this.apiUrl}/admin/${encodeURIComponent(targetEmail)}`,
      { body: { requester_email: this.requesterEmail } }
    );
  }
}
