import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-menu-drawer',
  templateUrl: './left-menu-drawer.component.html',
  styleUrls: ['./left-menu-drawer.component.css']
})
export class LeftMenuDrawerComponent implements OnInit {
  fontSize = 'sm';

  toggle(size: string) {
    this.fontSize = size;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
