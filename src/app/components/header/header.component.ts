import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, signal, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { User } from '../../models/user.models';
import { UserService } from '../../core/services/user/user.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Menu } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { FilterService } from '../../core/services/filter/filter.service';
import { HomeTab } from '../nav-tab/nav-tab.component';

@Component({
  selector: 'app-header',
  imports: [
     CommonModule,
    ReactiveFormsModule,
    ToolbarModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy{

  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly filterService = inject(FilterService);


  @Output() search = new EventEmitter<string>();

  user: User | null | undefined;
  searchControl = new FormControl('');
  mobileSearchOpen = signal(false);

  private searchSub!: Subscription;

  ngOnInit(): void {
    this.userService.currentUser$.subscribe({
      next: user => this.user = user,
      error: (err: HttpErrorResponse) => console.log(err)
    });

    // On écoute en temps réel chaque caractère ajouté ou supprimé
    this.searchSub = this.searchControl.valueChanges.pipe(
      debounceTime(300),        // Attend 300ms de pause (évite de spammer le filtre à chaque lettre)
      distinctUntilChanged()    // Ne déclenche le filtre que si le texte a changé
    ).subscribe(value => {
      // On envoie la valeur (ou une chaîne vide si null) au service partagé
      this.filterService.updateSearchQuery(value || '');
    });
  }

  activeTab= signal<HomeTab>(("my-recipe"));

navigateToHome() {
this.router.navigate(['/'])
}
  

  ngOnDestroy(): void {
    if(this.searchSub){
      this.searchSub.unsubscribe();
    }
   }

  toggleMobileSearch(): void {
    this.mobileSearchOpen.update((open) => !open);
  }

  logout(): void {
    this.user = null;
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
