import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from '../../../../node_modules/rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface RecordPayload {
  id: string,
  publicKey: string,
  name: string,
  number: number,
  address: string,
  email: string
}

@Component({
  selector: 'app-doc-records',
  templateUrl: './doc-records.component.html',
  styleUrls: ['./doc-records.component.css']
})
export class DocRecordsComponent implements OnInit {

  public token: string;

  credentials: RecordPayload = {
    id: '',
    publicKey: '',
    name: '',
    number: null,
    address: '',
    email: ''
  }

  public errorMessage: '';
  public successMessage: '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  Logout() {
    this.logout();
  }

  public logout(): void {
    // this.token = '';
    window.localStorage.removeItem('x-access-token');
    this.router.navigateByUrl('/');
  }

  Records() {
    this.AddRecord(this.credentials).subscribe((res) => {
      console.log(res)
    })
  }

  private getToken(): string {
    if(!this.token) {
      this.token = localStorage.getItem('x-access-token');
    }
    return this.token;  
  }
  
  private AddRecord(payload: RecordPayload): Observable<any> {
    let base;
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': this.getToken()
      })
    }
    base = this.http.post(environment.server + 'doctor/addRecords', payload, httpOptions);
    console.log(base);
    const request = base.pipe(
      map((data) => {
        console.log(data)
        return data
      })
    )
    return request;
  }
}