import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user/user.service';
import { authCommonImports } from '../../../features/auth.common-imports';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home.component',
  imports: [authCommonImports],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit{



logout(): void {
  this.authService.logout();
}

private readonly userService = inject(UserService);
private readonly authService = inject(AuthService);
private readonly toastService = inject(ToastService);
private readonly router = inject(Router);
user: any;


ngOnInit(): void {


}
}
