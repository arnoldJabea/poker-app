import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartGameComponent } from './start-game.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TablesService } from '../../../services/tables/tables.service';
import { of, throwError } from 'rxjs';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockSnackBar {
  open = jasmine.createSpy('open');
}

class MockTablesService {
  create = jasmine.createSpy('create').and.returnValue(of({}));
}

describe('StartGameComponent', () => {
  let component: StartGameComponent;
  let fixture: ComponentFixture<StartGameComponent>;
  let tablesService: MockTablesService;
  let router: MockRouter;
  let snackBar: MockSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartGameComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: MatSnackBar, useClass: MockSnackBar },
        { provide: TablesService, useClass: MockTablesService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartGameComponent);
    component = fixture.componentInstance;
    tablesService = TestBed.inject(TablesService) as any;
    router = TestBed.inject(Router) as any;
    snackBar = TestBed.inject(MatSnackBar) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', async () => {
    component.startGameForm.patchValue({
      name_game: '',
    });
    await component.startGame();
    expect(snackBar.open).toHaveBeenCalledWith(
      "Formulaire invalide. Veuillez vérifier les champs.",
      "Fermer",
      { duration: 5000, panelClass: ['snackbar-error'] }
    );
    expect(tablesService.create).not.toHaveBeenCalled();
  });

  it('should submit and navigate on valid form', async () => {
    component.startGameForm.setValue({
      name_game: 'Poker Game',
      number_players: '4',
      starting_bet: '100',
      betting_limit: '1000',
      game_mode: 'normal',
      duration_game: '60'
    });

    await component.startGame();

    expect(tablesService.create).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      "Les informations ont bien été enregistrée et pris en comptes !",
      "Fermer",
      { duration: 5000, panelClass: ['snackbar-success'] }
    );
    expect(router.navigate).toHaveBeenCalledWith(['/game-in-progress']);
  });

  it('should show error snackbar on exception', async () => {
    tablesService.create.and.returnValue(Promise.reject('Erreur serveur'));

    component.startGameForm.setValue({
      name_game: 'Poker Game',
      number_players: '4',
      starting_bet: '100',
      betting_limit: '1000',
      game_mode: 'normal',
      duration_game: '60'
    });

    await component.startGame();

    expect(snackBar.open).toHaveBeenCalledWith(
      "Erreur lors de l'inscription.",
      "Fermer",
      { duration: 5000, panelClass: ['snackbar-error'] }
    );
  });
});
