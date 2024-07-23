import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UserService } from "../service/service.component";
import { Global } from "../service/service.global";
import { Artist } from "../models/artist";
import { ArtistService } from "../service/artist.service";
import { UploadService } from "../service/upload.service";

@Component({
  selector: 'artist-edit',
  templateUrl: '../view/artist-add.html',
  providers: [UserService, ArtistService, UploadService]
})
export class ArtistEditComponent implements OnInit {
  public title: string;
  public artista: Artist; // artist
  public identity: any;
  public token: any;
  public url: string;
  public alertMessage: string = '';
  public is_edit: boolean;
  public filesToUpload: Array<File> = []; // Inicializa como arreglo vacío

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
    private _uploadService: UploadService
  ) {
    this.title = 'Editar artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = Global.url;
    this.artista = new Artist('', '', '','');
    this.is_edit = true;
  }

  ngOnInit(): void {
    console.log('Artist-edit.component.ts initialized');
    this.getArtist();
  }

  getArtist(): void {
    this._route.params.subscribe((params: Params) => {
      let id = params['id'];
      this._artistService.getArtist(this.token, id).subscribe(
        response => {
          if (!response.artist) {
            this._router.navigate(['/']);
          } else {
            this.artista = response.artist;
          }
        },
        error => {
          console.error('Error fetching artist:', error);
        }
      );
    });
  }

  onSubmit(): void {
    console.log(this.artista);
    this._route.params.subscribe((params: Params) => {
      let id = params['id'];

      this._artistService.editArtist(this.token, id, this.artista).subscribe(
        response => {
          console.log('Response del servidor:', response);

          if (!response.artist) {
            this.alertMessage = 'Error en el servidor';
          } else {
            this.alertMessage = 'El artista se ha actualizado correctamente';

            // Subir el archivo de imagen
            this._uploadService.makeFileRequest(
              `${this.url}/Upload-images-Artist/${id}`,
              [],
              this.filesToUpload,
              this.token,
              'image'
            ).then(
              (result: any) => {
                console.log(result);
                // Actualiza la imagen del artista si es necesario
              },
              (error: any) => {
                console.error(error);
              }
            );

            // Navegar a otra página si es necesario
            // this._router.navigate(['editar-artista', response.artist._id]);
          }
        },
        error => {
          const errorMessage = <any>error;
          console.log('Error:', errorMessage);
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
    });
  }

  fileChangeEvent(fileInput: any): void {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload); // Para verificar que los archivos se están cargando correctamente
  }
}
