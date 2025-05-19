import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/templates/header/header.component";
import { FooterComponent } from "./components/templates/footer/footer.component";
import { PlayersService } from './services/players/players.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true
})
export class AppComponent implements OnInit {
  constructor(private playersService: PlayersService) { }

  async ngOnInit() {
    try {
      const players = await this.playersService.findAll();
      console.log(' Connexion réussie au backend ....:', players);
    } catch (error) {
      console.error('Échec de la connexion au backend :', error);
    }
  }
}