import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEditComponet } from './components/user-edit.component';

const appRoutes: Routes =[
    {path:'',component:UserEditComponet},
    {path:'misDatos',component:UserEditComponet},
    {path:'**',component:UserEditComponet},
    
]


export const appRoutingProvider: any[] = [];
export const routing:ModuleWithProviders = [RouterModule.forChild(appRoutes)];



