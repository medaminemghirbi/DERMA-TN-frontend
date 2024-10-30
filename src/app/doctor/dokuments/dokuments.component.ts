import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-dokuments',
  templateUrl: './dokuments.component.html',
  styleUrls: ['./dokuments.component.css'],
})
export class DokumentsComponent implements OnInit {
  p:number = 1 ;
  filteredDocuments: { title: string }[] = []; // To store filtered documents

  newTitle: string = ''; // Property for the new title
  currentDocumentId: any; // To store the ID of the document being renamed
  dataDocument: any = {};
  documents: any[] = [];
  currentUser: any;
  document = {
    title: '',
    file: null,
  };
  update!: FormGroup;
  messageErr = '';
  previewUrl: SafeResourceUrl | null = null;
  fileType: string = '';
  selectedDocument: any = null; // Store the selected document for preview

  constructor(
    private http: HttpClient,
    private userService: AdminService,
    private auth: AuthService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService
  ) {
    this.update = new FormGroup({
      title: new FormControl(''),
    });
  }

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
      reader.readAsDataURL(file); // Preview image
    } else if (this.fileType === 'application/pdf') {
      reader.readAsDataURL(file); // Preview PDF
    }
  }

  fetchDocuments() {
    this.http
      .get<any[]>(
        `${environment.urlBackend}api/v1/documents/` + this.currentUser.id
      )
      .subscribe(
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

    this.http
      .post(`${environment.urlBackend}api/v1/documents`, formData)
      .subscribe(
        (response) => {
          console.log('Document uploaded successfully', response);
          this.fetchDocuments(); // Refresh the documents list after successful upload
          window.location.reload();
        },
        (error) => {
          console.error('Upload error:', error);
        }
      );
  }

  togglePreview(document: any, event: MouseEvent) {
    event.preventDefault(); // Prevent the default behavior of the anchor tag
    if (this.selectedDocument && this.selectedDocument.title === document.title) {
      // If the same document is clicked again, hide the preview
      this.selectedDocument = this.selectedDocument === document ? null : document;
      this.previewUrl = null; // Reset the preview URL
    } else {
      this.selectedDocument = document; // Show the selected document
      this.fileType = document.file_type; // Assuming 'file_type' is in the document object
  
      let documentUrl = document.document_url;
  
      // Check if the document is a PDF and append the `&embedded=true` parameter
      if (this.fileType === 'application/pdf') {
        documentUrl += '&embedded=true'; // Append embedded=true for PDFs
      }
      // Set the preview URL using the sanitized URL
      this.previewUrl = this.getSafeUrl(documentUrl);
    }
  }
  
  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  

  // getSafeUrl(url: string): SafeResourceUrl {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }
  delete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Archive it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .delete(environment.urlBackend + 'api/v1/documents/' + id)
          .subscribe(
            (response) => {
              console.log('Document uploaded successfully', response);
              this.fetchDocuments();
              window.location.reload();
            },
            (error) => {
              console.error('Upload error:', error);
            }
          );
      }
    });
  }
  getdata(document: any) {
    this.dataDocument = document;

    // Update the form controls with the maladie data
    this.update.patchValue({
      title: document.title,
    });
  }
  downloadDocument(title: string, id: any) {
    this.http
      .get(environment.urlBackend + 'api/v1/download_file/' + id, {
        responseType: 'blob',
      })
      .subscribe(
        (response: Blob) => {
          const url = window.URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = url;

          // Set the filename (optional, you can retrieve this from the backend or set it manually)
          link.download = title; // Customize based on your file name or type
          link.click();

          // Clean up by revoking the object URL
          window.URL.revokeObjectURL(url);

          // Optionally refresh the document list or perform other actions
          this.fetchDocuments();
        },
        (error) => {
          console.error('Download error:', error);
        }
      );
  }

  updateMaladie() {
    if (this.update.valid) {
      // You can also add more properties if necessary
      const updateDocument = this.update.value;

      // Patch request to the backend

      this.userService
        .updateDocument({ ...updateDocument, id: this.dataDocument.id })
        .subscribe(
          () => {
            this.toastr.success(
              'Disease updated successfully!',
              'Update Success!'
            );
            setTimeout(() => {
              window.location.reload();
            }, 500);
          },
          (err: HttpErrorResponse) => {
            this.messageErr = err.error;
            this.toastr.error('Failed to update document.', 'Update Failed!');
          }
        );
    } else {
      this.toastr.error('Please fill out all required fields.', 'Form Error');
    }
  }
  deleteAllDocuments() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Archive it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .delete(
            environment.urlBackend +
              'api/v1/delete_all_documents/' +
              this.currentUser.id
          )
          .subscribe(
            () => {
              window.location.reload();
            },
            (error) => {
              console.error('Upload error:', error);
            }
          );
      }
    });
  }
}
