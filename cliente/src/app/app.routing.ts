import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserEditComponet } from './components/user-edit.component';  // Importar UserEditComponent correctamente


const appRoutes: Routes = [
  { path: '', component: UserEditComponet },
  { path: 'misDatos', component: UserEditComponet },
  { path: '**', component: UserEditComponet }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<AppRoutingModule> = RouterModule.forRoot(appRoutes);

export class AppRoutingModule { }

