import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from './../../auth/auth.service';
import { Post } from './../post.model';
import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private postService: PostService, private authService: AuthService, private route: ActivatedRoute, private router: Router) { }
  
  // @ViewChildren('video') vid:any;


  ngOnInit(): void {

    this.isAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();

    this.route.paramMap.subscribe((pm: ParamMap) => {
      if(pm.has('category'))
      {
        this.postService.getPostsByCategory(pm.get('category'));
        this.isLoading = true;
      }

      else if(pm.has('userId'))
      {
        const urlLast = this.router.url.split('/').pop();
        if(urlLast === 'posts')
          this.postService.getPostsByUserId(pm.get('userId'));
        else if(urlLast === 'upvotes')
          this.postService.getUpvotedPostsByUserId(pm.get('userId'));
      }

      else
      {
        this.postService.getPosts(this.isAuthenticated, this.userId);
        this.isLoading = true;
      }
    });

    this.postSubs = this.postService.getPostsUpdatedSub()
      .subscribe((payload) => {
        this.isLoading = false;
        this.posts = payload;
      });

    this.authSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }


  ngAfterViewInit(): void {
    // this.vid.toArray().forEach(vid => {
    //   vid.nativeElement.volume = 0.5;
    // });
  }
  

  ngOnDestroy(): void {
    this.postSubs.unsubscribe();
    this.authSubs.unsubscribe();
  }


  posts: Post[];
  private postSubs: Subscription;
  private authSubs: Subscription;
  isLoading = false;
  isAuthenticated: boolean;
  userId: string;


  onUpvotePressed = (post: Post) => {
    if(this.isAuthenticated)
    {
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

    else alert("Please login first");
  }


  onDownvotePressed = (post: Post) => {
    if(this.isAuthenticated)
    {
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

    else alert("Please login first");
  }


  // onCommentPressed = (post: Post) => {
  //   if(this.isAuthenticated)
  //     post.count.comments += 1;
  //   else alert("login first in order to comment");
  // }

  onDelete = (postId: string) =>
  {
    this.postService.deletePost(postId).subscribe(payload => 
      {
        this.postService.getPosts(this.isAuthenticated, this.userId);
      });
  }

}
