export enum UserAppRight {
  NONE = 0,
  VIEW = 0x1,
  MANAGE = 0x2,
  DELETE = 0x4,
  INTERACT = 0x8,
};

export interface IUser {
  username: string;
  isAdmin?: boolean;
  apps: IAppOwnership[];
};

export interface IAppOwnership {
  id: string;
  right: UserAppRight;
};
