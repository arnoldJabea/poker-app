import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from '../players.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../../entities/player.entity';
import { JwtService } from '@nestjs/jwt';

describe('PlayersService', () => {
  let service: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: getRepositoryToken(Player),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn((player) => Promise.resolve(player)),
            create: jest.fn((data) => ({ id: 1, ...data })),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mocked-token'),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an AI player and add it to the table', async () => {
    const mockTable = { players: [] } as any;
    const aiPlayer = await service.createAIPlayer('Bot42', mockTable);

    expect(aiPlayer.username).toBe('Bot42');
    expect(aiPlayer.isAI).toBe(true);
    expect(mockTable.players).toContain(aiPlayer);
  });
});