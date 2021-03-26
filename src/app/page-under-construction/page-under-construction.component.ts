import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from "@angular/router";
import {TimeInterval} from "rxjs";

@Component({
  selector: 'app-page-under-construction',
  templateUrl: './page-under-construction.component.html',
  styleUrls: ['./page-under-construction.component.scss']
})
export class PageUnderConstructionComponent implements OnInit {

  constructor(private router:Router) { }

  counter: number = 5;
  timer;

  ngOnInit(): void {
    this.timer = setInterval(()=>{
      if ( this.counter === 0 ){
        this.router.navigate(['/']);
        this.timer.clearInterval;
      }
      this.counter--;
    },1000);
  }
  ngOnDestroy(){
    this.timer.clearTimeout;
  }

}
