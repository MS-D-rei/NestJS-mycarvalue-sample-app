import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { User } from '@/entities';
import { SignupDto } from '@/auth/dto/signup.dto';
import { LoginDto } from '@/auth/dto/login.dto';

const registeredUsers: Partial<User>[] = [
  {
    id: 1,
    username: 'testUser1',
    email: 'user1@email.com',
    password: 'testPassword1',
  },
  {
    id: 2,
    username: 'testUser2',
    email: 'user2@email.com',
    password: 'testPassword2',
  },
];

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup, set session.userId, and then return the new user', async () => {
      const newUser: Partial<User> = {
        id: 3,
        username: 'newUser1',
        email: 'newUser1@email.com',
        password: 'newPassword1',
      };
      const session = {
        userId: null,
      };
      jest.spyOn(authService, 'signup').mockResolvedValue(newUser as User);
      const result = await authController.signup(newUser as SignupDto, session);
      // return new user.
      expect(result).toEqual(newUser);
      // set session.userId.
      expect(session.userId).toEqual(newUser.id);
      // call authService.signup.
      expect(authService.signup).toHaveBeenCalledWith(
        newUser.username,
        newUser.email,
        newUser.password,
      );
    });
  });

  describe('login', () => {
    it('should call authService.login, set session.userId, and then return the user', async () => {
      const user: Partial<User> = registeredUsers[0];
      const session = {
        userId: null,
      };
      jest.spyOn(authService, 'login').mockResolvedValue(user as User);
      const result = await authController.login(user as LoginDto, session);
      // return user.
      expect(result).toEqual(user);
      // set session.userId.
      expect(session.userId).toEqual(user.id);
      // call authService.login.
      expect(authService.login).toHaveBeenCalledWith(user.email, user.password);
    });
  });

  describe('logout', () => {
    it('should set session.userId to null', async () => {
      const session = {
        userId: 1,
      };
      authController.logout(session);
      expect(session.userId).toBeNull();
    });
  });
});
