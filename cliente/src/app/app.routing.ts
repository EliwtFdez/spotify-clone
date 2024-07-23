import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserEditComponet } from './components/user-edit.component';  // Importar UserEditComponent correctamente
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent } from './components/home.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';


const appRoutes: Routes = [
  { path: '', component: HomeComponent  },
  { path: 'artist/:page', component: ArtistListComponent },
  { path: 'CrearArtista', component: ArtistAddComponent },
  { path: 'misDatos', component: UserEditComponet },
  { path: 'Artista/:id', component: ArtistDetailComponent },
  { path: 'editarArtista/:id', component: ArtistEditComponent },
  { path: 'CrearAlbum/:artist', component: AlbumAddComponent },
  { path: 'EditAlbum/:id', component: AlbumEditComponent },

  { path: '**', component: HomeComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<AppRoutingModule> = RouterModule.forRoot(appRoutes);

export class AppRoutingModule { }



