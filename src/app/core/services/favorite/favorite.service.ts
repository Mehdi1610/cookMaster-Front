import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Recipe } from '../../../models/recipe.model';
import { Favorite } from '../../../models/favorite.model';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {

  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/favorites`;


  getAll(): Observable<Recipe[]>{
    return this.http.get<Recipe[]>(this.url);
  }

  add(recipeId: number): Observable<void>{
    return this.http.post<void>(`${this.url}/${recipeId}`, {});
  }

  remove(recipeId: number): Observable<void>{
    return this.http.delete<void>(`${this.url}/${recipeId}`)
  }

}
