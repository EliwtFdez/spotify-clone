import { Component,NgProbeToken,OnInit } from "@angular/core";
import { UserService } from "../service/service.component";
import { User } from "../models/user";
import { bindNodeCallback } from "rxjs";
import { UrlHandlingStrategy } from "@angular/router";
import { Global } from "../service/service.global";


@Component({
    selector: 'user-edit',
    templateUrl: '../view/user-edit.html',
    providers:[UserService]
})

export class UserEditComponet implements OnInit {
    public titulo: string;
    public user: User;
    public identity: any;
    public token: object |any; //obj
    public alertMessage: string | any;
    public url: string;
    http: any;
    
  constructor(private _userService: UserService) {
    this.titulo = 'Actualizar mis datos';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = Global.url;

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
  
    if (!this.user._id) 
    {
      this.alertMessage = 'El ID del usuario es necesario para actualizar.';
      return;
    }
  
    this._userService.updateUser(this.user).subscribe(
      response => {
        if (!response.user) 
        {
          this.alertMessage = 'El usuario no se ha actualizado';
        }
         else 
         {
          localStorage.setItem('identity', JSON.stringify(this.user));
          const identityNameElement = document.getElementById('identity_name');
          if (identityNameElement) {
            identityNameElement.innerHTML = this.user.name;
          }
          
          if (!this.filesToUpload) {
            
          }else{
            this.makeFileRequest(this.url+'/Upload-images-user/'+this.user._id,[],this.filesToUpload)
            .then(
              (result:any) =>{
                this.user.image = result.image;
                localStorage.setItem('identity', JSON.stringify(this.user));

                let imagePath=this.url+'/Get-image-file/'+this.user.image
                document.getElementById('imageLogged')?.setAttribute('src',imagePath);
															  
                console.log(this.user);

              }
            )  
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

  public filesToUpload: Array<File>| any;
  
  fileChangeEvent(FileInput: any){
    this.filesToUpload = <Array<File>>FileInput.target.files;
    console.log(this.filesToUpload);
    //console.log(FileInput.target.files); // Agregado para verificar si los archivos se seleccionan

    
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
  
      for (var i = 0; i < files.length; i++) {
        formData.append('image', files[i], files[i].name);  // Asegúrate de que el campo sea 'image'
      }
  
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
  
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
      xhr.send(formData);
    });
  }
  
}
