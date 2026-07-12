import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, inject, OnInit, Output, signal, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { User } from '../../../models/user.models';
import { UserService } from '../../../core/services/user/user.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Menu } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';

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
export class HeaderComponent implements OnInit{

  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);


  @Output() search = new EventEmitter<string>();
  user: User | null | undefined;
  searchControl = new FormControl('');
  mobileSearchOpen = signal(false);

  ngOnInit(): void {
    this.userService.currentUser$.subscribe({
      next: user => this.user = user,
      error: (err: HttpErrorResponse) => console.log(err)
    });
  }
  
   onSearch(): void {
    const value = this.searchControl.value?.trim() ?? '';
    if (value) {
      this.search.emit(value);
      this.mobileSearchOpen.set(false);
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
