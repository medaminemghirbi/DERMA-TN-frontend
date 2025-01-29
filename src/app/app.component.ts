import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from './services/admin.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PFE2025-front';
  currentUser:any
  DefaultLanguage:any
  constructor(private translate: TranslateService,
    private auth: AuthService,
    private usersService: AdminService
  ) {}
  ngOnInit(): void {
    this.currentUser = this.auth.getcurrentuser();
    if(this.currentUser){
      this.usersService.getDefaultLanguage(this.currentUser.id).subscribe({
        next: (data) => {
          this.DefaultLanguage = data; // Assign the language data
          if (this.DefaultLanguage && this.DefaultLanguage.language) {
            // Use the language for translation
            this.translate.setDefaultLang(this.DefaultLanguage.language);
            this.translate.use(this.DefaultLanguage.language);
          }
        },
        error: (err) => {
          console.error('Error fetching default language:', err);
          this.translate.setDefaultLang('fr');
          this.translate.use('fr');
        },
      });
    }

  }
  
}
