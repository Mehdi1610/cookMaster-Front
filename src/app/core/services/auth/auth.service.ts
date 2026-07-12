import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../../../models/user.models';
import { JwtToken } from '../../../models/jwt-token.model';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { RegisterRequest } from '../../../models/registerRequest.model';

const TOKEN_STORAGE_KEY = 'jwtToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly url = `${environment.apiUrl}`;
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private jwtToken: JwtToken | null = null;

  constructor(){
    this.loadTokenFromStorage();
  }


   private loadTokenFromStorage(): void {
        const tokenJson = localStorage.getItem(TOKEN_STORAGE_KEY);
        try {
            this.jwtToken = JSON.parse(tokenJson ?? '') as JwtToken;
        } catch {
            this.jwtToken = null;
        }
    }

  private saveTokenToStorage(token: JwtToken): void {
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
    }
  private clearTokenFromStorage(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }  

   

  public login(email: string, password: string): Observable<void> {
        const body = { email, password };

        return this.httpClient.post<JwtToken>(`${this.url}/auth/login`, body).pipe(
            tap((token) => {
                this.jwtToken = token;
                this.saveTokenToStorage(token);
               // this.userService.loadCurrentUser();
            }),
            map(() => void 0),
        );
    }

    public getAccessToken(): string | null {
        return this.jwtToken?.accessToken ?? null;
    }

    public isAuthenticated(): boolean {
        return this.jwtToken?.accessToken != null;
    }

    public hasRefreshToken(): boolean {
        return this.jwtToken?.refreshToken != null;
    }

    public refreshToken(): Observable<string | null> {
        const body = { refreshToken: this.jwtToken?.refreshToken };

        return this.httpClient.post<JwtToken>(`${this.url}/refresh`, body).pipe(
            tap((newToken) => {
                this.jwtToken = newToken;
                this.saveTokenToStorage(newToken);
            }),
            map((newToken) => newToken.accessToken),
            catchError((err: HttpErrorResponse) => {
                console.log(
                    `Token refresh failed: ${err.message} (Status: ${err.status})`,
                );
                this.logout();
                return of(null);
            }),
        );
    }
    
    public register(registerRequest: RegisterRequest): Observable<User> {
        return this.httpClient.post<User>(`${this.url}/auth/register`, {
            ...registerRequest,
        });
    }
  public logout(): void {
        this.httpClient.post<void>(`${this.url}/logout`, null)
        .subscribe();
        this.jwtToken = null;
        this.clearTokenFromStorage();
        this.router.navigate(['/auth/login']);
    }
}
