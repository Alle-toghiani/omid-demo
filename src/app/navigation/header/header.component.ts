import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output()  sidenavToggle = new EventEmitter<void>();
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
  onToggle(){
    this.sidenavToggle.emit();
  }

  onLogOut(){
    this.authService.logout();
  }



}
