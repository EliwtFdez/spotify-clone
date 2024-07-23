import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Global } from './service.global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';


@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  public url: string;

  constructor(private http: HttpClient) {
    this.url = Global.url;
  }
  
  getAlbums(token: string, artistId: string | null = null): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    if (artistId == null) {
      return this.http.get(`${this.url}/Albums/`, { headers })
        .pipe(map(res => res));
    } else {
      return this.http.get(`${this.url}/Albums/${artistId}`, { headers })
        .pipe(map(res => res));
    }
  }

  
  getAlbum(token: string, id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this.http.get(`${this.url}/Albums/${id}`, { headers })
      .pipe(map(res => res));
  }   
  
  
  editAlbum(token: string, id: string, album: Album): Observable<any> {
      const params = JSON.stringify(album);
      const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
      });

      return this.http.put(`${this.url}/Album/${id}`, params, { headers })
      .pipe(map(res => res));
  }

  addAlbum(token: string, album: Album): Observable<any> {
      const params = JSON.stringify(album);
      const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
      });

      return this.http.post(`${this.url}/Album`, params, { headers })
      .pipe(map(res => res));
  }

  deleteAlbum(token: string, id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this.http.delete(`${this.url}/Album/${id}`, { headers })
      .pipe(map(res => res));
  }

}
