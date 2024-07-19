import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Global } from './service.global';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root' 
})
export class UserService {
  public url: string;
  public identity: any;
  public token: Object |any;
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {
    this.url = Global.url;
  }

  signup(user_to_login: any, gethash: boolean | null = null): Observable<any> {
    if (gethash != null) {
      user_to_login.gethash = gethash;
    }

    const json = JSON.stringify(user_to_login);
    const params = json;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post<any>(`${this.url}/Login`, params, { headers: headers })
               .pipe(map(res => res));
  }

  register(user_to_register: any): Observable<any> {
    const json = JSON.stringify(user_to_register);
    const params = json;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post<any>(`${this.url}/Register`, params, { headers: headers })
               .pipe(map(res => res));
    
  }

  updateUser(user: User): Observable<any> {
    const token = localStorage.getItem('token'); // Obtener el token de localStorage
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/UpdateUser/${user._id}`, user, { headers });
  }

getIdentity() {
  const identity = JSON.parse(localStorage.getItem('identity') || '{}');
  return identity !== 'undefined' ? identity : null;
}


  getToken(){
    let token = JSON.stringify(localStorage.getItem('token'));
    if (token != "undefined") {
        this.token = token

    } else {
        this.token = null;
    }
      return this.token;

  }

}