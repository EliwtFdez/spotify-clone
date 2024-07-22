import { Component,OnInit } from "@angular/core";
import { ActivatedRoute, Router , Params } from "@angular/router";
import { UserService } from "../service/service.component";
import { Global } from "../service/service.global";
import { Artist } from "../models/artist";


@Component({
    selector: 'artist-list',
    templateUrl: '../view/artist-list.html',
    providers:[UserService]
})

export class ArtistListComponent implements OnInit {
    public title:any;
    public artist:Artist[]| any;
    public identity: any;
    public token: any;
    public url: any;


    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService) {
        this.title = 'Artist'
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url= Global.url;

    }

    ngOnInit(): void {
        console.log('Artist-edit.component.ts');

    }


}
