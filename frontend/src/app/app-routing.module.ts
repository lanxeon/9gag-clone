import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePostComponent } from './post/create-post/create-post.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { SinglePostComponent } from './post/single-post/single-post.component';
import { UserPostsComponent } from './user/user-posts/user-posts.component';
import { AuthGuard2 } from './auth/auth2.guard';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  {path: '', component: PostListComponent},
  {path: 'create', component: CreatePostComponent, canActivate: [AuthGuard]},
  {path: 'signup', component: SignupComponent, canActivate: [AuthGuard2]},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard2]},
  {path: 'post/:id', component: SinglePostComponent},
  {path: 'category/:category', component: PostListComponent},
  {path: 'user/:userId', redirectTo: 'user/:userId/posts'},
  {path: 'user/:userId/posts', component: UserPostsComponent},
  {path: 'user/:userId/upvotes', component: UserPostsComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthGuard2]
})
export class AppRoutingModule { }
