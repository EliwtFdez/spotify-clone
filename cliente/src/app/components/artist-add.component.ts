import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../service/service.component";
import { Global } from "../service/service.global";
import { Artist } from "../models/artist";
import { ArtistService } from "../service/artist.service";
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'artist-add',
  templateUrl: '../view/artist-add.html',
  

  providers: [UserService, ArtistService,CommonModule]
})
export class ArtistAddComponent implements OnInit {
  public title: string;
  public artista: Artist; // artist
  public identity: any;
  public token: any;
  public url: string;
  public alertMessage: string = '';
  public is_edit: boolean = false; 

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService
  ) {
    this.title = 'Crear nuevo artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = Global.url;
    this.artista = new Artist('', '', '');

  }

  ngOnInit(): void {
    console.log('Artist-add.component.ts initialized');
  }

  fileChangeEvent(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.artista.image = file;
      // Lógica adicional para manejar el archivo si es necesario
    }
  }

  onSubmit(): void {
    console.log(this.artista);

    this._artistService.addArtist(this.token, this.artista).subscribe(
      response => {
        console.log('Response from server:', response);

        if (!response.Artist) {
          this.alertMessage = 'Error en el servidor';
        } else {
          this.alertMessage = 'El artista se ha creado correctamente';
          this.artista = response.Artist;
          // Navigate to edit page if needed
          // this._router.navigate(['editar-artista', response.Artist._id]);
        }
      },
      error => {
        const errorMessage = <any>error;
        if (errorMessage != null) {
          try {
            const body = JSON.parse(error.error);
            this.alertMessage = body.message;
          } catch (e) {
            this.alertMessage = 'Error desconocido al actualizar';
          }

          console.log(error);
        }
      }
    );
  }
}
