import { Component,OnInit } from "@angular/core";
import { ActivatedRoute, Router , Params } from "@angular/router";
import { UserService } from "../service/service.component";
import { Global } from "../service/service.global";
import { Artist } from "../models/artist";
import { ArtistService } from "../service/artist.service";


@Component({
    selector: 'artist-list',
    templateUrl: '../view/artist-list.html',
    providers:[UserService,ArtistService]
    
})

export class ArtistListComponent implements OnInit {
    public title:any;
    public artists:Artist[]| any;
    public identity: any;
    public token: any;
    public url: any;
    public nextPage: any;
    public prevPage: any;
  
    

    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService,private _artistService: ArtistService ) {
        this.title = 'Artist'
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url= Global.url;
        this.nextPage = 1
        this.prevPage = 1;

    }

    ngOnInit(): void {
        console.log('Artist-edit.component.ts');
        this.getArtists()

    }
    
    getArtists(): void {
        this._route.params.subscribe((params: Params) => {
          let page = +params['page'] || 1;
    
          this.nextPage = page + 1;
          this.prevPage = page - 1;
          if (this.prevPage < 1) {
            this.prevPage = 1;
          }
    
          this._artistService.getArtists(this.token, page).subscribe(
            response => {
              if (!response.artists || response.artists.length === 0) {
                this._router.navigate(['/']);
              } else {
                this.artists = response.artists;
              }
            },
            error => {
              console.error('Error fetching artists:', error);
              if (error.error) {
                try {
                  const body = JSON.parse(error.error);
                  console.error(body.message);
                } catch (e) {
                  console.error('Error parsing error response:', error.error);
                }
              }
            }
          );
        });
      }


      public confirmado: any
      onDeleteConfirm(id: any){
        this.confirmado  = id;
      }

      onCancelArtist(){
        this.confirmado= null;

      }

       
      onDeleteArtist(id: string){
        this._artistService.deleteArtist(this.token, id).subscribe(
          response => {
            if (!response.artists ) {
              alert('Error en el servidor'); 
            } 
            this.getArtists();
          },
          error => {
            console.error('Error fetching artists:', error);
            if (error.error) {
              try {
                const body = JSON.parse(error.error);
                console.error(body.message);
              } catch (e) {
                console.error('Error parsing error response:', error.error);
              }
            }
          }
        );

      }

}