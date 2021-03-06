import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { CommentService } from '../comment.service';
import { AuthService } from '../../auth/auth.service';
import { CommentListComponent } from '../comment-list/comment-list.component';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.css']
})
export class CreateCommentComponent implements OnInit {

  constructor(private authService: AuthService, private commentService: CommentService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.isAuthenticated = this.authService.getIsAuth();
    if(this.isAuthenticated)
    {
      this.userId = this.authService.getUserId();
      this.username = this.authService.getUserName();
      this.userDp = this.authService.getUserDp();
    }

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.postId = paramMap.get("id");
    });
  }

  userId: string;
  username: string;
  userDp: string;
  postId: string;
  isAuthenticated: boolean = false;
  commentInput: string = "";

  onAddComment = () => {
    this.commentService.addComment(this.commentInput, this.postId);
    this.commentInput = "";
  }

  lol = () => {
    console.log("lol");
  }

}
