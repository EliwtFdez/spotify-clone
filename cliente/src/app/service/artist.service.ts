import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Global } from './service.global';
import { Artist } from '../models/artist';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  public url: string;

  constructor(private http: HttpClient) {
    this.url = Global.url;
  }

  getArtists(token: string, page: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this.http.get(`${this.url}/Artists/${page}`, { headers })
      .pipe(map(res => res));
  }

  getArtist(token: string, id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this.http.get(`${this.url}/Artist/${id}`, { headers })
      .pipe(map(res => res));
  }

  // funciona addArtist
  addArtist(token: string, artist: Artist): Observable<any> {
    const params = JSON.stringify(artist);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this.http.post(`${this.url}/Artist`, params, { headers })
      .pipe(map(res => res));
  }

  //Editar 
  editArtist(token: string, id: string, artist: Artist): Observable<any> {
    const params = JSON.stringify(artist);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this.http.put(`${this.url}/Artist/${id}`, params, { headers })
      .pipe(map(res => res));
  }

  deleteArtist(token: string, id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this.http.delete(`${this.url}/Artist/${id}`, { headers })
      .pipe(map(res => res));
  }
}
