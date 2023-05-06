import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { User } from '@/entities/users.entity';

const scryptAsync = promisify(scrypt);

const registeredUserFactory = async (
  username: string,
  email: string,
  password: string,
) => {
  const salt = randomBytes(8).toString('hex');
  const hash = (await scryptAsync(password, salt, 32)) as Buffer;
  const result = salt + '.' + hash.toString('hex');
  return {
    id: 1,
    username,
    email,
    password: result,
  } as Partial<User>;
};

const registeredUserPromise = registeredUserFactory(
  'testUser1',
  'test1@email.com',
  'testPassword1',
);

const registeredUserInput: Partial<User> = {
  id: 1,
  username: 'testUser1',
  email: 'test1@email.com',
  password: 'testPassword1',
};

const newUser: Partial<User> = {
  id: 2,
  username: 'newUser1',
  email: 'new1@email.com',
  password: 'newPassword1',
};

const mockUsersService: Partial<UsersService> = {
  create: (username, email, password) =>
    Promise.resolve({
      id: 1,
      username,
      email,
      password,
    } as User),
  findByEmail: jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve(null))
    .mockImplementationOnce(() => Promise.resolve(registeredUserPromise))
    .mockImplementationOnce(() => Promise.resolve(registeredUserPromise))
    .mockImplementationOnce(() => Promise.resolve(null))
    .mockImplementation(() => Promise.resolve(registeredUserPromise)),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        AuthService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('signup should create a user with a salted and hashed password', async () => {
      const user = await authService.signup(
        newUser.username,
        newUser.email,
        newUser.password,
      );
      expect(user.password).not.toEqual(newUser.password);
      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('signup should throw an error if email is in use', async () => {
      await expect(
        authService.signup(
          registeredUserInput.username,
          registeredUserInput.email,
          registeredUserInput.password,
        ),
      ).rejects.toThrowError('Email in use');
    });
  });

  describe('login', () => {
    it('login should return a user', async () => {
      const registeredUser = await registeredUserPromise;
      const user = await authService.login(
        registeredUserInput.email,
        registeredUserInput.password,
      );
      expect(user).toEqual(registeredUser);
    });

    it('login should throw an error if user not found', async () => {
      await expect(
        authService.login(newUser.email, newUser.password),
      ).rejects.toThrowError('User not found');
    });

    it('login should throw an error if password is incorrect', async () => {
      await expect(
        authService.login(
          registeredUserInput.email,
          registeredUserInput.password + 'wrong',
        ),
      ).rejects.toThrowError('Incorrect password');
    });
  });
});
