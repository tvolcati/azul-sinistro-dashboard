import bcrypt from "bcryptjs";

export type UserRole = "sanus_admin" | "sanus_viewer" | "azul_viewer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

/**
 * Carrega os usuários aprovados a partir da variável de ambiente AUTH_USERS_JSON.
 *
 * Formato esperado da env var (array JSON):
 * [
 *   { "id": "1", "name": "Thiago", "email": "thiago@sanus.com", "passwordHash": "<bcrypt>", "role": "sanus_admin" },
 *   { "id": "2", "name": "Azul Viewer", "email": "azul@azul.com", "passwordHash": "<bcrypt>", "role": "azul_viewer" }
 * ]
 *
 * Para gerar um hash: node -e "const b=require('bcryptjs'); console.log(b.hashSync('senha', 10))"
 */
function loadUsers(): AuthUser[] {
  const raw = process.env.AUTH_USERS_JSON;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AuthUser[];
  } catch {
    console.error("[auth] AUTH_USERS_JSON inválido");
    return [];
  }
}

export async function findUserByCredentials(
  email: string,
  password: string
): Promise<AuthUser | null> {
  const users = loadUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}
