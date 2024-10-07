import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dokuments',
  templateUrl: './dokuments.component.html',
  styleUrls: ['./dokuments.component.css']
})
export class DokumentsComponent implements OnInit {
  documents: any[] = [];
  currentUser: any;
  document = {
    title: '',
    file: null
  };
  previewUrl: SafeResourceUrl | null = null;
  fileType: string = '';
  selectedDocument: any = null;  // Store the selected document for preview

  constructor(private http: HttpClient, private auth: AuthService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getcurrentuser();
    this.fetchDocuments();
  }

  onFileSelected(event: any) {
    this.document.file = event.target.files[0];

    // Reset the preview URL
    this.previewUrl = null;

    // Get the file type for conditional display
    const file = event.target.files[0];
    this.fileType = file.type;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    };

    // Check if it's an image or PDF, then preview accordingly
    if (this.fileType.includes('image')) {
      reader.readAsDataURL(file);  // Preview image
    } else if (this.fileType === 'application/pdf') {
      reader.readAsDataURL(file);  // Preview PDF
    }
  }

  fetchDocuments() {
    this.http.get<any[]>(`${environment.urlBackend}api/v1/documents/` + this.currentUser.id ).subscribe(
      (response) => {
        this.documents = response;
      },
      (error) => {
        console.error('Error fetching documents:', error);
      }
    );
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('document[title]', this.document.title);
  
    if (this.document.file) {
      formData.append('document[file]', this.document.file);
    } else {
      console.error('No file selected for upload.');
      return;
    }
    formData.append('document[doctor_id]', this.currentUser.id);

    this.http.post(`${environment.urlBackend}api/v1/documents`, formData).subscribe(
      (response) => {
        console.log('Document uploaded successfully', response);
        this.fetchDocuments(); // Refresh the documents list after successful upload
        window.location.reload()
      },
      (error) => {
        console.error('Upload error:', error);
      }
    );
  }

  togglePreview(document: any, event: MouseEvent) {
    event.preventDefault();  // Prevent the default behavior of the anchor tag
    if (this.selectedDocument && this.selectedDocument.title === document.title) {
      // If the same document is clicked again, hide the preview
      this.selectedDocument = null;
      this.previewUrl = null;  // Reset the preview URL
    } else {
      this.selectedDocument = document;  // Show the selected document
      this.fileType = document.file_type;  // Assuming 'file_type' is in the document object

      // Set the preview URL based on the document type
      this.previewUrl = this.getSafeUrl(document.document_url);
    }
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  delete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Archive it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete( environment.urlBackend + 'api/v1/documents/' + id).subscribe(
          (response) => {
            console.log('Document uploaded successfully', response);
            this.fetchDocuments();
            window.location.reload()
          },
          (error) => {
            console.error('Upload error:', error);
          }
        );
      }
    });
  }
}
