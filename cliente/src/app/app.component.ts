import { Component,OnInit } from '@angular/core';
//Importar el modelo de usuario
import {User} from './models/user';
import {UserService} from './services/user.service';
import {GLOBAL} from './services/global';
import {Router,ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  //Providers son los servicios
  providers:[UserService]
})

export class AppComponent implements OnInit
{
  title = 'Musify';
  version = '1.0.0 Alpha';
  user: User;
  user_register: User;
  
  public identity;
  public token;
  public nombre;

  errorMessage;
  registerMessage;
  public url: string;
  public image:string;

  constructor(private _route:ActivatedRoute, private _router:Router, private _userService: UserService)
  {
  	//Crear el objeto vacío
  	this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;
  }

  //Es necesario import el onInit
  ngOnInit()
  {
    //this.identity = "";
    //this.token = "";
    if(localStorage.getItem('token') == null && localStorage.getItem('identity') == null)
    {
      console.log("NGonInit-AppComponent - No hay nada en el localStorage.")
      this.identity = null;
      this.token = null;
      this.nombre = null;
      this.image = null;
    }
   
    else
    {
      console.log("NGonInit-AppComponent - Se toman los siguientes valores: ");
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.nombre = localStorage.getItem('name');
      this.identity = JSON.parse(this.identity);
      this.image = localStorage.getItem('image');
      
    }
  }

  public onSubmit()
  {
    //Conseguir los datos del usuario identificado
    this._userService.signUp(this.user).subscribe
    (
      response => 
      {
        console.log("Usuario identificado: " + response);
        
        //Si se loggea se guarda el usuario
        let identity = response.user;
        this.identity = identity;
        localStorage.setItem('name',identity.name);
        localStorage.setItem('image',identity.image);
        this.nombre = identity.name;     

        if(!this.identity._id)
        {
          alert('El usuario no está correctamente loggeado.');
        }
        
        else
        {
          
          localStorage.setItem('identity',JSON.stringify(identity));
          
          this._userService.signUp(this.user,'true').subscribe
          (
            response => 
            {
              
              let token = response.token;
              this.token = token;
              
              if(this.token.length <= 0)
              {
                alert('El token no se ha generado correctamente.');
              }
              
              else
              {
                //Crear elemento en el local storage (usuario en sesión)
                localStorage.setItem('token',token);
                this.user = new User('','','','','','ROLE_USER','');
              }
            },
            error => 
            {
              var errorMessage = <any>error;
              if(errorMessage != null)
              {
                var body = JSON.parse(error._body);
                this.errorMessage = body.message; // imprime el error
                console.log("Error: " + error);
              }
            }
           );
          //console.log(this.user);  
        }
      },
      error => 
      {
        var errorMessage = <any>error;
        if(errorMessage != null)
        {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message; 
          console.log("Error: " + error);
        }
      }
     );
  }

  logOut()
  {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this.nombre = null;
    this._router.navigate(['/']);
  }

  onSubmitRegister()
  {
    this._userService.register(this.user_register).subscribe
    (
      response => 
      {
        let user = response.user;
        this.user_register = user;

        if(!user.id)
        {
          this.registerMessage = 'Error al registar usuario.';
        }
      
        else
        {
          this.registerMessage = '¡Ahora estás registrado en Musify! Inicia sesión.';
          this.user_register = new User('','','','','','ROLE_USER','');
        }
      },
      error => 
      {
        var errorMessage = <any>error;
        if(errorMessage != null)
        {
          var body = JSON.parse(error._body);
          this.registerMessage = body.message; //imprime el error
          console.log("Error: " + error);
        }
      }
    );
  }

}
