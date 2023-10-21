import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AdminClassService {

  constructor(private http: HttpClient) { }


  fetchClasses() {
    return this.http.get<any[]>('http://localhost:3000/classess/getAll');
  }

  addClass(name: string, image: File) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);


    return this.http.post("http://localhost:3000/classess", formData);
  }

  updateClass(name: string, image: File, classId: number | undefined) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);


    return this.http.put(`http://localhost:3000/classess/${classId}`, formData);
  }

  deleteClass(classId: number | undefined) {

    return this.http.delete(`http://localhost:3000/classess/${classId}`)

  }


}

