import { AuthService } from './../../auth/auth.service';
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

  constructor(private postService: PostService, private authService: AuthService) { }
  
  ngOnInit(): void {

    this.isAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();

    this.postService.getPosts(this.isAuthenticated, this.userId);
    this.isLoading = true;
    this.postSubs = this.postService.getPostsUpdatedSub().subscribe(payload => {
      this.isLoading = false;
      this.posts = payload;
    });

    this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }
  
  ngOnDestroy(): void {
    this.postSubs.unsubscribe();
  }

  posts: Post[];
  private postSubs: Subscription;
  isLoading = false;
  isAuthenticated: boolean;
  userId: string;

  onUpvotePressed = (post: Post) => {
    this.postService.addUpvote(post._id);
    
    if(!post.voteStatus)
      {
        post.count.upvotes += 1;
        post.voteStatus = "upvoted";
      }
    else if(post.voteStatus === "upvoted")
    {
      post.voteStatus = null;
      post.count.upvotes -= 1;
    }
    else
    {
      post.voteStatus = "upvoted";
      post.count.downvotes -= 1;
      post.count.upvotes += 1;
    }
  }

  onDownvotePressed = (post: Post) => {
    this.postService.addDownvote(post._id);

    if(!post.voteStatus)
      {
        post.count.downvotes += 1;
        post.voteStatus = "downvoted";
      }
    else if(post.voteStatus === "downvoted")
    {
      post.voteStatus = null;
      post.count.downvotes -= 1;
    }
    else
    {
      post.voteStatus = "downvoted";
      post.count.upvotes -= 1;
      post.count.downvotes += 1;
    }
  }

  onCommentPressed = (post: Post) => {
    post.count.comments += 1;
  }

  onDelete = (postId: string) =>
  {
    this.postService.deletePost(postId).subscribe(payload => 
      {
        this.postService.getPosts(this.isAuthenticated, this.userId);
      });
  }

}
