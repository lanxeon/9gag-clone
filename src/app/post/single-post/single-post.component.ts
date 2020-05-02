import { AuthService } from './../../auth/auth.service';
import { PostService } from './../posts.service';
import { Post } from './../post.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {

  constructor(private postService: PostService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.isLoading = true;
    this.isAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.username = this.authService.getUserName();

    this.route.paramMap.subscribe((pm: ParamMap) =>
    {
      if(pm.has('id'))
      {
        this.postId = pm.get('id');

        this.postService.getPostById(this.postId)
        .subscribe(payload => {
          this.post = payload;
          this.isLoading = false;
          console.log(this.post);
        });
      }
    });
  }

  post: Post;
  //   _id: null,
  //   title: "lol",
  //   contentPath: "lol",

  // };
  userId: string;
  username: string;
  postId: string;
  isAuthenticated: boolean;
  isLoading:boolean = false;

  onUpvotePressed = (post: Post) => {

  }

  onDownvotePressed = (post: Post) => {

  }

  onDelete = (postId: string) => {

  }

}
