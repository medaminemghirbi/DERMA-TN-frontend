import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css'],
})
export class ForumsComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  message_empty: boolean =true;
  messages: any[] = [];
  selectedFiles: File[] = [];
  currentuser: any;
  role: any;
  imageUrls: string[] = [];

  addmessage = this.fb.group({
    text: ['', [Validators.required]],
  });
  ws: WebSocket | undefined;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private Auth: AuthService,
    private usersService: AdminService,
    private toastr: ToastrService
  ) {
    this.currentuser = this.Auth.getcurrentuser();
    this.role = this.Auth.getRole();
  }

  ngOnInit(): void {
    this.initializeWebSocket();
    this.fetchMessages();
  }

  initializeWebSocket() {
    if (this.ws) return; // Avoid creating multiple WebSocket connections

    this.ws = new WebSocket(
      `${environment.urlBackend.replace(/^http(s)?:\/\//, (match) => match === 'https://' ? 'wss://' : 'ws://').replace(/\/$/, '')}/cable`
    );    this.ws.onopen = () => {
      this.ws?.send(JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({ channel: 'MessagesChannel' })
      }));
    };

    this.ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'ping' || data.type === 'welcome' || data.type === 'confirm_subscription') return;
    
      const message = data.message;
      if (message) {
        console.log('Received message:', message); // Log message data
        debugger
        console.log('Message image URLs:', message.message_image_urls); // Log image URLs
        if (!this.messages.some(m => m.id === message.id)) {
          this.setMessagesAndScrollDown([...this.messages, message]);
        }
      }
    };
  }
  combinedImages(message: any): any[] {
    const urls = message.message_image_urls || [];
    const images = message.images || [];
    return [...urls, ...images];
  }
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const allowedExtensions = ['image/png', 'image/jpeg', 'image/jpg' ];
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      this.selectedFiles = Array.from(input.files).filter(file =>
        allowedExtensions.includes(file.type)
      );
      if (this.selectedFiles.length === 0) {
        input.value = '';
        this.toastr.error('Pls Provied  Only Images!', 'Error Loading Image! ');
      }
    }
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    if(target['message'].value !="" || this.selectedFiles.length !=0){
      this.message_empty == false;
      const body = target['message'].value;
      target['message'].value = '';
      const formData = new FormData();
      formData.append('message[body]', body);
      this.selectedFiles.forEach((file) => {
        formData.append('message[images][]', file);
      });
      formData.append('message[sender_id]', this.currentuser.id);
  
      try { 
        await this.http.post(environment.urlBackend + 'api/v1/messages', formData).toPromise();
        this.selectedFiles = []; // Clear selected files array
        this.fileInput.nativeElement.value = ''; // Reset file input
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }else{
      this.toastr.error('No Message!', 'Pls Provied  A Message!');
    }
  }

  async fetchMessages() {
    const url = environment.urlBackend + 'api/v1/messages';
    try {
      const data = await this.http.get<any[]>(url).toPromise();
      this.setMessagesAndScrollDown(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  setMessagesAndScrollDown(data: any[]) {
    this.messages = data;
    console.log(this.messages)
    console.log(this.messages);
    this.resetScroll();
    this.cdr.detectChanges();
  }

  resetScroll() {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }

  delete(id: any, i: number) {
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
        this.usersService.ArchiverMessage(id).subscribe(
          response => {
            // If the deletion is successful, remove the user from the list
            this.messages.splice(i, 1);
            Swal.fire(
              'Deleted!',
              'Message  has been Archived.',
              'success'
            );
          },
          error => {
            // If there's an error, display the error message
            Swal.fire(
              'Error!',
              'You can\'t archvie this Message',
              'error'
            );
          }
        );
      }
    });
  }

  delete_all() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Archive all!'
    }).then((result) => {
      if (result.isConfirmed) {
        const ids = this.messages.map(message => message.id); // Assuming each message has an `id` property
        let archivedMessages = 0;
  
        ids.forEach((id, index) => {
          this.usersService.ArchiverMessage(id).subscribe(
            response => {
              // If the archiving is successful, remove the message from the list
              archivedMessages++;
              this.messages.splice(index, 1);
  
              // Show success once all messages are archived
              if (archivedMessages === ids.length) {
                Swal.fire(
                  'Archived!',
                  'All messages have been archived.',
                  'success'
                );
              }
            },
            error => {
              // Handle error for any individual message
              Swal.fire(
                'Error!',
                'Some messages could not be archived.',
                'error'
              );
            }
          );
        });
      }      
      window.location.reload()
    });
  }
  downloadImage(messageId: number, imageId: number): void {
    this.usersService.downloadImage(messageId, imageId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'image.jpg'; // You can set a dynamic filename here
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Download error:', error);
    });
  }
  
}
