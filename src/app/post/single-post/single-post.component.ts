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
  userId: string;
  username: string;
  postId: string;
  isAuthenticated: boolean;
  isLoading:boolean = false;

  onUpvotePressed = () => {
    if(this.isAuthenticated)
    {
      this.postService.addUpvote(this.post._id);
      
      if(!this.post.voteStatus)
        {
          this.post.count.upvotes += 1;
          this.post.voteStatus = "upvoted";
        }
      else if(this.post.voteStatus === "upvoted")
      {
        this.post.voteStatus = null;
        this.post.count.upvotes -= 1;
      }
      else
      {
        this.post.voteStatus = "upvoted";
        this.post.count.downvotes -= 1;
        this.post.count.upvotes += 1;
      }
    }

    else alert("you need to be signed up first hoe");
  }

  onDownvotePressed = () => {
    if(this.isAuthenticated)
    {
      this.postService.addDownvote(this.post._id);

      if(!this.post.voteStatus)
        {
          this.post.count.downvotes += 1;
          this.post.voteStatus = "downvoted";
        }
      else if(this.post.voteStatus === "downvoted")
      {
        this.post.voteStatus = null;
        this.post.count.downvotes -= 1;
      }
      else
      {
        this.post.voteStatus = "downvoted";
        this.post.count.upvotes -= 1;
        this.post.count.downvotes += 1;
      }
    }

    else alert("sign up first hoe");
  }

  onDelete = () => {

  }

}
