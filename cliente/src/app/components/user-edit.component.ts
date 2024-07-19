import { Component,OnInit } from "@angular/core";
import { UserService } from "../service/service.component";
import { User } from "../models/user";


@Component({
    selector: 'user-edit',
    templateUrl: '../view/user-edit.html',
    providers:[UserService]
})

export class UserEditComponet implements OnInit {
    public titulo: string;
    //public user: User;
    identity: any;
    token: any;


    constructor( private _userService: UserService) {
        this.titulo = 'Actualizar mis foking datosssss';
        
    }

    ngOnInit() {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        console.log("user-edit.component.ts cargado");
    }

}
