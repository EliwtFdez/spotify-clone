import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserEditComponet } from './components/user-edit.component';  // Importar UserEditComponent correctamente
import { ArtistListComponent } from './components/artist-edit.component';


const appRoutes: Routes = [
  { path: '', redirectTo : 'artist/1', pathMatch: 'full' },
  { path: '', component: ArtistListComponent },
  { path: 'artist/:page', component: ArtistListComponent },
  { path: 'misDatos', component: UserEditComponet },
  { path: '**', component: ArtistListComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<AppRoutingModule> = RouterModule.forRoot(appRoutes);

export class AppRoutingModule { }

