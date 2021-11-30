import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { User } from '../api/models/User';
import { TOKEN_SECRET } from '../config/config';

export function generateUserToken(user: User): string {
  const { id, username, role } = user;
  return jsonwebtoken.sign({ id, username, role }, TOKEN_SECRET as string, {
    expiresIn: '24h'
  });
}

export function verifyUserToken(token: string): JwtPayload {
  return jsonwebtoken.verify(token, TOKEN_SECRET as string) as JwtPayload;
}
