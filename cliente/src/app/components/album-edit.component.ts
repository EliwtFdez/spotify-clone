import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Global } from "../service/service.global";
import { UserService } from "../service/service.component";
import { ArtistService } from "../service/artist.service";
import { AlbumService } from "../service/album.service";
import { UploadService } from "../service/upload.service";
import { Album } from "../models/album";

@Component({
  selector: 'album-edit',
  templateUrl: '../view/album-add.html',
  providers: [UserService, UploadService, AlbumService]
})
export class AlbumEditComponent implements OnInit {
  public titulo: string;
  
  public album: Album;
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
    private _albumService: AlbumService,
    private _uploadService: UploadService
  ) {
    this.titulo = 'Editar Album';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = Global.url;
    this.album = new Album('', '', 2024, '', '');
    this.is_edit = true;
  }

  ngOnInit(): void {
    console.log('album-edit.component Cargado');
    this.getAlbum();
  }

  getAlbum() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._albumService.getAlbum(this.token, id).subscribe(
        response => {
          console.log('Response server GETALBUM:', response);
          if (!response.album) {
            this._router.navigate(['/']);
          } else {
            this.album = response.album;
          }
        },
        error => {
          console.error(error);
          this.alertMessage = 'Error desconocido al obtener el álbum';
        }
      );
    });
  }

  onSubmit() {
    console.log(this.album);
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._albumService.editAlbum(this.token, id, this.album).subscribe(
        response => {
          console.log('Response from server:', response);
          if (!response.album) {
            this.alertMessage = 'Error en el servidor';
          } else {
            this.alertMessage = 'El album se ha actualizado correctamente';

            if (!this.filesToUpload) {
              console.log('eseperar'+response.album.artist);
              
            }          


            // Subir el archivo de imagen
            if (this.filesToUpload.length > 0) {
              this._uploadService.makeFileRequest(`${this.url}/Upload-Image-Album/${id}`, [], this.filesToUpload, this.token, 'image')
                .then(
                  (result: any) => {
                    console.log(result);
                    
                    
                    this._router.navigate(['/Artista', response.album.artist]);
                  },
                  (error: any) => {

                    console.error(error);
                  }
                );
            } else {
              this._router.navigate(['/Artista', response.album.artist]);
            }
          }
        },
        error => {
          console.error('Error:', error);
          this.alertMessage = 'Error desconocido al actualizar el álbum';
        }
      );
    });
  }

  fileChangeEvent(fileInput: any): void {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
