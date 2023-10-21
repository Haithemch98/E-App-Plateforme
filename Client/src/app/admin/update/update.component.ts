import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminClassService } from '../../../Services/admin-classes.service';
import { Class } from 'src/app/class';



@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent {

  @Input() updateModalOpen: boolean | undefined
  @Input() selectedClass: Class | undefined
  @Output() toggle: EventEmitter<any> = new EventEmitter();
  @Output() fetch: EventEmitter<any> = new EventEmitter();
  name: any = ''
  image !: File;


  constructor(private http: HttpClient, private adminClassService: AdminClassService) { }

  handleImageUpload(event: any): void {
    this.image = event.target.files[0];
  }

  handleUpdate(): void {
    if (this.name === '') {
      this.name = this.selectedClass?.name
    }
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('image', this.image);
    console.log(formData)
    console.log(this.image)
    console.log(this.name)
    this.adminClassService.updateClass(this.name, this.image, this.selectedClass?.id)
      .subscribe(
        (response) => {
          console.log('Class added successfully', response);
          this.fetch.emit()
          this.toggleUpdateModal()
        },
        (error) => {
          console.error("error handeling", error)
        }
      )
  }



  toggleUpdateModal(): void {
    this.toggle.emit()
  }

}
