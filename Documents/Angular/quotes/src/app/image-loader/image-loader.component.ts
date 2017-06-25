import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'image-loader',
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.css']
})
export class ImageLoaderComponent implements OnInit {

  imageUrl: any;
  @ViewChild('img') img;
  constructor() { }

  showImage(event): void {
  	let file: File = event.target.files[0];
  	let url;

  	const reader: FileReader = new FileReader();
  	reader.onload = (e) => {
  		this.imageUrl = reader.result;

  	};

  	reader.readAsDataURL(file);
  }

  ngOnInit() {
  }

}
