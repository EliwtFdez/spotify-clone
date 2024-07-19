import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Global } from './service.global';

@Injectable({
  providedIn: 'root' 
})
export class UserService {
  public url: string;
  identity: any;
  token: any;

  constructor(private _http: HttpClient) {
    this.url = Global.url;
  }

  signup(user_to_login: any, gethash: boolean | null = null): Observable<any> {
    if (gethash != null) {
      user_to_login.gethash = gethash;
    }

    const json = JSON.stringify(user_to_login);
    const params = json;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this._http.post<any>(`${this.url}/Login`, params, { headers: headers })
               .pipe(map(res => res));
  }

  register(user_to_register: any): Observable<any> {
    const json = JSON.stringify(user_to_register);
    const params = json;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this._http.post<any>(`${this.url}/Register`, params, { headers: headers })
               .pipe(map(res => res));
    
  }

 
  update_user(user_to_update: any): Observable<any> {
    const json = JSON.stringify(user_to_update);
    const params = json;
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization':this.getToken()});

    return this._http.put<any>(`${this.url}/UpdateUser/${user_to_update._id}`, params, { headers: headers })
               .pipe(map(res => res));
  }

  getIdentity(){
    let identity = JSON.stringify(localStorage.getItem('indentity'));
    if (identity != "undefined") {
        this.identity = identity

    } else {
        this.identity = null;
    }
      return this.identity;
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