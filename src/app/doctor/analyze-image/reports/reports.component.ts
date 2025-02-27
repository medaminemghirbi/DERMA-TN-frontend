import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';
interface PdfFile {
  name: string;
  url: string;
}
interface Prediction {
  id: string;

  title: string;
  created_at: Date;
  updated_at: Date;
  size: number;
  prediction_url: string;
  file_type: string;
  download_count: number;
  createur:string;

}
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  pdfFiles: PdfFile[] = [];
  selectedPrediction: any;
  selectedPatient: any;
  p:number = 1 ;
  filteredDocuments: { title: string }[] = []; // To store filtered documents
  sent_report_form!: FormGroup;
  newTitle: string = ''; // Property for the new title
  currentDocumentId: any; // To store the ID of the document being renamed
  dataDocument: any = {};
  predictions: any[] = [];
  patients :any
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
    this.sent_report_form = new FormGroup({
      patient_id: new FormControl(''),
      prediction_id: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.currentUser = this.auth.getcurrentuser();
    this.fetchPredictionsReports();
    this.userService.getPatients().subscribe(
      (data) => {
        this.patients = data;
  
        // Sort doctors safely
        this.patients.sort((a: any, b: any) => {
          const nameA = a.name || ''; // Default to empty string if undefined
          const nameB = b.name || ''; // Default to empty string if undefined
          return nameA.localeCompare(nameB);
        });

      },
      (err: HttpErrorResponse) => {
        console.error("Error fetching patients:", err);
        this.patients = [];
      }
    );
  }
  fetchPredictionsReports() {
    this.http
      .get<any[]>(
        `${environment.urlBackend}predictions/` + this.currentUser.id
      )
      .subscribe(
        (response) => {
          this.predictions = response;
          console.log(this.predictions)
        },
        (error) => {
          console.error('Error fetching fetch Predictions Reports:', error);
        }
      );
  }

  sent_report(patientId: any) {
    console.log("Prediction ID:", this.selectedPrediction.id);
    console.log("Patient ID:", patientId);
  
    this.http
      .post<any>(
        `${environment.urlBackend}sent_report/${patientId}/${this.selectedPrediction.id}`,
        {}
      )
      .subscribe(
        (response) => {
          this.predictions = response;
          console.log(this.predictions);
  
          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Report Sent Successfully',
            text: 'The report has been sent to the patient.',
            timer: 1500, // Message duration before it disappears
            showConfirmButton: false,
          });
  
          // Refresh page after 1 second (1000ms)
          setTimeout(() => {
            location.reload(); // Refresh the page
          }, 1000);
        },
        (error) => {
          console.error("Error sending report:", error);
  
          // Show error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an issue sending the report. Please try again.',
          });
        }
      );
  }
  
  
  selectPrediction(prediction: Prediction) {
    this.selectedPrediction = prediction;
  }


  downloadDocument(title: string, id: any) {
    this.http
      .get(environment.urlBackend + 'download_file/' + id, {
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
          this.fetchPredictionsReports();
        },
        (error) => {
          console.error('Download error:', error);
        }
      );
  }
  getdata(document: any) {
    this.dataDocument = document;

    // Update the form controls with the maladie data
    this.update.patchValue({
      title: document.title,
    });
  }

    updateMaladie() {
      if (this.update.valid) {
        // You can also add more properties if necessary
        const updateDocument = this.update.value;
  
        // Patch request to the backend
  
        this.userService
          .updatePrediction({ ...updateDocument, id: this.dataDocument.id })
          .subscribe(
            () => {
              this.toastr.success(
                'Report updated successfully!',
                'Update Success!'
              );
              setTimeout(() => {
                window.location.reload();
              }, 500);
            },
            (err: HttpErrorResponse) => {
              this.messageErr = err.error;
              this.toastr.error('Failed to update Report.', 'Update Failed!');
            }
          );
      } else {
        this.toastr.error('Please fill out all required fields.', 'Form Error');
      }
    }
}
