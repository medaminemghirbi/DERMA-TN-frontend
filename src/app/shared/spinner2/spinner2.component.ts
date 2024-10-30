import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner2',
  templateUrl: './spinner2.component.html',
  styleUrls: ['./spinner2.component.css']
})
export class Spinner2Component implements OnInit {
  @Input() isLoading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
