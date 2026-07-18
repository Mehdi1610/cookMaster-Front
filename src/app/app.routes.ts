import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import SignUpComponent from './features/sign-up/sign-up.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth/auth-guard';
import { noAuthGuard } from './core/guards/no-auth/no-auth-guard';
import { RecipeInfoComponent } from './components/recipe-info/recipe-info.component';
import { UpdateRecipeComponent } from './components/update-recipe/update-recipe.component';

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
    {
        path:'recipe/:id', component:RecipeInfoComponent,
    },
    {
        path:'recipe/:id/edit', component:UpdateRecipeComponent,
    },
    { path: '**',
        component: NotFoundComponent
    },
];
