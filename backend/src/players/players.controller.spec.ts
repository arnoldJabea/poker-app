import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../entities/player.entity';
import { JwtService } from '@nestjs/jwt';

describe('PlayersController', () => {
  let controller: PlayersController;

  const mockPlayerRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    find: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        PlayersService,
        {
          provide: getRepositoryToken(Player),
          useValue: mockPlayerRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});