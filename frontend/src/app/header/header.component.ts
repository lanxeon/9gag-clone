import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }
  
  ngOnInit(): void {
    this.userAuthenticated = this.authService.getIsAuth();
    if(this.userAuthenticated)
    {
      this.username = this.authService.getUserName();
      this.userId = this.authService.getUserId();
      this.userDp = this.authService.getUserDp();
    }
    this.authListenerSubs = this.authService.getAuthStatusListener()
    .subscribe(val => {
      this.userAuthenticated = val;
      if(this.userAuthenticated)
      {
        this.userId = this.authService.getUserId();
        this.username = this.authService.getUserName();
        this.userDp = this.authService.getUserDp();
      }
    });
  }
  
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }


  userAuthenticated = false;
  private authListenerSubs: Subscription;
  username: string = null;
  userId: string = null;
  userDp: string = null;


  onLogout = () => {
    this.authService.logout();
  }

}
