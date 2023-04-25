import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/users.entity';
import { Repository } from 'typeorm';

const allUsers = [
  {
    id: 1,
    username: 'test1',
    email: 'test1@email.com',
    password: 'Password1',
  },
  {
    id: 2,
    username: 'test2',
    email: 'test2@email.com',
    password: 'Password2',
  },
];

const oneUser = {
  id: 1,
  username: 'test1',
  email: 'test1@email.com',
  password: 'Password1',
};

const newUser = {
  id: 3,
  username: 'test3',
  email: 'test3@email.com',
  password: 'Password3',
};

const mockRepository = {
  find: jest.fn().mockResolvedValue(allUsers),
  findOne: jest.fn().mockResolvedValue(oneUser),
  findOneBy: jest.fn().mockResolvedValue(oneUser),
  create: jest.fn().mockReturnValue(newUser),
  save: jest
    .fn()
    .mockImplementation((oneUser, data) => ({ ...oneUser, ...data })),
  remove: jest.fn().mockResolvedValue(oneUser),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      expect(
        await service.create('test3', 'test3@email.com', 'Password3'),
      ).toEqual(newUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await service.findAll()).toEqual(allUsers);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      expect(await service.findOne(1)).toEqual(oneUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      expect(await service.findByEmail(oneUser.email)).toEqual(oneUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({
        email: oneUser.email,
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user by id with data', async () => {
      const user = await service.updateUser(1, { username: 'test1-updated' });
      expect(user).toEqual({ ...oneUser, username: 'test1-updated' });
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith({
        ...oneUser,
        username: 'test1-updated',
      });
    });
  });

  describe('removeUser', () => {
    it('should remove a user by id', async () => {
      expect(await service.removeUser(1)).toEqual(oneUser);
      expect(repository.remove).toHaveBeenCalledWith(oneUser);
    });
  });
});
