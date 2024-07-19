import { Component,OnInit } from "@angular/core";
import { UserService } from "../service/service.component";
import { User } from "../models/user";
import { bindNodeCallback } from "rxjs";


@Component({
    selector: 'user-edit',
    templateUrl: '../view/user-edit.html',
    providers:[UserService]
})

export class UserEditComponet implements OnInit {
    public titulo: string;
    public user: User;
    public identity: any;
    public token: Object |any;
    public alertMessage: string | any;
  http: any;
    


  constructor(private _userService: UserService) {
    this.titulo = 'Actualizar mis datos';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    if (this.identity && typeof this.identity === 'object' && this.identity._id) {
      this.user = { ...this.identity };
    } else {
      this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    }
  }
    
    ngOnInit() {
        console.log("user-edit.component.ts cargado");
    }


    onSubmit(): void {
      console.log(this.user);
  
      if (!this.user._id) {
        this.alertMessage = 'El ID del usuario es necesario para actualizar.';
        return;
      }
  
      this._userService.updateUser(this.user).subscribe(
        response => {
          if (!response.user) {
            this.alertMessage = 'El usuario no se ha actualizado';
          } else {
            localStorage.setItem('identity', JSON.stringify(this.user));
            const identityNameElement = document.getElementById('identity_name');
            if (identityNameElement) {
              identityNameElement.innerHTML = this.user.name;
            }
            this.alertMessage = 'El usuario se ha actualizado correctamente';
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
