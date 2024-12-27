import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  loading = true;
  currentuser:any
  constructor(private auth: AuthService,private notificationService: AdminService) {
    this.currentuser = this.auth.getcurrentuser();
  }

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.notificationService.getNotifications(this.currentuser.id).subscribe((data) => {
      this.notifications = data;
      this.loading = false;
    });
  }

  // markAsRead(notificationId: number): void {
  //   this.notificationService.markAsRead(notificationId).subscribe(() => {
  //     this.notifications = this.notifications.filter(
  //       (n) => n.id !== notificationId
  //     );
  //   });
  // }

}
