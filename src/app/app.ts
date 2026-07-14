import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { UserService } from './core/services/user/user.service';
import { HeaderComponent } from './components/header/header.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Cook Master ');
  private readonly userService = inject(UserService);
  showHeader = signal(true);
  private readonly router = inject(Router);

    constructor() {
        this.userService.loadCurrentUser();
        this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.showHeader.set(!event.urlAfterRedirects.startsWith('/auth'));
      });
    }
}
