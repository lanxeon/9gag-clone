import { AuthService } from './../../auth/auth.service';
import { CommentService } from './../comment.service';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Comment } from '../comment.model';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit, OnDestroy {

  constructor(private commentService: CommentService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {

    this.isAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.username = this.authService.getUserName();

    this.commentsSub = this.commentService.getCommentSubs().subscribe(payload => {
      this.comments = payload;
    });

    this.authSub = this.authService.getAuthStatusListener()
    .subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.userId = this.authService.getUserId();
      this.username = this.authService.getUserName();
    });

    this.route.paramMap.subscribe((param: ParamMap)=>
    {
      this.postId = param.get("id");
      this.commentService.getComments(this.postId);
    });
  }

  ngOnDestroy(): void {
    this.commentsSub.unsubscribe();
    this.authSub.unsubscribe();
  }

  commentsSub: Subscription;
  authSub: Subscription;
  postId: string;
  comments: Comment[] = [];
  isAuthenticated: boolean = false;
  userId: string;
  username: string;

  onUpvotePressed = (comment: Comment) => {
    if(this.isAuthenticated)
    {
      this.commentService.addUpvote(comment._id);
      
      if(!comment.voteStatus)
      {
        comment.count.upvotes += 1;
        comment.voteStatus = "upvoted";
      }
      else if(comment.voteStatus === "upvoted")
      {
        comment.voteStatus = null;
        comment.count.upvotes -= 1;
      }
      else
      {
        comment.voteStatus = "upvoted";
        comment.count.downvotes -= 1;
        comment.count.upvotes += 1;
      }
    }

    else alert("you need to be signed up first hoe");
  }

  onDownvotePressed = (comment: Comment) => {
    if(this.isAuthenticated)
    {
      this.commentService.addDownvote(comment._id);

      if(!comment.voteStatus)
      {
        comment.count.downvotes += 1;
        comment.voteStatus = "downvoted";
      }
      else if(comment.voteStatus === "downvoted")
      {
        comment.voteStatus = null;
        comment.count.downvotes -= 1;
      }
      else
      {
        comment.voteStatus = "downvoted";
        comment.count.upvotes -= 1;
        comment.count.downvotes += 1;
      }
    }

    else alert("sign up first hoe");
  }

}
