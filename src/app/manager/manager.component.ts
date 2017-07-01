import { Component, OnInit } from '@angular/core';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-4.x';

import { DB } from '../database';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  private title: string;
  public imageDataArray;

  constructor(private cloudinary: Cloudinary) {
    this.title = '';
  }
  ngOnInit() {
    this.loadDB();
    this.loadUploadedImages();
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/image/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };

    const upsertResponse = fileItem => {
      // Check if HTTP request was successful
      if (fileItem.status !== 200) {
        console.log('Upload to cloudinary Failed');
        console.log(fileItem);
        return false;
      }

      let imageCollection = DB.getCollection('imagegallery');
      if (!imageCollection) {
        imageCollection = DB.addCollection('imagegallery')
      }
      imageCollection.insert(fileItem.data);
      const that = this;
      DB.saveDatabase(function(saveErr) {
        if (saveErr) {
          console.log('error : ' + saveErr);
        } else {
          that.loadUploadedImages();
        }
      });
    }

    this.uploader = new FileUploader(uploaderOptions);
    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append('upload_preset', this.cloudinary.config().upload_preset);

      // Add built-in and custom tags for displaying the uploaded photo in the list
      let tags = 'angularimagegallery';
      if (this.title) {
        form.append('context', `photo=${this.title}`);
        tags = `angularimagegallery,${this.title}`;
      }
      form.append('tags', tags);
      form.append('file', fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    }

    // Update model on completion of uploading a file
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
      upsertResponse(
        {
          file: item.file,
          status,
          data: JSON.parse(response)
        }
      );
  }

  loadDB(): void {
    DB.loadDatabase({}, function(err) {
      if (err) {
        console.log();
      } else {
        console.log('db loaded');
      }
    });
  }

  loadUploadedImages(): void {
    const imageCollection = DB.getCollection('imagegallery');

    if (imageCollection) {
      this.imageDataArray = imageCollection.find();
    }
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

}
