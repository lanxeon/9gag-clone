import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { mimeType } from './mime-type.validator';
import { PostService } from '../posts.service';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  constructor(private postService: PostService) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(1)]}),
      'image': new FormControl(null, {validators:[Validators.required], asyncValidators:[mimeType]})
    });

  }

  form: FormGroup;
  isLoading: boolean = false;
  imgPreview: string = null;


  
  onImagePicked = (event: Event) => {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image': file});
    this.form.get('image').updateValueAndValidity();
    
    const fr = new FileReader();
    fr.onload = () => {
      this.imgPreview = <string>fr.result;
    }
    fr.readAsDataURL(file);
  }
  
  onAddPost = () => {
    if(this.form.invalid)
      return console.log("not valid");
    
    // this.postService.addPost(this.form.value.title, this.form.value.image);
    this.postService.addPost(this.form.value.title, this.imgPreview);
  }

  onReset = () => {
    this.imgPreview = null;
  }

}
