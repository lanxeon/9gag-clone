// import { environment } from './../../environments/environment.prod';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/user/";
const url = environment.apiUrl;


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
      this.userDp = authDetails.userDp.replace("http://localhost:3000", url);

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
    this.http.post(BACKEND_URL + "signup", user)
      .subscribe(payload => {
        this.router.navigate(['/login']);
      }, err => {
        this.authStatusListener.next(false);
      });
  }

  loginUser = (email: string, password: string, cancelNav: boolean=false) => {
    const user: AuthData = {
      email: email,
      username: null,
      password: password
    };
    // const reqParam = `?pass=${cancelNav ? 'yes' : 'no' }`;
    this.http.post<{token: string, expiresIn: number, userId: string, username: string, userDp: string}>(BACKEND_URL + "login", user)
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
          if(this.userDp.includes("http://localhost:3000"))
            this.userDp = this.userDp.replace("http://localhost:3000", url);
          this.authStatusListener.next(true);

          const now = new Date();
          const expiryDate = new Date( now.getTime() + (expiryDuration * 1000) );
          this.saveAuthData(this.authToken, expiryDate, this.userId, this.username, this.userDp);

          if(cancelNav)
            this.router.navigate(['/settings']);
          else
            this.router.navigate(['/']);
        }
      }, err => {
        this.authStatusListener.next(false);
      });
  }

  logout = (cancelNav:boolean = false) => {
    this.authToken = null;
    this.isAuth = false;
    this.userId = null;
    this.username = null;
    this.userDp = null;
    this.authStatusListener.next(false);
    clearTimeout(this.timer);
    this.clearAuthData();
    if(!cancelNav)
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
    return this.http.get<{_id: string, username: string, dp: string}>(BACKEND_URL + "details/" + id);
  }

  getFullUserDetails = (id: string) => {
    return this.http.get<{
      _id: string, 
      username: string,
      email: string,
      dp: string
    }>(BACKEND_URL + "settings/" + id);
  }

  editUsername = (id: string, username: string) => {
    this.http.put<{username: string, email: string, password: string}>(BACKEND_URL + "username", { id: id, username: username })
      .subscribe(payload => {
        console.log(payload);
        localStorage.setItem("username", payload.username);
        this.username = payload.username;
        this.authStatusListener.next(true);
      });
  }

  editEmail = (id: string, email: string) => {
    this.http.put<{username: string, email: string, password: string}>(BACKEND_URL + "email", { id: id, email: email })
      .subscribe(payload => {
        console.log(payload);
        this.authStatusListener.next(true);
      });
  }
}
