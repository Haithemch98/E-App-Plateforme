import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../user'



@Component({
  selector: 'app-pending-users',
  templateUrl: './pending-users.component.html',
  styleUrls: ['./pending-users.component.css']
})
export class PendingUsersComponent {

  @Input() user: any;
  @Output() accept: EventEmitter<any> = new EventEmitter();
  @Output() reject: EventEmitter<any> = new EventEmitter();


  ngOnInit(): void {
    console.log(this.user)
  }

  triggerAccept() {
    this.accept.emit();

  }

  triggerReject() {
    this.reject.emit();
  }

}
