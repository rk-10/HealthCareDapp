import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from '../../node_modules/rxjs';
import { ObserveOnSubscriber } from '../../node_modules/rxjs/internal/operators/observeOn';
// import { request } from 'https';

export interface UserDetails {
  _id: string;
  username: string;
  exp: number;
  iat: number;
};

interface TokenRes {
  token: string;
};

export interface AuthPayload {
  username: string;
  password: string;
};

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('x-access-token', token);
    this.token = token;
  } 

  private getToken(): string {
    if(!this.token) {
      this.token = localStorage.getItem('x-access-token');
    }
    return this.token;
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('x-access-token');
    this.router.navigateByUrl('/');
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if(token) {
      payload = token.split('.')[1];
      console.log(payload);
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if(user) {
      return user.exp > Date.now() / 1000;
    } else return false;
  }

  private docRequest(type: 'register' | 'login' | 'addRecords' | 'docDetails'| 'patientDetails', 
  user: JSON): Observable<any>{
    let base;
    if (type == 'register' || type == 'login') {
      base = this.http.post(`/doctor/${type}`, user)
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          'x-access-token': this.getToken()
        })
      }
      base = this.http.post(`/doctor/${type}`, user, httpOptions);

      const request = base.pipe(
        map((data: TokenRes) => {
          if(data.token) {
            this.saveToken(data.token)
          }
          return data
        })
      )
      return request;
    }
  }

  public registerDoc(user: JSON): Observable<any> {
    return this.docRequest('register', user);
  }

  public loginDoc(user: JSON): Observable<any> {
    return this.docRequest('login', user);
  }

  public docAddRecord(data: JSON): Observable<any> {
    return this.docRequest('addRecords', data);
  }
}
