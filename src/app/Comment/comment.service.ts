import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Comment } from './comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  public comments: Comment[] = [];
  private postId: string;
  private commentsUpdate = new Subject<Comment[]>();


  getCommentSubs = () => {
    return this.commentsUpdate.asObservable();
  }


  addComment = (content: string, postId: string) =>
  {
    let body = {
      content: content,
      postId: postId
    };

    this.http.post<{message: string, comment: Comment}>("http://localhost:3000/comments", body)
    .subscribe(payload => {
      const comment = payload.comment;
      this.comments.push(comment);
      this.commentsUpdate.next([...this.comments]);
    });
  }


  getComments = (postId: string) => {
    this.http.get<{message: string, comments: Comment[]}>("http://localhost:3000/comments/" + postId)
    .subscribe(payload => {
      this.comments = payload.comments;
      this.commentsUpdate.next([...this.comments]);
    });
  }

}


// const comment:Comment = {
    //   _id: null,
    //    content: content,
    //     count:{
    //       upvotes: 0,
    //       downvotes: 0,
    //       replies: 0
    //     },
    //     post: null, 
    //     commenterId: uid,
    //     commenterUsername: usn
    // }