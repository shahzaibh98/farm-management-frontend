export interface LoginPageProps {
  email: string;
  password: string;
}

interface UserInfo {
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  userId: number;
  name: string;
  isActive: string;
  isDeleted: string;
  email: string;
  fcmWebToken: string | null;
  fcmMobileToken: string | null;
  profilePic: string | null;
  phoneNo: string | null;
  passwordExpiry: string | null;
  resetPasswordToken: string | null;
  roleId: string;
  farmId: number;
  farmTitle: string;
}

export interface AuthData {
  token: string;
  refreshToken: string;
  userInfo: UserInfo;
}
