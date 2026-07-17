import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateRecipePayload, Recipe } from '../../../models/recipe.model';

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

  delete(recipeId: number): Observable<void>{
    return this.http.delete<void>(`${this.url}/recipe/${recipeId}`);
  }

  create(payload: CreateRecipePayload, file: File | null): Observable<Recipe> {
    const formData = new FormData();

    formData.append(
      'recipeDTO',
      new Blob([JSON.stringify(payload)], { type: 'application/json' })
    );

    if (file) {
      formData.append('file', file);
    }

    // Pas de Content-Type manuel : le navigateur le fixe automatiquement
    // avec le bon boundary pour le multipart/form-data
    console.log(formData);
    return this.http.post<Recipe>(`${this.url}/recipe`, formData);
  }
}
