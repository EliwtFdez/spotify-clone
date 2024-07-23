import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UserService } from "../service/service.component";
import { Global } from "../service/service.global";
import { Artist } from "../models/artist";
import { ArtistService } from "../service/artist.service";
import { Album } from "../models/album";
import { AlbumService } from "../service/album.service";
import { AlbumEditComponent } from "./album-edit.component";


@Component({
  selector: 'artist-detail',
  templateUrl: '../view/artist-detail.html',
  providers: [UserService, ArtistService, AlbumService]
})
export class ArtistDetailComponent implements OnInit {
  public title: string = 'Detalles del Artista';
  public artist: Artist = new Artist('', '', '',''); // Inicializa con un objeto Artist vacío
  public album = new Album('', '', 2024, '', '');
  public identity: any;
  public token: any;
  public url: string;
  public alertMessage: string = '';
  public albums: Album[] = [];
  public artistId: string | undefined; // Propiedad pública para almacenar el _id
  public albumId: string | undefined; // Propiedad pública para almacenar el _id

  public confirmado: string | null = null; // Propiedad para manejo de confirmación


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService,
    private _albumService: AlbumService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = Global.url;
   
  }

  ngOnInit(): void {
    console.log('Artist-detail.component.ts initialized');
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
                    this.artist = response.artist;
                    this.artistId = (this.artist as any)._id; // Asignar el _id a una variable separada
                    this.artist.id = this.artistId; // Asignar el _id a la propiedad id
                    console.log('Artist ID:', this.artistId);

                    this._albumService.getAlbums(this.token, this.artistId).subscribe(
                        albumResponse => {
                            if (!albumResponse.albums) {
                                this.alertMessage = 'Este artista no tiene albums';
                            } else {
                                this.albums = albumResponse.albums;
                                // Asignar albumId a cada álbum
                                this.albums = this.albums.map(album => {
                                    album.id = (album as any)._id;
                                    return album;
                                });
                            }
                        },
                        error => {
                            console.error('Error fetching albums:', error);
                            this.alertMessage = 'Error fetching albums';
                        }
                    );
                }
            },
            error => {
                console.error('Error fetching artist:', error);
                this.alertMessage = 'Error fetching artist';
            }
        );
    });
}




  onDeleteConfirm(id: string) {
    this.confirmado = id;
  }

  onDeleteAlbum(id: string) {
    this._albumService.deleteAlbum(this.token, id).subscribe(
      response => {
        if (!response.album) {
          alert('Error en el servidor');
        }
        this.getArtist();
      },
      error => {
        console.log('Error:', error);
        this.alertMessage = 'Error desconocido al eliminar el álbum';
      }
    );
  }

  onCancelAlbum() {
    this.confirmado = null;
  }
}
