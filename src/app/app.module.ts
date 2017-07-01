import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Cloudinary module
import {CloudinaryModule, CloudinaryConfiguration, provideCloudinary} from '@cloudinary/angular-4.x';
import * as cloudinary from 'cloudinary-core';

import { FileUploadModule } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ManagerComponent } from './manager/manager.component';

import {CloudinarySettings} from './settings';

const appRoutes: Routes = [
  {path: 'gallery', component: GalleryComponent},
  {path: 'manager', component: ManagerComponent},
  {path: '', redirectTo: '/gallery', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    GalleryComponent,
    ManagerComponent
  ],
  imports: [
    CloudinaryModule.forRoot(cloudinary, CloudinarySettings),
    FileUploadModule,
    RouterModule.forRoot(appRoutes),
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
