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
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'category': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators:[Validators.required], asyncValidators:[mimeType]})
    });

  }

  form: FormGroup;
  isLoading: boolean = false;
  imgPreview: string = null;
  categories: Array<string> = ['Funny', 'Animal', 'Gaming', 'Dark', 'Anime and Manga', 'Wholesome', 'Comic', 'Sports', 'Cosplay',
                                'GIF', 'Movies', 'T.V. Shows', 'Coronavirus', 'K-pop', 'Celebrity'];


  
  onImagePicked = (event: Event) => {
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
    if(file.size > 104857600) //limiting file size to 100mb to prevent browser crashes
     {
       alert("file too big");
       return;
     }
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
    
    this.postService.addPost(this.form.value.title, this.form.value.image, this.form.value.category);
  }

  onReset = () => {
    this.imgPreview = null;
  }

}
