import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

 /* posts=[
    {title:'First Post', content:'This is the first post'},
    {title:'Second Post', content:'This is the second post'},
    {title:'Third Post', content:'This is the third post'}
  ]*/
  posts:Post[]=[];
  isLoading=false;
  private postsSub:Subscription;
  currentPage=1;
  totalPosts;
  postsPerPage=2;
  pageSizeOptions=[1,2,5,10];
  private authListenerSubs:Subscription;
  userIsAuthenticated=false;
  userId:string;
  constructor(public postsService:PostsService, private authService:AuthService) { }

  ngOnInit() {

    this.isLoading=true;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.userId=this.authService.getUserId();
    this.postsSub=this.postsService.getPostUpdateListener().subscribe(
      (postsData:{posts:Post[],postCount:number})=>{
        this.isLoading=false;
        this.totalPosts=postsData.postCount;
        this.posts=postsData.posts;
      }
    )
    this.userIsAuthenticated=this.authService.getIsAuth();
    this.authListenerSubs=this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.userIsAuthenticated=isAuthenticated;
      this.userId=this.authService.getUserId();
    })
  }

  onChangedPage(event:PageEvent){
    this.isLoading=true;
    this.currentPage=event.pageIndex+1;
    this.postsPerPage=event.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPage)
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

  onDelete(postId:string){
    this.isLoading=true;
    this.postsService.deletePost(postId).subscribe(
      ()=>{
        this.postsService.getPosts(this.postsPerPage,this.currentPage)
      }
    )
  }

}
