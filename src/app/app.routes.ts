import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { SignUpComponent } from './features/sign-up/sign-up.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component/home.component';
import { authGuard } from './core/guards/auth/auth-guard';
import { noAuthGuard } from './core/guards/no-auth/no-auth-guard';

export const routes: Routes = [
    {
        path: 'auth',
        canActivate: [noAuthGuard],
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'sign-up',
                component: SignUpComponent
            }
        ]
    },
    { path: '',
        canActivate: [authGuard],
        children: [
           {
                path: '',
                component: HomeComponent,
                pathMatch: 'full',
            }, 
        ],
    },
    { path: '**',
        component: NotFoundComponent
    },
];
