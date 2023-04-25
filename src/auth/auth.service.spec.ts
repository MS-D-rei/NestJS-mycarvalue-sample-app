import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';

describe('AuthService', () => {
  let authService: AuthService;
  const fakeUsersService = {
    create: () =>
      Promise.resolve({
        id: 1,
        username: 'John',
        email: 'john@mail.com',
        password: 'Password',
      }),
    findOne: () => Promise.resolve({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        AuthService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
