import { Component,OnInit } from "@angular/core";
import { ActivatedRoute, Router , Params } from "@angular/router";
import { Artist } from "../models/artist";


@Component({
    selector: 'artist-list',
    templateUrl: '../view/home.html',
})

export class HomeComponent implements OnInit {
    public title:any;

    constructor(private _route: ActivatedRoute, private _router: Router, ) {
      this.title = 'Artistas';

    }

    ngOnInit(): void {
        console.log('Home.component.ts cargado');

    }


}
