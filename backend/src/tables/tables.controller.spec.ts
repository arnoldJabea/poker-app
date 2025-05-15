import { Test, TestingModule } from '@nestjs/testing';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';
import { DeckService } from '../deck/deck.service';
import { PlayersService } from '../players/players.service';

describe('TablesController', () => {
  let controller: TablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TablesController],
      providers: [
        {
          provide: TablesService,
          useValue: {
            createTable: jest.fn(),
            getTables: jest.fn().mockReturnValue([]), 
          },
        },
        {
          provide: DeckService,
          useValue: {
            shuffle: jest.fn((deck) => deck),
            generateDeck: jest.fn(() => ['card1', 'card2']),
          },
        },
        {
          provide: PlayersService,
          useValue: {
            createAIPlayer: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TablesController>(TablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});