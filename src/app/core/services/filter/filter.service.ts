import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  
  //  BehaviorSubject stocke le terme de recherche actuel
  private searchQuerySubject = new BehaviorSubject<string>('');
  
  // Observable que le composant Home va écouter
  searchQuery$ = this.searchQuerySubject.asObservable();

  // Méthode que le Header va appeler à chaque touche enfoncée
  updateSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }
}
