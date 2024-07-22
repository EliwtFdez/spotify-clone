import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Global } from './service.global';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public url: string;

  constructor(private http: HttpClient) {
    this.url = Global.url;
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      for (let i = 0; i < files.length; i++) {
        formData.append(name, files[i], files[i].name);
      }

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  }
}
