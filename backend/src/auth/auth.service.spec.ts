import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service';
import { PlayersService } from '../players/players.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

 beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AuthService,
      {
        provide: PlayersService,
        useValue: {
          findByUsername: jest.fn(),
          create: jest.fn(),
        },
      },
      {
        provide: JwtService,
        useValue: {
          sign: jest.fn(() => 'mock-token'),
        },
      },
    ],
  }).compile();

  service = module.get<AuthService>(AuthService);
});

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});