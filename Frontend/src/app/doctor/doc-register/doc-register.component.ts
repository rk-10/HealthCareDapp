import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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

@Component({
  selector: 'app-doc-register',
  templateUrl: './doc-register.component.html',
  styleUrls: ['./doc-register.component.css']
})
export class DocRegisterComponent implements OnInit {
  private token: string;

  credentials: AuthPayload = {
    username: '',
    password: ''
  }

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  Register() {
    this.register(this.credentials).subscribe((res) => {
      if(res.status) {
        console.log('successfully registered')
        this.router.navigateByUrl('/doctor/login');
      }
    }, (err) => {
      console.log('Error occured', err);
    })
  }

  private saveToken(_token: string): void {
    localStorage.setItem('x-access-token', _token);
    this.token = _token;
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

  private register(auth: AuthPayload): Observable<any> {
    let base;
    base = this.http.post(environment.server + 'doctor/register', auth);
    console.log(base);
    console.log('register called')
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
