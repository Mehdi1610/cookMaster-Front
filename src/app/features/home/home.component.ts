import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { UserService } from '../../core/services/user/user.service';
import { authCommonImports } from '../auth.common-imports';
import { AuthService } from '../../core/services/auth/auth.service';
import { HomeTab, NavTabComponent } from '../../components/nav-tab/nav-tab.component';
import { FilterToolComponent,  RecipeFilters } from '../../components/filter-tool/filter-tool.component';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { FavoriteService } from '../../core/services/favorite/favorite.service';
import { CategoryService } from '../../core/services/category/category.service';
import { RecipeService } from '../../core/services/recipe/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { Router } from '@angular/router';
import { CreateRecipeComponent } from '../../components/create-recipe/create-recipe.component';
import { FilterService } from '../../core/services/filter/filter.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home.component',
  imports: [authCommonImports, NavTabComponent, FilterToolComponent, RecipeCardComponent, CreateRecipeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy{


private readonly userService = inject(UserService);
private readonly router = inject(Router);
private readonly authService = inject(AuthService);
private readonly favoriteService = inject(FavoriteService);
private readonly categoryService = inject(CategoryService);
private readonly recipeService = inject(RecipeService);
private readonly filterervice = inject(FilterService);


currentTab = signal<HomeTab>('my-recipe');
activeFilters = signal<RecipeFilters>({ category: null, difficulty: null });
searchQuery = signal<string>('');
allRecipes = signal<Recipe[]>([]);
favoriteIds = signal<Set<number>>(new Set());
categoryNames = signal<Map<number,string>>(new Map());
private searchSub!: Subscription;

displayedRecipes = computed(() =>{
  //filtrage par currentTab
  let recipes= this.currentTab() === 'favorite' 
  ? this.allRecipes().filter((r) => this.favoriteIds().has(r.id))
  : this.allRecipes();

  //filtrage par searchBarre
  const query = this.searchQuery().trim().toLocaleLowerCase();
  if(query){
    recipes = recipes.filter((r) => r.title.toLocaleLowerCase().includes(query));
  }

  const filters = this.activeFilters();
  //filtrage par category
  if(filters.category){
    recipes = recipes.filter((r) => r.categoryId === filters.category);
  }
  //filtrage par difficulté
  if(filters.difficulty){
    recipes = recipes.filter((r)=> r.difficulty === filters.difficulty);
  }
  return recipes;
})


ngOnInit(): void {
  this.userService.currentUser$.subscribe((user)=>{
    if (!user) return;

    this.recipeService.getAll().subscribe((recipes) => {
      this.allRecipes.set(recipes);
    });

    
    this.favoriteService.getAll().subscribe((favorites) => {
      this.favoriteIds.set(new Set(favorites.map((r) => r.id)));
    });

    this.categoryService.getAll().subscribe((categories) => {
      const map = new Map(categories.map((c) => [c.id, c.name]));
      this.categoryNames.set(map);
    });

    this.searchSub = this.filterervice.searchQuery$.subscribe(query => {
      this.searchQuery.set(query);
    });
  });
  }

  onRecipeClick(recipeId: number): void {
      this.router.navigate(['/recipe/', recipeId]);
}

onFavoriteToggle(recipeId: number): void {
    const isFav = this.favoriteIds().has(recipeId);
    const action = isFav ? this.favoriteService.remove(recipeId) : this.favoriteService.add(recipeId);

    action.subscribe(() => {
      this.favoriteIds.update((ids) => {
        const updated = new Set(ids);
        isFav ? updated.delete(recipeId) : updated.add(recipeId);
        return updated;
      });
    });
  }

categoryName(CategoryId: number): string{
  return this.categoryNames().get(CategoryId) ?? '';
}



onTabChange(tab: HomeTab) {
  this.currentTab.set(tab);
}

onFiltersChange(filters: RecipeFilters): void{
  this.activeFilters.set(filters);
  console.log(filters);
}


logout(): void {
  this.authService.logout();
}

ngOnDestroy(): void {
  if (this.searchSub) {
    this.searchSub.unsubscribe();
  }
}

}
