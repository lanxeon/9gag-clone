import { Post } from './../post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  constructor(private postService: PostService) { }
  
  ngOnInit(): void {
    this.postSubs = this.postService.getPostsUpdatedSub().subscribe(payload => {
      this.posts = payload.posts;
    })
  }
  
  ngOnDestroy(): void {
    this.postSubs.unsubscribe();
  }

  posts: Post[];
  private postSubs: Subscription;

  onUpvotePressed = (post: Post) => {
    post.upvotes += 1;
  }

  onDownvotePressed = (post: Post) => {
    post.downvotes += 1;
  }

  onCommentPressed = (post: Post) => {
    post.comments += 1;
  }

}
