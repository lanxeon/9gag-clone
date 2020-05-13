import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from './../auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  constructor(public authService: AuthService) { }
  
  private authStatusSub: Subscription;
  isLoading = false;
  
  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe( authStatus => {
      this.isLoading = false;
    });
  }

  
  onSignup = (form: NgForm) => {
    if(form.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.username, form.value.password);
  }


  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}

