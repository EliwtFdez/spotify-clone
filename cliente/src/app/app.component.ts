import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './service/service.component';
import { Global } from './service/service.global';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
  title = 'MiniSpotify';
  public user: User;
  public user_register: User;

  public identity: any;
  public token: Object |any;
  public url: string | any;
  
  public errorMessage: string | any;
  public alertRegister:string | any;

  constructor(private _userService: UserService) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = Global.url
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    console.log(this.identity);
    console.log(this.token);
    
  }

  public onSubmit() {
    console.log(this.user);
  
    this._userService.signup(this.user).subscribe(
      response => {
        console.log(response);
        
        let identity = response.user;
        this.identity = identity;
  
        if (!this.identity._id) {
          alert("Usuario no está identificado");
        } else {
          // Mantener usuario en sesión
          localStorage.setItem('identity', JSON.stringify(identity));
  
          // Token petición HTTP
          this._userService.signup(this.user, true).subscribe(
            response => {
              let token = response.token;
              this.token = token;
  
              if (!this.token || this.token.length <= 0) {
                this.errorMessage='Token no se ha generado';
              } else {
                // Localstorage token disponible
                localStorage.setItem('token', token);
  
                console.log(token);
                console.log(identity);
              }
            },
            error => {
              console.error("Error al generar el token", error);
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          console.log(error);
        }
      }
    );
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();

    this.identity = null;
    this.token = null;
  }
  
  onSubmitRegister() {
    console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;
  
        if (!user._id) {
          this.alertRegister = 'Error al registrarse';
        } else {
          this.alertRegister = 'Registro correcto: ' + this.user_register.email;
          // Resetea el formulario después de un registro exitoso
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          try {
            var body = JSON.parse(error._body);
            this.alertRegister = body.message;
          } catch (e) {
            this.alertRegister = 'Error desconocido al registrarse';
          }
          console.log(error);
        }
      }
    );
  }
  

}
