import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {

  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  
  
  // If the request is to an excluded endpoint or if there's no token, proceed without modifying the request
  if (req.url.includes('/auth/') || !token) {
    return next(req);
  }

  // Clone the request to add the new header
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });
  

  return next(authReq);
};
