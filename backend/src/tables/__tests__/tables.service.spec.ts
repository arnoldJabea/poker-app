import { Test, TestingModule } from '@nestjs/testing';
import { TablesService } from '../tables.service';
import { DeckService } from '../../deck/deck.service';
import { PlayersService } from '../../players/players.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../../entities/player.entity';

describe('TablesService', () => {
  let service: TablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TablesService,
        {
          provide: DeckService,
          useValue: {
            generateDeck: jest.fn(() => ['mock-deck']),
            shuffle: jest.fn((deck) => deck),
          },
        },
        {
          provide: PlayersService,
          useValue: {
            createAIPlayer: jest.fn(),
            resetPlayer: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Player),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TablesService>(TablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});