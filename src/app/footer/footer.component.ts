import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  serverId: number = 10;
  serverName: string = 'server EU 1';
  serverData: string = "";

  onBtnClick(){
    this.serverId = 11;
  }
  onInputText(event : Event ){
    this.serverData = (<HTMLInputElement>event.target).value;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
