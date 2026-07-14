import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Difficulty, Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  imports: [],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css',
})
export class RecipeCardComponent {

  @Input({ required: true }) recipe!: Recipe;
  @Input() categoryName: string = '';
  @Input() isFavorite: boolean = false;

  @Output() favoriteToggle = new EventEmitter<number>();
  @Output() cardClick = new EventEmitter<number>(); 

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
