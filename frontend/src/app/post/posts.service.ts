// import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

// import { AuthService } from './../auth/auth.service';
import { Post } from './post.model';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/posts/";
const url = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, public router: Router) { }

  posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPostsUpdatedSub = () => {
    return this.postsUpdated.asObservable();
  }


  getPosts = (isAuthenticated: boolean, userId: string) => {
    const httpRequest = this.http.get<{message: string, posts: Post[], modPosts: Post[] | number}>(BACKEND_URL + "");
    
    if(!isAuthenticated)
    {
      httpRequest.subscribe(payload => {
        this.posts = [...payload.posts];
        this.updatePostAndDpUrls();
        this.postsUpdated.next([...this.posts]);
      });
    }

    else 
    {
      // let paramString = `?userId=${userId}`;
      this.http.get<{message: string, posts: Post[], modifiedPosts: Post[]}>(BACKEND_URL + "")
      .subscribe(payload => {
        this.posts = [...payload.modifiedPosts];
        this.updatePostAndDpUrls();
        this.postsUpdated.next([...this.posts]);
      });
    }
  }


  getPostsByCategory = (cat: string) => {
    this.http.get<{message: string, posts: Post[]}>(BACKEND_URL + "categories/" + cat)
      .subscribe(payload => {
        this.posts = payload.posts;
        this.updatePostAndDpUrls();
        this.postsUpdated.next([...this.posts]);
      });
  }


  getPostById = (id: string) => {
    return this.http.get<Post>(BACKEND_URL + "" + id);
  }

  getPostsByUserId = (id: string) => {
    this.http.get<{message: string, posts: Post[]}>(BACKEND_URL + "user/" + id)
    .subscribe(payload => {
      this.posts = payload.posts;
      this.updatePostAndDpUrls();
      this.postsUpdated.next([...this.posts]);
    });
  }

  getUpvotedPostsByUserId = (id: string) => {
    this.http.get<{message: string, posts: Post[]}>(BACKEND_URL + "user/upvoted/" + id)
    .subscribe(payload => {
      this.posts = payload.posts;
      this.updatePostAndDpUrls();
      this.postsUpdated.next([...this.posts]);
    });
  }


  addPost = (title: string, image: File, category: string) => {
    let post: FormData = new FormData();
    post.append("title", title);
    post.append("category", category);
    post.append("image", image, title);
    this.http.post<{message: string, post: Post}>("http://localhost:3000/posts", post)
      .subscribe(payload => {
        this.router.navigate(['/']);
      });
    // this.postsUpdated.next({posts: [...this.posts]});
  }


  deletePost = (id: string) =>
  {
    return this.http.delete(BACKEND_URL + "" + id);
  }


  addUpvote = (id: string) => 
  {
    this.http.post(BACKEND_URL + "upvote/" + id, {lol: "nothing"}).subscribe(payload =>
    {
      console.log(payload);
    });
  }


  addDownvote = (id: string) => 
  {
    this.http.post(BACKEND_URL + "downvote/" + id, {lol: "nothing"}).subscribe(payload =>
    {
      console.log(payload);
    });
  }

  updatePostAndDpUrls = () => {
    this.posts.forEach(post => {
      post.contentPath = post.contentPath.replace("http://localhost:3000", url);
      post.poster.dp = post.poster.dp.replace("http://localhost:3000", url);
    });
  }

}
