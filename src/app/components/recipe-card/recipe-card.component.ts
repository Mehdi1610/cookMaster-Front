import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { Difficulty, Recipe } from '../../models/recipe.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-recipe-card',
  imports: [],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
})
export class RecipeCardComponent  {


  @Input({ required: true }) recipe!: Recipe;
  @Input() categoryName: string = '';
  @Input() isFavorite: boolean = false;

  @Output() favoriteToggle = new EventEmitter<number>();
  @Output() cardClick = new EventEmitter<number>(); 

//Gestion de l'image default image + url authorisation

  readonly defaultImage: string = 'img/recipe-placeholder.jpg';
  imageError= signal(false);

  constructor(private sanitizer: DomSanitizer) {}


  get displayImageUrl(): SafeUrl {
  if (!this.recipe.imageUrl || this.imageError()) {
    return this.defaultImage;
  }
  
  // 1. clean url ( sans espace)
  let cleanUrl = String(this.recipe.imageUrl).trim();
  
  // 2. retire tout ce qu'il y a avant "http"
  const httpIndex = cleanUrl.indexOf('http');
  if (httpIndex !== -1) {
    cleanUrl = cleanUrl.substring(httpIndex);
  }
  
  // 3. retire les guillemets a la fin
  cleanUrl = cleanUrl.replace(/["']/g, '');

  return this.sanitizer.bypassSecurityTrustUrl(cleanUrl);
}

  onImageError(): void {
    this.imageError.set(true);
  }

  readonly difficultyLabels: Record<Difficulty, string> = {
    Facile: 'Facile',
    Moyen: 'Moyen',
    Difficile: 'Difficile',
  };

  onToggleFavorite(event: Event): void{
    event.stopPropagation();
    this.favoriteToggle.emit(this.recipe.id);
  }

  onCardClick(event: Event): void{
    this.cardClick.emit(this.recipe.id);
  }

}
