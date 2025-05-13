// =====================================================================
// Importing Angular modules and third-party dependencies
// =====================================================================
import { Component } from '@angular/core';

import { MatButtonModule} from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

// =====================================================================
// Footer Component Declaration
// =====================================================================
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
}
