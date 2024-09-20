import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {
  role: string | null = null;
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.role = this.auth.getRole();

  }
}
