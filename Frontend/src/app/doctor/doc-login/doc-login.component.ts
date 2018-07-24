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
  selector: 'app-doc-login',
  templateUrl: './doc-login.component.html',
  styleUrls: ['./doc-login.component.css']
})
export class DocLoginComponent implements OnInit {
  private token: string;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
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
  private login(auth: AuthPayload): Observable<any> {
    let base;
    base = this.http.post(environment.server + '/doctor/login', auth);
    console.log(base);
    console.log('adfasddsaf')
    // const request = base.pipe(
    //   map((data: TokenRes) => {
    //     if(data.token) {
    //       this.saveToken(data.token)
    //     }
    //     return data
    //   })
    // )
    // return request;
    return
  }

  public bla(): void {
    console.log('fasdfasdf')
    return
  }


}
