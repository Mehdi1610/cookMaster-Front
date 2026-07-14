import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
   private readonly url = `${environment.apiUrl}`;
    private readonly httpClient = inject(HttpClient);
    private readonly currentUserSubject = new BehaviorSubject<User | null>(
        null,
    );
    public readonly currentUser$: Observable<User | null> =
        this.currentUserSubject.asObservable();


    public loadCurrentUser(): void {
        this.httpClient
            .get<User>(`${this.url}/me`)
            .pipe(tap((user) => this.currentUserSubject.next(user)))
            .subscribe();
    }
}
