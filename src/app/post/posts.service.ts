import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { Post } from './post.model';

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
    const httpRequest = this.http.get<{message: string, posts: Post[], modPosts: Post[] | number}>("http://localhost:3000/posts");
    
    if(!isAuthenticated)
    {
      httpRequest.subscribe(payload => {
        const newPosts = [...payload.posts];
        this.postsUpdated.next(newPosts);
      });
    }

    else 
    {
      let paramString = `?userId=${userId}`;
      this.http.get<{message: string, posts: Post[], modifiedPosts: Post[]}>("http://localhost:3000/posts" + paramString)
      .subscribe(payload => {
        const newPosts = [...payload.modifiedPosts];
        this.postsUpdated.next(newPosts);
      });
    }
  }


  getPostById = (id: string) => {
    return this.http.get<Post>("http://localhost:3000/posts/" + id);
  }


  addPost = (title: string, image: File) => {
    let post: FormData = new FormData();
    post.append("title", title);
    post.append("image", image, title);
    this.http.post<{message: string, post: Post}>("http://localhost:3000/posts", post)
      .subscribe(payload => {
        this.router.navigate(['/']);
      });
    // this.postsUpdated.next({posts: [...this.posts]});
  }


  deletePost = (id: string) =>
  {
    return this.http.delete("http://localhost:3000/posts/" + id);
  }


  addUpvote = (id: string) => 
  {
    this.http.post("http://localhost:3000/posts/upvote/" + id, {lol: "nothing"}).subscribe(payload =>
    {
      console.log(payload);
    });
  }


  addDownvote = (id: string) => 
  {
    this.http.post("http://localhost:3000/posts/downvote/" + id, {lol: "nothing"}).subscribe(payload =>
    {
      console.log(payload);
    });
  }

}
