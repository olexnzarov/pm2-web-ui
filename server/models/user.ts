import * as mongoose from 'mongoose';
import { prop, getModelForClass, DocumentType } from '@typegoose/typegoose';

export interface IUser {
  username: string;
  isAdmin?: boolean;
  apps: IAppOwnership[];
};

export enum UserAppRight {
  OWNER = 'owner',
  ADMIN = 'admin',
  VIEWER = 'viewer',
};

export interface IAppOwnership {
  id: string;
  right: UserAppRight;
};

export class AppOwnership implements IAppOwnership {
  private static rightsHierarchy = {
    [UserAppRight.OWNER]: { [UserAppRight.OWNER]: true },
    [UserAppRight.ADMIN]: { [UserAppRight.OWNER]: true, [UserAppRight.ADMIN]: true },
    [UserAppRight.VIEWER]: { [UserAppRight.OWNER]: true, [UserAppRight.ADMIN]: true, [UserAppRight.VIEWER]: true },
  };

  @prop({ required: true })
  public id: string;

  @prop({ required: true })
  public right: UserAppRight;

  @prop()
  public isAdmin?: boolean;

  public hasRight(right: UserAppRight) { return AppOwnership.rightsHierarchy[right][this.right] === true; }
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

  public static hash(input: string) { return input; }
};

export const UserModel = getModelForClass(User) as mongoose.Model<DocumentType<User>>;
