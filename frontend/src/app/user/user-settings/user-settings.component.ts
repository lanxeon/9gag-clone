import { mimeType } from './../../post/create-post/mime-type.validator';
import { Router } from '@angular/router';
import { ErrorComponent } from './../../error/error.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { environment } from '../../../environments/environment';

const url = environment.apiUrl;

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit, OnDestroy {

  constructor(private authservice: AuthService, private dialog: MatDialog, private router: Router) { }
  
  ngOnInit(): void {

    this.editImage = false;
    this.userId = this.authservice.getUserId();
    this.formId = this.userId;
    
    this.isLoading = true;
    this.authservice.getFullUserDetails(this.userId)
    .subscribe(payload => {
      this.username = this.formUsername = payload.username;
      this.userDp = this.formDp = payload.dp.replace("http://localhost:3000", url);
      this.userEmail = this.formEmail = payload.email;
      this.isLoading = false;
    });
    
    this.authStatus = this.authservice.getAuthStatusListener()
    .subscribe(isAuth => {
      this.isLoading = true;
      if(isAuth)
      {
        this.userId = this.formId = this.authservice.getUserId();
        this.username = this.formUsername = this.authservice.getUserName();
        this.userDp = this.formDp = this.authservice.getUserDp();
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.authStatus.unsubscribe();
  }


  authStatus: Subscription;
  editImage: boolean = false;
  userId: string;
  username: string;
  userEmail: string;
  userDp: string;
  isLoading: boolean = true;
  formId: string;
  formUsername: string;
  formEmail: string;
  formDp: string;
  imgPreview: string = null;
  file: File = null; 
  editUsername: boolean = false;

  onImagePicked = (event: Event) => {
    const file = (event.target as HTMLInputElement).files[0];
    const frArray = new FileReader();
    const frUrl = new FileReader();

    if(file.size > 10485760)
    {
      this.dialog.open(ErrorComponent, {data: {message: "File size limit is 10mb! Cannot exceed that"}});
      this.editImage = false;
      this.imgPreview = null;
      this.file = null;
      return;
    }

    const MIME_TYPES:Array<string> = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif"
    ];

    
    frArray.onload = () => {
      if(MIME_TYPES.includes(file.type))
      {
        const arr = new Uint8Array(frArray.result as ArrayBuffer).subarray(0, 4);
        let header = "";
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        console.log("Header is " + header);
        
        switch (header) 
        {
          case "89504e47":   //PNGs
            isValid = true;
            break;
          case "ffd8ffe0"://JPG/JPEGs
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          case "47494638":   //GIFs 
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }

        if(isValid)
        {
          frUrl.onload = () => {
            this.imgPreview = (frUrl.result as string);
            this.editImage = true
            this.file = file;
          }
          frUrl.readAsDataURL(file);
        }
        //If someone attempts MIME spoofing
        else {
          this.dialog.open(ErrorComponent, {data: {message: "Not a valid file type! You cannot spoof the file type!"}});
          this.editImage = false;
          this.imgPreview = null;
          this.file = null;
          return;
        }
      }

      //If MIME type doesn't match
      else {
        this.dialog.open(ErrorComponent, {data: {message: "Not a valid file type! Only png, jpg's and GIF's accepted"}});
        this.editImage = false;
        this.imgPreview = null;
        this.file = null;
      }
    }

    frArray.readAsArrayBuffer(file);
  }

  onUsernameEdited = () => {
    this.authservice.editUsername(this.userId, this.formUsername);
  }

  onEmailEdited = () => {
    this.authservice.editEmail(this.userId, this.formEmail);
  }

  onDpEdited = () => {
    this.authservice.editDp(this.userId, this.file);
  }

  onDpEditCancelled = () => {
    this.editImage = false;
    this.imgPreview = null;
    this.file = null;
  }

  checkUsernameValid = () => {
    const pattern = /[^a-z|A-Z|0-9|_]/;
    if(this.formUsername === this.username)
    {
      this.editUsername = false;
      console.log("Equality checking: " + this.editUsername);
    }
    else if(this.formUsername.length > 16)
      {
      this.editUsername = false;
      console.log("Length checking: " + this.editUsername);
    }
    else if(pattern.test(this.formUsername))
      {
      this.editUsername = false;
      console.log("Pattern checking: " + this.editUsername);
    }
    else 
      this.editUsername = true;

    console.log(this.editUsername);
  }

}
