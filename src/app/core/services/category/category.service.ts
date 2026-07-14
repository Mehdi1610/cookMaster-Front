import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Category } from '../../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}`;

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.url}/categories`);
  }
}
