import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css'],
})
export class ForumsComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  messages: any[] = [];
  currentuser: any;
  addmessage: FormGroup;
  ws: WebSocket | undefined;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private Auth: AuthService
  ) {
    this.currentuser = this.Auth.getcurrentuser();
    this.addmessage = this.fb.group({
      text: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initializeWebSocket();
    this.fetchMessages();
  }

  initializeWebSocket() {
    if (this.ws) return; // Avoid creating multiple WebSocket connections

    this.ws = new WebSocket('ws://localhost:3000/cable');
    this.ws.onopen = () => {
      console.log('Connected to WebSocket server');
      this.ws?.send(JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({ channel: 'MessagesChannel' })
      }));
    };

    this.ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'ping' || data.type === 'welcome' || data.type === 'confirm_subscription') return;

      const message = data.message;
      if (message && !this.messages.some(m => m.id === message.id)) {
        this.setMessagesAndScrollDown([...this.messages, message]);
      }
    };
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const body = target['message'].value;
    target['message'].value = '';

    const sender_id = this.currentuser.id;
    await this.http.post('http://localhost:3000/api/v1/messages', {
      message: { body, sender_id }
    }).toPromise();
  }

  async fetchMessages() {
    const url = `http://localhost:3000/api/v1/messages`;
    const data = await this.http.get<any[]>(url).toPromise();
    this.setMessagesAndScrollDown(data || []);
  }

  setMessagesAndScrollDown(data: any[]) {
    this.messages = data;
    this.resetScroll();
    this.cdr.detectChanges();
  }

  resetScroll() {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }
}