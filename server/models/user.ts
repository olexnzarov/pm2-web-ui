import * as mongoose from 'mongoose';
import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose';
import { UserAppRight, IAppOwnership, IUser } from '../../shared/user';

export class AppOwnership implements IAppOwnership {
  @prop({ required: true })
  public id: string;

  @prop({ required: true })
  public right: UserAppRight;
};

export class User implements IUser {
  @prop({ required: true })
  public username: string;

  @prop({ default: [] })
  public apps: AppOwnership[];

  @prop()
  public isAdmin?: boolean;

  @prop({ required: true })
  public hashedPassword: string;

  public isValidPassword(password: string) { return User.hash(password) === password; }

  public hasRight(app: string, right: UserAppRight) {
    const own = this.apps.find(a => a.id === app);
    return own ? (own.right & right) === right : false;
  }

  public getPublicData() {
    return {
      id: (this as any)._id,
      username: this.username,
      isAdmin: this.isAdmin,
      apps: this.apps,
    };
  }

  // todo: proper hashing
  public static hash(input: string) { return input; }
};

export const UserModel = getModelForClass(User) as mongoose.Model<DocumentType<User>>;
