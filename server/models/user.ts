import * as mongoose from 'mongoose';
import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose';

export interface IUser {
  username: string;
  isAdmin?: boolean;
  apps: IAppOwnership[];
};

export enum UserAppRight {
  NONE = 0,
  VIEW = 0x1,
  MANAGE = 0x2,
  DELETE = 0x4,
  INTERACT = 0x8,
};

export interface IAppOwnership {
  id: string;
  right: UserAppRight;
};

export class AppOwnership implements IAppOwnership {
  @prop({ required: true })
  public id: string;

  @prop({ required: true })
  public right: UserAppRight;

  @prop()
  public isAdmin?: boolean;

  public hasRight(right: UserAppRight) { return (this.right & right) === right; }
};

export class User implements IUser {
  @prop({ required: true })
  public username: string;

  @prop({ default: [] })
  public apps: AppOwnership[];

  @prop({ required: true })
  public hashedPassword: string;

  public isValidPassword(password: string) { return User.hash(password) === password; }

  public getPublicData() {
    return {
      id: (this as any)._id,
      username: this.username,
    };
  }

  // todo: proper hashing
  public static hash(input: string) { return input; }
};

export const UserModel = getModelForClass(User) as mongoose.Model<DocumentType<User>>;
