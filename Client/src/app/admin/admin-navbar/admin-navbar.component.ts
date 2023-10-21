import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminUsersService } from '../../../Services/admin-users.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {

  requestSize: number = 0

  constructor(private router: Router, private AdminUsersService: AdminUsersService, private route: ActivatedRoute) { }


  path: string = this.router.url


  getNotification(): void {
    this.AdminUsersService.getStudentsPendingClasses()
      .subscribe((pending) => {
        this.requestSize = pending.length;


      });
  }

  ngOnInit(): void {
    this.getNotification()
    this.path = this.route.url.toString().slice(22)
    this.path = this.router.url
  }

  log(something: any): void {
    console.log(something)
  }

  showMe: boolean = false

  toggle(): void {
    this.showMe = !this.showMe
  }

  logout(): void {
    localStorage.clear()
    this.router.navigate(['/']);

  }
}
