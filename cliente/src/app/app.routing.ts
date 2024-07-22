import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserEditComponet } from './components/user-edit.component';  // Importar UserEditComponent correctamente
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent } from './components/home.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';


const appRoutes: Routes = [
  { path: '', component: HomeComponent  },
  { path: 'artist/:page', component: ArtistListComponent },
  { path: 'CrearArtista', component: ArtistAddComponent },
  { path: 'misDatos', component: UserEditComponet },
  { path: 'editarArtista/:id', component: ArtistEditComponent },
  { path: '**', component: HomeComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<AppRoutingModule> = RouterModule.forRoot(appRoutes);

export class AppRoutingModule { }

