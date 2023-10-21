import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserComponent } from './user/user.component';
import { UserNavBarComponent } from './user/user-nav-bar/user-nav-bar.component';
import { ClassesComponent } from './user/classes/classes.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from 'src/Services/auth-guard.service';
import { AuthService } from 'src/Services/auth.service';
import { HomeComponent } from './user/home/home.component';
import { CoursesComponent } from './user/courses/courses.component';
import { TodoListComponent } from './user/todo-list/todo-list.component';
import { TodoListService } from 'src/Services/todo-list.service'
import { AdminNavbarComponent } from './admin/admin-navbar/admin-navbar.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminClassesComponent } from './admin/admin-classes/admin-classes.component';
import { PendingUsersComponent } from './admin/pending-users/pending-users.component';
import { UpdateComponent } from './admin/update/update.component';
import { AdminAddCourseComponent } from './admin/admin-add-course/admin-add-course.component';


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    UserComponent,
    UserNavBarComponent,
    ClassesComponent,
    SignUpComponent,
    HomeComponent,
    CoursesComponent,
    TodoListComponent,
    AdminNavbarComponent,
    AdminUsersComponent,
    AdminClassesComponent,
    PendingUsersComponent,
    UpdateComponent,
    AdminAddCourseComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthGuard,
    AuthService,
    TodoListService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
