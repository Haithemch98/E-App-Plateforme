// auth.service.ts
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt'; // Import 
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../app/user'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }
  private tokenSubject = new Subject<void>();
  private jwtHelper = new JwtHelperService(); // Create an instance of JwtHelperService
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.role; // Assuming your token contains a 'role' claim
    }
    return 'user'; // Default to 'user' if no token or 'role' claim is found
  }

  logUser(inputs: { email: string, password: string }) {
    this.http.post<{ name: string, token: string, user: any }>(
      'http://localhost:3000/User/logUser',
      inputs
    ).subscribe((response) => {
      localStorage.setItem('token', response.token);
      this.tokenSubject.next();
      console.log(localStorage.getItem("token"))
      console.log(response.user);
      if (response.user.role === 'admin') {
        console.log('Hello admin');
        this.router.navigate(['admin-classes']);
      } else {
        console.log('Hello from user');
        this.router.navigate(['student-home']);
      }
    });
  }


  getToken() {
    return localStorage.getItem("token")
  }

  signUp(inputs: { email: string, firstName: string, lastName: string, password: string }) {
    this.http.post(
      'http://localhost:3000/User/addUser',
      inputs
    ).subscribe((response) => {
      this.router.navigate(['signin']);
    });
  }

}
