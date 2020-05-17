import { Router } from '@angular/router';
import { ErrorComponent } from './../../error/error.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit, OnDestroy {

  constructor(private authservice: AuthService, private dialog: MatDialog, private router: Router) { }
  
  ngOnInit(): void {
    this.userId = this.authservice.getUserId();
    this.formId = this.userId;
    
    this.isLoading = true;
    this.authservice.getFullUserDetails(this.userId)
    .subscribe(payload => {
      this.username = this.formUsername = payload.username;
      this.userDp = this.formDp = payload.dp;
      this.userEmail = this.formEmail = payload.email;
      this.isLoading = false;
    });
    
    this.authStatus = this.authservice.getAuthStatusListener()
    .subscribe(isAuth => {
      if(isAuth)
      {
        this.userId = this.formId = this.authservice.getUserId();
        // this.dialog.open(ErrorComponent, {data: {message: "You have been signed out!"}});
        // this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
    this.authStatus.unsubscribe();
  }


  authStatus: Subscription;
  edit: boolean = false;
  userId: string;
  username: string;
  userEmail: string;
  userDp: string;
  isLoading: boolean = true;
  formId: string;
  formUsername: string;
  formEmail: string;
  formDp: string;

  onImagePicked = (event: Event) => {
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);  

    const fr = new FileReader();
    fr.onload = () => {
      //  = <string>fr.result;
    }
    fr.readAsDataURL(file);
  }

  onUsernameEdited = () => {
    this.authservice.editUsername(this.userId, this.formUsername);
    this.username = this.formUsername;
  }

  onEmailEdited = () => {
    this.authservice.editEmail(this.userId, this.formEmail);
    this.userEmail = this.formEmail;
  }

}
