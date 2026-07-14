import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Recipe } from '../../../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}`;


  getAll(): Observable<Recipe[]> {
  return this.http.get<Recipe[]>(`${this.url}/recipes`);
}

  getById(id: number): Observable<Recipe>{
    return this.http.get<Recipe>(`${this.url}/recipe/${id}`);
  }

  toggleFavorite(recipeId: string): Observable<void> {
    return this.http.post<void>(`${this.url}/recipe/${recipeId}/favorite`, {});
  }
}
