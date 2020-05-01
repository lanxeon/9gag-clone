import { CommentService } from './../comment.service';
import { AuthService } from './../../auth/auth.service';
import { CommentListComponent } from './../comment-list/comment-list.component';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.css']
})
export class CreateCommentComponent implements OnInit {

  constructor(private authService: AuthService, private commentService: CommentService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.username = this.authService.getUserName();
  }

  userId: string;
  username: string;
  commentInput: string = "";

  onAddComment = () => {
    this.commentService.addComment(this.commentInput, this.userId, this.username);
    this.commentInput = "";
  }

}
