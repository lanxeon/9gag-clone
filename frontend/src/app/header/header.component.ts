import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userAuthenticated = this.authService.getIsAuth();
    if(this.userAuthenticated)
    {
      this.username = this.authService.getUserName();
      this.userId = this.authService.getUserId();
    }
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(val => {
        this.userAuthenticated = val;
        if(this.userAuthenticated)
        {
          this.username = this.authService.getUserName();
          this.userId = this.authService.getUserId();
        }
      });
  }

  userAuthenticated = false;
  private authListenerSubs: Subscription;
  username: string = null;
  userId: string = null;


  onLogout = () => {
    this.authService.logout();
  }

}
