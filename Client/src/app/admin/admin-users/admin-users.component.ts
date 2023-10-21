import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AdminUsersService } from '../../../Services/admin-users.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent {
  // Property to store pending users
  @Output() refresh: EventEmitter<any> = new EventEmitter();


  pendingUsers: any[] = [];

  constructor(private http: HttpClient, private AdminUsersService: AdminUsersService, private router: Router) { }




  getStudentsPendingClasses(): void {
    this.AdminUsersService.getStudentsPendingClasses()
      .subscribe((pending) => {
        this.pendingUsers = pending;

        this.fetchAdditionalUserData()

      });
  }

  fetchAdditionalUserData(): void {
    for (const user of this.pendingUsers) {
      this.AdminUsersService.fetchData(user, user.studentId, user.classId)
        .subscribe((data) => {
          user.info = data.info.message;
          user.userClass = data.userClass;
          console.log(data)
        });
    }
  }

  ngOnInit(): void {

    this.getStudentsPendingClasses()
  }

  // Function to handle user acceptance
  handleAccept(userId: number, classId: number): void {
    this.AdminUsersService.handleAccept(classId, userId)
      .subscribe(
        (response) => {
          this.getStudentsPendingClasses()
          this.refresh.emit()

        },
        (error) => {
          console.log(error)
        }
      )

  }
  // Function to handle user rejection
  handleReject(userId: number, classId: number): void {
    this.AdminUsersService.handleReject(classId, userId)
      .subscribe(
        (response) => {
          console.log('rejected')
          this.getStudentsPendingClasses()
          this.refresh.emit()
        },
        (error) => {
          console.log(error)
        }
      )

  }
}