import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/users.entity';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

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

const registeredUserHashedPromise = registeredUserFactory(
  'testUser1',
  'test1@email.com',
  'testPassword1',
);

const registeredUser: Partial<User> = {
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
    .mockImplementationOnce(() => Promise.resolve(registeredUser))
    .mockImplementationOnce(() => Promise.resolve(registeredUserHashedPromise))
    .mockImplementationOnce(() => Promise.resolve(null))
    .mockImplementation(() => Promise.resolve(registeredUserHashedPromise)),
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
          registeredUser.username,
          registeredUser.email,
          registeredUser.password,
        ),
      ).rejects.toThrowError('Email in use');
    });
  });

  describe('login', () => {
    it('login should return a user', async () => {
      const registeredUserHashed = await registeredUserHashedPromise;
      const user = await authService.login(
        registeredUser.email,
        registeredUser.password,
      );
      expect(user).toEqual(registeredUserHashed);
    });

    it('login should throw an error if user not found', async () => {
      await expect(
        authService.login(newUser.email, newUser.password),
      ).rejects.toThrowError('User not found');
    });

    it('login should throw an error if password is incorrect', async () => {
      await expect(
        authService.login(
          registeredUser.email,
          registeredUser.password + 'wrong',
        ),
      ).rejects.toThrowError('Incorrect password');
    });
  });
});
