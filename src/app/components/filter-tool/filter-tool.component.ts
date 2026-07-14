import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CategoryService } from '../../core/services/category/category.service';

export type Difficulty = 'Facile' | 'Moyen' | 'Difficile' | null;

export interface RecipeFilters{
  category: number | null;
  difficulty: Difficulty;
}
interface CategoryOption{
  label: string;
  value: number | null;
}


@Component({
  selector: 'app-filter-tool',
  imports: [CommonModule, FormsModule, SelectModule, ButtonModule],
  templateUrl: './filter-tool.component.html',
  styleUrl: './filter-tool.component.css',
})
export class FilterToolComponent implements OnInit{
  
    private readonly categoryService = inject(CategoryService);

@Output() filtersChange= new EventEmitter<RecipeFilters>();

  categories = signal<CategoryOption[]>([{ label: 'Toutes les catégories', value: null }]);

  

  difficulties: {label: string, value: Difficulty } [] =[
     { label: 'FACILE', value: 'Facile'  },
    { label: 'MOYEN', value: 'Moyen' },
    { label: 'DIFFICILE', value: 'Difficile' },
  ];

  selectedCategory = signal<number|null>(null);
  selectedDifficulty = signal<Difficulty>(null);

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next:(categories) => {
        const options = categories.map((c) => ({label: c.name, value: c.id}));
        this.categories.set([{label: 'Toutes les catégories', value: null},
          ...options
        ]);
      },
      error:() =>{

      },
    });
  }

  onCategoryChange(value: number | null): void{
    this.selectedCategory.set(value);
    this.emitFilters();
  }

  toggleDifficulty(value: Difficulty): void{
    this.selectedDifficulty.set(this.selectedDifficulty() === value ? null : value);
    this.emitFilters();
  }

  resetFilters(): void{
    this.selectedCategory.set(null);
    this.selectedDifficulty.set(null);
    this.emitFilters();
  }

  private emitFilters(): void {
    this.filtersChange.emit({
      category: this.selectedCategory(),
      difficulty: this.selectedDifficulty(),
    });
  }
}
