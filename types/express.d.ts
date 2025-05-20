declare global {
  namespace Express {
    interface User {
      _id: string;
      email: string;
      userName: string;
      roles: string[];
    }
  }
}
