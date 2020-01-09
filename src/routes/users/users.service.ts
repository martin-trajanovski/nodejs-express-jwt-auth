import HttpException from '../../exceptions/HttpException';
import User from '../user/user.interface';
import userModel from '../user/user.model';

class UsersService {
  private users = userModel;

  public async getAll(): Promise<User[]> {
    try {
      const result = await this.users.find({}, '-password -refreshToken');

      return result;
    } catch (error) {
      throw new HttpException(500, 'Something went wrong');
    }
  }
}

export default UsersService;
