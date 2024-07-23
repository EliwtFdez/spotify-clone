import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { routing, appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';
import { UserEditComponet } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent } from './components/home.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistService } from './service/artist.service';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserEditComponet,
    ArtistListComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    ArtistDetailComponent
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    routing,
    HttpClientModule,
    ReactiveFormsModule

  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }