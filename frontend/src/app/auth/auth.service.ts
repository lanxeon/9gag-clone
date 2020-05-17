import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  private isAuth = false;
  private authToken: string;
  private authStatusListener = new Subject<boolean>();
  private timer: any;
  private userId: string;
  private username: string;
  private userDp: string;

  getToken = () => {
    return this.authToken;
  }

  getIsAuth = () => {
    return this.isAuth;
  }

  getUserId = () => {
    return this.userId;
  }

  getUserName = () => {
    return this.username;
  }

  getUserDp = () => {
    return this.userDp;
  }

  getAuthStatusListener = () => {
    return this.authStatusListener.asObservable();
  }

  autoAuthUser = () => {
    const authDetails = this.getAuthDetails();
    if(!authDetails) return;
    
    const now = new Date();
    const timeDiff = authDetails.expiryDate.getTime() - now.getTime();
    if(timeDiff > 0)
    {
      this.authToken = authDetails.token;
      this.isAuth = true;
      this.userId = authDetails.userId;
      this.username = authDetails.username;
      this.userDp = authDetails.userDp;

      this.timer = setTimeout(() => {
        this.logout();
      }, timeDiff);

      this.authStatusListener.next(true);
    }
  }

  createUser = (email: string, username: string, password: string) => {
    const user: AuthData = {
      email: email,
      username: username,
      password: password
    };
    this.http.post("http://localhost:3000/user/signup", user)
      .subscribe(payload => {
        console.log(payload);
        this.router.navigate(['/login']);
      }, err => {
        this.authStatusListener.next(false);
      });
  }

  loginUser = (email: string, password: string) => {
    const user: AuthData = {
      email: email,
      username: null,
      password: password
    };
    this.http.post<{token: string, expiresIn: number, userId: string, username: string, userDp: string}>("http://localhost:3000/user/login", user)
      .subscribe(payload => {
        this.authToken = payload.token;
        if(payload.token)
        {
          const expiryDuration = payload.expiresIn;
          this.timer = setTimeout(() => {
            this.logout();
          }, expiryDuration * 1000);

          this.isAuth = true;
          this.userId = payload.userId;
          this.username = payload.username;
          this.userDp = payload.userDp;
          this.authStatusListener.next(true);

          const now = new Date();
          const expiryDate = new Date( now.getTime() + (expiryDuration * 1000) );
          this.saveAuthData(this.authToken, expiryDate, this.userId, this.username, this.userDp);

          this.router.navigate(['/']);
        }
      }, err => {
        this.authStatusListener.next(false);
      });
  }

  logout = () => {
    this.authToken = null;
    this.isAuth = false;
    this.userId = null;
    this.username = null;
    this.userDp = null;
    this.authStatusListener.next(false);
    clearTimeout(this.timer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData = (token: string, expirationDate: Date, userId: string, username: string, userDp: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("expirationDate", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
    localStorage.setItem("userDp", userDp);
  }

  private clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userDp");
  }

  private getAuthDetails = () => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expirationDate");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const userDp = localStorage.getItem("userDp");
    if(!token || !expiryDate) 
      return;

    return {
      token: token,
      expiryDate: new Date(expiryDate),
      userId: userId,
      username: username,
      userDp: userDp
    };
  }

  getUserDetails = (id: string) => {
    return this.http.get<{_id: string, username: string, dp: string}>("http://localhost:3000/user/details/" + id);
  }
}
