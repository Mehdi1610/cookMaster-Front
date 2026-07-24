import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastService } from '../../core/services/toast/toast.service';
import { Difficulty } from '../../models/recipe.model';
import { Unit } from '../../models/ingredient.model';
import { RecipeService } from '../../core/services/recipe/recipe.service';
import { CategoryService } from '../../core/services/category/category.service';
import { HomeTab } from '../nav-tab/nav-tab.component';

@Component({
  selector: 'app-create-recipe',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
  ],
  templateUrl: './create-recipe.component.html',
  styleUrl: './create-recipe.component.css',
})
export class CreateRecipeComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly recipeService = inject(RecipeService);
  private readonly categoryService = inject(CategoryService);
  private readonly toastService = inject(ToastService);

  recipeForm!: FormGroup;

  categories = signal<{ label: string; value: number }[]>([]);
  imagePreview = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  submitting = signal(false);
  isDragging = signal(false);

  @Output() tabChange = new EventEmitter<HomeTab>();

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
    this.recipeForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      preparationTime: [null, [Validators.required, Validators.min(1)]],
      difficulty: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      steps: this.formBuilder.array([this.createStepGroup()]),
      ingredients: this.formBuilder.array([this.createIngredientGroup()]),
    });

    this.categoryService.getAll().subscribe((categories) => {
      this.categories.set(categories.map((c) => ({ label: c.name, value: c.id })));
    });
  }

activeTab= signal<HomeTab>('create');

selectTab() {
this.activeTab.set("my-recipe");
this.tabChange.emit("my-recipe");
}

  // --- Steps FormArray ---

  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  private createStepGroup(): FormGroup {
    return this.formBuilder.group({
      description: ['', Validators.required],
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

  // --- Ingredients FormArray ---

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  private createIngredientGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      quantity: [null, [Validators.required]],
      unit: [null, Validators.required],
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



  // --- Image : drag & drop + sélection classique ---

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
    if (!file) return;

    this.handleFile(file);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.handleFile(file);
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
      steps: formValue.steps.map((step: { description: string }, index: number) => ({
        description: step.description,
        stepNumber: index + 1,
      })),
      ingredients: formValue.ingredients,
    };

    this.submitting.set(true);

    this.recipeService.create(payload, this.selectedFile()).subscribe({
      next: (recipe) => {
        this.toastService.success('Recette créée', `"${recipe.title}" a été ajoutée avec succès`);
        this.router.navigate(['/recipe', recipe.id]);
      },
      error: () => {
        this.submitting.set(false);
        this.toastService.error('Erreur', 'Impossible de créer la recette. Veuillez réessayer.');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/']);

  }
}