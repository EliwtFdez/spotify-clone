import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { Global } from "../service/service.global";
import { UserService } from "../service/service.component";
import { AlbumService } from "../service/album.service";

import { Album } from "../models/album";
import { Artist } from "../models/artist";
import { HttpParams } from "@angular/common/http";

@Component({
  selector: 'album-add',
  templateUrl: '../view/album-add.html',
  providers: [UserService,AlbumService]
})
export class AlbumAddComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public album: Album;

    public identity: any;
    public token: any;
    public url: string;
    public alertMessage: string = '';
    public is_edit: boolean = false; 
    public filesToUpload: Array<File> = []; // Inicializa como arreglo vacío




    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService
    ) {  
        this.titulo = 'Crear nuevo Album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = Global.url;
        this.artist = new Artist('', '', '','');
        this.album = new Album('', '', 2024, '', '');
    }

    ngOnInit(): void {
    }

    onSubmit() {
        console.log('album-add.component Cargado');
        console.log(this.album);
        this._route.params.forEach((params: Params)=>{
            let artist_id = params['artist'];
            this.album.artist = artist_id;

            this._albumService.addAlbum(this.token,this.album).subscribe(
                response => {
                    console.log('Response from server:', response);
            
                    if (!response.album) {
                    this.alertMessage = 'Error en el servidor';
                    } else {
                    this.alertMessage = 'El artista se ha creado correctamente';
                    this.album = response.album;
                    // Navigate to edit page if needed

                    this._router.navigate(['EditAlbum', response.album._id]);
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
            )  
        }); 
    }
    

    fileChangeEvent(fileInput: any): void {
        this.filesToUpload = <Array<File>>fileInput.target.files;
      }

}
