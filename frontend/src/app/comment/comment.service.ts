// import { environment } from './../../environments/environment.prod';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Comment } from './comment.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "/comments/";
const url = environment.apiUrl;

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

    this.http.post<{message: string, comment: Comment}>(BACKEND_URL, body)
    .subscribe(payload => {
      const comment = payload.comment;
      this.comments.push(comment);
      this.comments.forEach(comment => {
        comment.commenter.dp = comment.commenter.dp.replace("http://localhost:3000", url);
      });
      this.commentsUpdate.next([...this.comments]);
    });
  }


  getComments = (postId: string) => {
    this.http.get<{message: string, comments: Comment[]}>(BACKEND_URL + postId)
    .subscribe(payload => {
      this.comments = payload.comments;
      this.comments.forEach(comment => {
        comment.commenter.dp = comment.commenter.dp.replace("http://localhost:3000", url);
      });
      this.commentsUpdate.next([...this.comments]);
    });
  }

  addUpvote = (id: string) => 
  {
    this.http.post(BACKEND_URL + "upvote/" + id, {lol: "nothing"}).subscribe(payload =>
    {
      console.log(payload);
    });
  }


  addDownvote = (id: string) => 
  {
    this.http.post(BACKEND_URL + "downvote/" + id, {lol: "nothing"}).subscribe(payload =>
    {
      console.log(payload);
    });
  }

}