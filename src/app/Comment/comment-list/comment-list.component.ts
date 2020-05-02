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

  constructor(private commentService: CommentService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.commentsSub = this.commentService.getCommentSubs().subscribe(payload => {
      this.comments = payload;
    });

    this.route.paramMap.subscribe((param: ParamMap)=>
    {
      this.postId = param.get("id");
      this.commentService.getComments(this.postId);
    });
  }

  ngOnDestroy(): void {
    this.commentsSub.unsubscribe();
  }

  commentsSub: Subscription;
  postId: string;
  comments: Comment[] = [];

}
