export interface User {
    email: string;
    farmId: number;
    farmTitle: string;
    fcmMobileToken: string | null;
    fcmWebToken: string | null;
    name: string;
    password: string;
    passwordExpiry: string | null;
    phoneNo: string | null;
    profilePic: string | null;
    resetPasswordToken: string | null;
    roleId: string;
    userId: number;
  }
  