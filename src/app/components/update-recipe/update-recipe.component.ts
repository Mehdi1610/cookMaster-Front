import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RecipeService } from '../../core/services/recipe/recipe.service';
import { CategoryService } from '../../core/services/category/category.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { Difficulty, Recipe } from '../../models/recipe.model';
import { Unit } from '../../models/ingredient.model';

@Component({
  selector: 'app-update-recipe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
  ],
  templateUrl: './update-recipe.component.html',
  styleUrl: './update-recipe.component.css',
})
export class UpdateRecipeComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recipeService = inject(RecipeService);
  private readonly categoryService = inject(CategoryService);
  private readonly toastService = inject(ToastService);

  recipeId!: number;

  recipeForm!: FormGroup;

  categories = signal<{ label: string; value: number }[]>([]);
  existingImageUrl = signal<string | null>(null);
  imagePreview = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  submitting = signal(false);
  loading = signal(true);
  isDragging = signal(false);

  difficulties: { label: string; value: Difficulty }[] = [
    { label: 'Facile', value: 'Facile' },
    { label: 'Moyen', value: 'Moyen' },
    { label: 'Difficile', value: 'Difficile' },
  ];

  units: { label: string; value: Unit }[] = [
    { label: 'g', value: 'G' },
    { label: 'kg', value: 'KG' },
    { label: 'mL', value: 'ML' },
    { label: 'L', value: 'L' },
    { label: 'c. à soupe', value: 'CAS' },
    { label: 'c. à café', value: 'CAC' },
    { label: 'pièce', value: 'PIECE' },
    { label: 'pincée', value: 'PINCEE' },
    { label: 'au choix', value: 'AUTRE' },

  ];

  ngOnInit(): void {
    this.recipeId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.recipeId) {
      this.router.navigate(['/']);
      return;
    }

    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      preparationTime: [null, [Validators.required, Validators.min(1)]],
      difficulty: [null, Validators.required],
      categoryId: [null, Validators.required],
      ingredients: this.fb.array([]),
      steps: this.fb.array([]),
    });

    this.categoryService.getAll().subscribe((categories) => {
      this.categories.set(categories.map((c) => ({ label: c.name, value: c.id })));
    });

    this.recipeService.getById(this.recipeId).subscribe({
      next: (recipe) => this.populateForm(recipe),
      error: () => {
        this.toastService.error('Erreur', 'Impossible de charger la recette');
        this.router.navigate(['/']);
      },
    });
  }

  private populateForm(recipe: Recipe): void {
    this.recipeForm.patchValue({
      title: recipe.title,
      preparationTime: recipe.preparationTime,
      difficulty: recipe.difficulty,
      categoryId: recipe.categoryId,
    });

    this.existingImageUrl.set(recipe.imageUrl || null);

    const sortedIngredients = [...recipe.ingredients];
    sortedIngredients.forEach((ingredient) => {
      this.ingredients.push(this.createIngredientGroup(ingredient));
    });
    if (sortedIngredients.length === 0) {
      this.ingredients.push(this.createIngredientGroup());
    }

    const sortedSteps = [...recipe.steps].sort((a, b) => a.stepNumber - b.stepNumber);
    sortedSteps.forEach((step) => {
      this.steps.push(this.createStepGroup(step));
    });
    if (sortedSteps.length === 0) {
      this.steps.push(this.createStepGroup());
    }

    this.loading.set(false);
  }

  // --- Ingredients FormArray ---

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  private createIngredientGroup(ingredient?: { id: number; name: string; quantity: number; unit: Unit }): FormGroup {
    return this.fb.group({
      id: [ingredient?.id ?? null],
      name: [ingredient?.name ?? '', Validators.required],
      quantity: [ingredient?.quantity ?? null, [Validators.required]],
      unit: [ingredient?.unit ?? null, Validators.required],
    });
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredientGroup());
  }

  removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  // --- Steps FormArray ---

  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  private createStepGroup(step?: { id: number; description: string }): FormGroup {
    return this.fb.group({
      id: [step?.id ?? null],
      description: [step?.description ?? '', Validators.required],
    });
  }

  addStep(): void {
    this.steps.push(this.createStepGroup());
  }

  removeStep(index: number): void {
    if (this.steps.length > 1) {
      this.steps.removeAt(index);
    }
  }

  // --- Image ---

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.handleFile(file);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleFile(file);
  }

  private handleFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.toastService.error('Format invalide', 'Merci de sélectionner une image (JPG, PNG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.toastService.error('Fichier trop lourd', 'La taille maximale est de 5 MB');
      return;
    }

    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedFile.set(null);
    this.imagePreview.set(null);
    this.existingImageUrl.set(null);
  }

  get displayImage(): string | null {
    return this.imagePreview() ?? this.existingImageUrl();
  }

  // --- Submit ---

  onSubmit(): void {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      this.toastService.error('Formulaire incomplet', 'Merci de remplir tous les champs obligatoires');
      return;
    }

    const formValue = this.recipeForm.value;

    const payload = {
      title: formValue.title,
      preparationTime: formValue.preparationTime,
      difficulty: formValue.difficulty,
      categoryId: formValue.categoryId,
      ingredients: formValue.ingredients.map((i: any) => ({
        id: i.id ?? undefined,
        name: i.name,
        quantity: i.quantity,
        unit: i.unit,
      })),
      steps: formValue.steps.map((s: any, index: number) => ({
        id: s.id ?? undefined,
        description: s.description,
        stepNumber: index + 1,
      })),
    };

    this.submitting.set(true);

    this.recipeService.update(this.recipeId, payload, this.selectedFile()).subscribe({
      next: (recipe) => {
        this.toastService.success('Recette modifiée', `"${recipe.title}" a été mise à jour avec succès`);
        this.router.navigate(['/recipe', recipe.id]);
      },
      error: () => {
        this.submitting.set(false);
        this.toastService.error('Erreur', 'Impossible de modifier la recette. Veuillez réessayer.');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/recipe', this.recipeId]);
  }
}