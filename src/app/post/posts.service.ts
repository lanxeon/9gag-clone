import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  posts: Post[] = [];
  private postsUpdated = new Subject<{posts:Post[]}>();

  getPostsUpdatedSub = () => {
    return this.postsUpdated.asObservable();
  }

  addPost = (title: string, imagePath: string) => {
    let post: Post = {
      _id: null,
      title: title,
      contentPath: imagePath,
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      poster: null
    };
    this.posts.push(post);
    console.log(this.posts);
    this.postsUpdated.next({posts: [...this.posts]});
  }
}
