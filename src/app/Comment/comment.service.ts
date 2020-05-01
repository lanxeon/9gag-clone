import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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

  addComment = (content: string, uid: string, usn: string) =>
  {
    const comment:Comment = {
      _id: null,
       content: content,
        count:{
          upvotes: 0,
          downvotes: 0,
          replies: 0
        },
        post: "lol", 
        commenterId: uid,
        commenterUsername: usn
    }
    this.comments.push(comment);
    this.commentsUpdate.next([...this.comments]);
  }

}
