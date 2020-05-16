import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ErrorComponent } from './../../error/error.component';
import { AuthService } from './../../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.isAuthenticated = this.authService.getIsAuth();
    this.username = this.authService.getUserName();
    this.userId = this.authService.getUserId();

    this.route.paramMap.subscribe((pm: ParamMap) =>
    {
      if(pm.has("userId"))
      {
        // this.isLoading = true
        this.pageUserId = pm.get("userId");
        this.navLinks = [
          {
            //path: `user/${this.pageUserId}/posts`,
            path: `../posts`,
            label: 'Posts'
          },
          {
            // path: `user/${this.pageUserId}/upvotes`,
            path: `../upvotes`,
            label: 'Upvotes'
          }
        ];
      }
      else
      {
        this.dialog.open(ErrorComponent, {data: { message: "Woops! Seems there is no such user"}});
        this.router.navigate(['']);
      }
    });
  }

  userId: string = null;
  username: string = null;
  pageUserId: string = null;
  isAuthenticated: boolean = false;
  isLoading:boolean = true
  navLinks: Array<{path: string, label: string}> = [
    {
      path: `user/${this.pageUserId}/posts`,
      label: 'Posts'
    },
    {
      path: `user/${this.pageUserId}/upvotes`,
      label: 'Comments'
    }
  ];

}
