import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Course } from '../app/course'

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  

  constructor(private http: HttpClient) { }
             

  private coursesUrl = 'http://localhost:3000/courses';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);
      return of(result as T);
    };
  }
  addCourseToClass(classId: number, name: string, file: File) {
    const formData = new FormData();
    formData.append('name', name);  
    formData.append('file', file);

    return this.http.post(`http://localhost:3000/courses/${classId}`, formData);
  }

  // handleDelete() {
  //   const shouldDelete = window.confirm('Are you sure you want to delete this course?');
  //   if (shouldDelete) {
  //     this.http.delete(`http://localhost:3000/courses/${this.courseId}`).subscribe(() => {
  //     }, error => {
  //       console.log(error);
  //     });
  //   }
  // }
 



  getCourses(id: number): Observable<Course[]> {
    const url = `${this.coursesUrl}/${id}`
    return this.http.get<Course[]>(url)
      .pipe(
        tap(_ => this.log('aaaaaaaaaaaaaaaaa')),
        catchError(this.handleError<Course[]>('getCourses', []))
      );
  }

  log(something: any): void {
    console.log(something)
  }
  joinClass(classID: number, CourseId: number) {
    const url = `${this.coursesUrl}/${classID}/${CourseId}`
    return this.http.post(url, null, this.httpOptions)
      .pipe(
        tap(_ => this.log(url)),
        catchError(this.handleError('joinClass', []))
      )
  }

} 

