import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { UserService } from '../../core/services/user/user.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RecipeService } from '../../core/services/recipe/recipe.service';

@Component({
  selector: 'app-recipe-info',
  imports: [CommonModule, RouterLink, ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './recipe-info.component.html',
  styleUrl: './recipe-info.component.css',
})
export class RecipeInfoComponent implements OnInit{



  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recipeService = inject(RecipeService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly confirmationService = inject(ConfirmationService);

  recipe = signal<Recipe| null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id){
      this.router.navigate(['/']);
      return;
    }
    this.userService.currentUser$.subscribe((user)=> {
      if(!user) return;
      this.recipeService.getById(id).subscribe({
            next:(recipe) =>{
              this.recipe.set(recipe);
              },
             error: (err) => {
              if (err.status === 403 || err.status === 404) {
                this.toastService.error('Accès refusé', 'Cette recette est introuvable ou ne vous appartient pas');
              } else {
                this.toastService.error('Erreur', 'Impossible de charger la recette');
              }
              this.router.navigate(['/']);
              },
            });
          })
   
  }

  onEditRecipe() {
    const recipe = this.recipe();
    if(!recipe)return;
    this.router.navigate(['/recipe',recipe.id,'edit']);
}
onDeleteRecipe() {
  const r = this.recipe();
      if (!r) return;

      this.confirmationService.confirm({
        header: 'Supprimer cette recette ?',
        message: `Êtes-vous sûr de vouloir supprimer "${r.title}" ? Cette action est irréversible.`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Supprimer',
        rejectLabel: 'Annuler',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.recipeService.delete(r.id).subscribe({
            next: () => {
              this.toastService.success('Recette supprimée', `"${r.title}" a été supprimée avec succès`);
              this.router.navigate(['/']);
            },
            error: () => {
              this.toastService.error('Erreur', 'Impossible de supprimer la recette');
            },
          });
        },
      });
}
}
