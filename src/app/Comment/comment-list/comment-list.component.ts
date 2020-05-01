import { CommentService } from './../comment.service';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Comment } from '../comment.model';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit, OnDestroy {

  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
    this.commentsSub = this.commentService.getCommentSubs().subscribe(payload => {
      this.comments = payload;
    });
  }

  ngOnDestroy(): void {
    this.commentsSub.unsubscribe();
  }

  commentsSub: Subscription;
  comments: Comment[] = [];

}
