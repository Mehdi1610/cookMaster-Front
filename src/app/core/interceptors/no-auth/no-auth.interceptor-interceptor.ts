import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const noAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  const isAuthRoute =
    req.url.includes('/auth/refresh') ||
    req.url.includes('/auth/login') ||
    req.url.includes('/logout') ||
    req.url.includes('/auth/register');


  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('noAuthInterceptor catchError déclenché', error.status, req.url);
      if (error.status === 401 && !isAuthRoute) {
        console.log('Déclenchement du refresh...');
        return handle401Error(req, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refresh().pipe(
      switchMap((response) => {
        isRefreshing = false;
        refreshTokenSubject.next(response.accessToken);
        return next(addToken(req, response.accessToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout();
        router.navigate(['/auth/login']);
        return throwError(() => err);
      })
    );
  }

  return refreshTokenSubject.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => next(addToken(req, token)))
  );
}