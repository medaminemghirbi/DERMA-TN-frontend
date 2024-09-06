import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css'],
})
export class ForumsComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  messages: any[] = [];
  selectedFiles: File[] = [];
  currentuser: any;
  addmessage = this.fb.group({
    text: ['', [Validators.required]],
  });
  ws: WebSocket | undefined;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private Auth: AuthService
  ) {
    this.currentuser = this.Auth.getcurrentuser();
  }

  ngOnInit(): void {
    this.initializeWebSocket();
    this.fetchMessages();
  }

  initializeWebSocket() {
    if (this.ws) return; // Avoid creating multiple WebSocket connections

    this.ws = new WebSocket('ws://localhost:3000/cable');
    this.ws.onopen = () => {
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
        console.log('Message image URLs:', message.message_image_urls); // Log image URLs
        if (!this.messages.some(m => m.id === message.id)) {
          this.setMessagesAndScrollDown([...this.messages, message]);
        }
      }
    };
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const body = target['message'].value;
    target['message'].value = '';

    const formData = new FormData();
    formData.append('message[body]', body);
    this.selectedFiles.forEach((file) => {
      formData.append('message[images][]', file);
    });
    formData.append('message[sender_id]', this.currentuser.id);

    try {
      await this.http.post('http://localhost:3000/api/v1/messages', formData).toPromise();
      this.selectedFiles = []; // Clear selected files array
      this.fileInput.nativeElement.value = ''; // Reset file input
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async fetchMessages() {
    const url = `http://localhost:3000/api/v1/messages`;
    try {
      const data = await this.http.get<any[]>(url).toPromise();
      this.setMessagesAndScrollDown(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  setMessagesAndScrollDown(data: any[]) {
    this.messages = data;
    console.log(this.messages);
    this.resetScroll();
    this.cdr.detectChanges();
  }

  resetScroll() {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }
}
