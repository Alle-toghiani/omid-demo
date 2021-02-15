import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
@Output() closeSidenav = new EventEmitter<void>();
  authSubscription: Subscription;
  authStatus : boolean;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubscription= this.authService.authChange.subscribe(
      authstatus =>{
        this.authStatus = authstatus;
      }
    )
  }
  ngOnDestroy(): void{
    this.authSubscription.unsubscribe();
  }

  onLogOut(){
    this.authService.logout();
  }

  onClose(){
    this.closeSidenav.emit();
  }

}
