import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';
import { User } from '../entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';

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

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(registeredUsers),
            findOne: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await usersController.findAll()).toEqual(registeredUsers);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = registeredUsers[0];
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user as User);
      const result = await usersController.findOne(user.id.toString());
      expect(result).toEqual(user);
      expect(usersService.findOne).toHaveBeenCalledWith(user.id);
    });

    it('should throw NotFoundException when user is not found', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);
      await expect(usersController.findOne('0')).rejects.toThrowError(
        'User not found',
      );
    });
  });

  describe('update', () => {
    it('should update a user by id with data', async () => {
      const user = registeredUsers[0];
      jest.spyOn(usersService, 'update').mockResolvedValue(user as User);
      const result = await usersController.update(user.id.toString(), {
        username: 'testUser1-updated',
      } as UpdateUserDto);
      expect(result).toEqual(user);
      expect(usersService.update).toHaveBeenCalledWith(user.id, {
        username: 'testUser1-updated',
      });
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const user = registeredUsers[0];
      jest.spyOn(usersService, 'remove').mockResolvedValue(user as User);
      const result = await usersController.remove(user.id.toString());
      expect(result).toEqual(user);
      expect(usersService.remove).toHaveBeenCalledWith(user.id);
    });
  });
});
