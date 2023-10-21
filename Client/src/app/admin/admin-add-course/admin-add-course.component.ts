import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Course } from 'src/app/course';
import { CoursesComponent } from 'src/app/user/courses/courses.component';

import { FormsModule } from '@angular/forms';
import { CoursesService } from 'src/Services/courses.service';

@Component({
  selector: 'app-admin-add-course',
  templateUrl: './admin-add-course.component.html',
  styleUrls: ['./admin-add-course.component.css']
})
export class AdminAddCourseComponent implements OnInit {
  classId: number | undefined;
  courses: Course[] = [];
  name: string = '';
  file !: File;
  errorMessage: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private location: Location, private CoursesService: CoursesService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.classId = params['classId'];
      console.log('Class ID:', this.classId);
      console.log(this.name)
    });
    this.fetchCourses()
  }

  onFileSelected(event: any): void {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      this.file = fileInput.files[0];
    }
  }
  handleSubmit(): void {
    console.log("fgfgfgfgfg", this.name);
    console.log("fiiiiiile", this.file)
    console.log("this is the class is ", this.classId)
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('file', this.file);

    console.log(this.name);
    console.log(this.file);
    if (this.classId) {
      this.CoursesService.addCourseToClass(this.classId, this.name, this.file)
        .subscribe(
          (response: any) => {
            console.log(response)
            this.courses = [...this.courses, response]
          },
          (error) => {
            console.log(error)
          }
        )
    }

    // Rest of your code
    else {
      this.errorMessage = 'Please provide both a name and a file, and ensure the classId is not null.';
    }
  }
  //   .post(`http://localhost:3000/courses/classId`, formData)
  //   .subscribe({
  //     next: (response) => {
  //       console.log('Course added successfully!');
  //       this.fetchCourses();
  //       this.name = ''; 
  //       this.file = null; 
  //       this.errorMessage = ''; 
  //     },
  //     error: (error) => {
  //       console.error('Error adding course:', error);
  //       this.errorMessage = 'An error occurred while adding the course.';
  //     }
  //   });



  fetchCourses(): void {
    if (this.classId) {
      this.CoursesService.getCourses(this.classId)
        .subscribe(
          (response: Course[]) => {
            this.courses = response; // Store the courses in the array
            console.log("oyyyyyyyyyy", this.courses)
          }, (error) => {
            console.log(error)
          }
        )
    }
  }

  handleOpenPDF(file: File): void {
    window.open(`http://localhost:3000/${file}`, "_blank")
  }



  //   this.http
  //     .get(`http://localhost:3000/courses/${this.classId}`)
  //     .subscribe({
  //       next: (data: any) => {
  //         this.courses = data;
  //       },
  //       error: (error) => {
  //         console.error('Error fetching courses:', error);
  //         this.errorMessage = 'An error occurred while fetching courses.';
  //       }
  //     });
  // }
}
