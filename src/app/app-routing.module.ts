import { CommentListComponent } from './comment/comment-list/comment-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePostComponent } from './post/create-post/create-post.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { CreateCommentComponent } from './comment/create-comment/create-comment.component';

const routes: Routes = [
  {path: '', component: PostListComponent},
  {path: 'create', component: CreatePostComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'comments', component: CreateCommentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
