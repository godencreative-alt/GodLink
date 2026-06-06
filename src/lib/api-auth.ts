import { auth } from './auth';
import { prisma } from './prisma';

export async function getApiUser(request: Request) {
  const session = await auth();
  if (session?.user?.id) {
    return {
      id: session.user.id,
      role: session.user.role || 'USER',
      email: session.user.email || null,
      source: 'session' as const
    };
  }

  const header = request.headers.get('authorization') || '';
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : null;

  if (!token) return null;

  const user = await prisma.user.findUnique({
    where: { apiKey: token },
    select: { id: true, role: true, email: true }
  });

  if (!user) return null;

  return {
    id: user.id,
    role: user.role,
    email: user.email,
    source: 'apiKey' as const
  };
}