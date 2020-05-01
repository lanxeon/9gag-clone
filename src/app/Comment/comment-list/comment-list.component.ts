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
      console.log("reached here");
      this.comments = payload;
    });
  }

  ngOnDestroy(): void {
    this.commentsSub.unsubscribe();
  }

  commentsSub: Subscription;
  comments: Comment[] = [
    {
      content: "hello",
      count: {
        upvotes: 0,
        downvotes: 0,
        replies: 0
      },
      post: "some post",
      commenterId: "adsfsghsd",
      commenterUsername: "lanxion",
      _id: "asnkj282u398jc983"
    },
    {
      content: "hello again",
      count: {
        upvotes: 4,
        downvotes: 1,
        replies: 3
      },
      post: "some post",
      commenterId: "lanxion",
      commenterUsername: "lanxion",
      _id: "asnkj28nfd3hd8229"
    }
  ];

}
