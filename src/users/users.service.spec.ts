import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/users.entity';

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
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(repository, 'create').mockReturnValue(newUser as User);
      jest.spyOn(repository, 'save').mockResolvedValue(newUser as User);
      expect(
        await service.create('test3', 'test3@email.com', 'Password3'),
      ).toEqual(newUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce(allUsers as User[]);
      expect(await service.findAll()).toEqual(allUsers);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(oneUser as User);
      expect(await service.findOne(1)).toEqual(oneUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(oneUser as User);
      expect(await service.findByEmail(oneUser.email)).toEqual(oneUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({
        email: oneUser.email,
      });
    });
  });

  describe('update', () => {
    it('should update a user by id with data, return updated user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(oneUser as User);
      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        ...oneUser,
        username: 'test1-updated',
      } as User);
      const user = await service.update(1, { username: 'test1-updated' });
      expect(user).toEqual({ ...oneUser, username: 'test1-updated' });
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith({
        ...oneUser,
        username: 'test1-updated',
      });
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(
        service.update(1, { username: 'test1-updated' }),
      ).rejects.toThrowError('User not found');
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a user by id, return removed user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(oneUser as User);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(oneUser as User);
      expect(await service.remove(1)).toEqual(oneUser);
      expect(repository.remove).toHaveBeenCalledWith(oneUser);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.remove(1)).rejects.toThrowError('User not found');
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
