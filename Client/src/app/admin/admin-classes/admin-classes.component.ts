
import { Component, OnInit } from '@angular/core';
import { AdminClasses } from 'src/app/admin-classes';
import { AdminClassService } from '../../../Services/admin-classes.service';
import { HttpClient } from '@angular/common/http';
import { Class } from 'src/app/class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classes',
  templateUrl: './admin-classes.component.html',
  styleUrls: ['./admin-classes.component.css'],
})
export class AdminClassesComponent implements OnInit {
  addModalOpen: boolean = false;
  updateModalOpen: boolean = false;
  deleteModalOpen: boolean = false;
  selectedClass: Class | undefined
  name: string = '';
  image !: File;
  classList: any[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient, private adminClassService: AdminClassService) { }

  fetchClasses(): void {
    this.adminClassService.fetchClasses()
      .subscribe({
        next: (data: Class[]): void => {
          this.classList = data;
          console.log('Fetched classes successfully', this.classList);
        }, error: (error) => {
          console.error('Error fetching classes:', error);
        }
      });
  }


  ngOnInit(): void {
    this.fetchClasses()
  }
  handleImageUpload(event: any): void {
    this.image = event.target.files[0];

    // const file = event.target.files[0];
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('upload_preset', 'unsigned_upload');

  }



  // filteredClasses(): any[] {
  //   return this.classList.filter(classInfo =>
  //     classInfo.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }

  // handleDelete(classId: number): void {
  //   const shouldDelete = window.confirm('Are you sure you want to delete this class?');
  //   if (shouldDelete) {
  //     this.http.delete(`http://localhost:3000/classess/${classId}`)
  //       .subscribe(() => {
  //         this.fetchClasses();
  //       }, error => {
  //         console.error(error);
  //       });
  //   }
  // }

  handleSubmit(): void {

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('image', this.image);
    console.log(formData)
    console.log(this.image)
    console.log(this.name)
    this.adminClassService.addClass(this.name, this.image)
      .subscribe(
        (response) => {
          console.log('Class added successfully', response);
          this.classList.push(response);
          this.closeAddModal()
        },
        (error) => {
          console.error("error handeling", error)
        }
      )
  }


  handleDelete(classId: number | undefined): void {

    this.adminClassService.deleteClass(classId)
      .subscribe(
        (response) => {
          console.log('Class deleted successfully', response);
          this.fetchClasses()
          this.toggleDeleteModal()
        },
        (error) => {
          console.error("error handeling", error)
        }
      )

  }


  openAddModal(): void {
    this.addModalOpen = true;
    console.log("it worked ")
  }

  toggleUpdateModal(thisClass?: Class): void {
    this.updateModalOpen = !this.updateModalOpen;
    this.selectedClass = thisClass
  }

  toggleDeleteModal(thisClass?: Class): void {
    this.deleteModalOpen = !this.deleteModalOpen
    this.selectedClass = thisClass

  }

  closeAddModal(): void {
    this.addModalOpen = false;
  }



}