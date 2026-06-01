import { useState } from 'react';

export type UserRole = 'agriculteur' | 'acheteur' | 'transporteur' | 'agent' | 'admin' | 'superadmin';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  region: string;
}

// Comptes de démonstration (en développement)
export const demoUsers: Record<UserRole, { phone: string; password: string; name: string; region: string }> = {
  agriculteur: {
    phone: '0340000001',
    password: 'agriculteur123',
    name: 'Rakoto Jean',
    region: 'Analamanga',
  },
  acheteur: {
    phone: '0340000002',
    password: 'acheteur123',
    name: 'Rasoa Marie',
    region: 'Vakinankaratra',
  },
  transporteur: {
    phone: '0340000003',
    password: 'transporteur123',
    name: 'Andry Rajaona',
    region: 'Itasy',
  },
  agent: {
    phone: '0340000004',
    password: 'agent123',
    name: 'Miora Ravelo',
    region: 'Atsinanana',
  },
  admin: {
    phone: '0340000005',
    password: 'admin123',
    name: 'Admin Système',
    region: 'Tananarive',
  },
  superadmin: {
    phone: '0340000006',
    password: 'superadmin123',
    name: 'Super Admin',
    region: 'Tananarive',
  },
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Connexion réelle (simulation ou appel API)
  const login = async (phone: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Vérifier si les identifiants correspondent à un compte démo
        const found = Object.entries(demoUsers).find(
          ([_, creds]) => creds.phone === phone && creds.password === password
        );
        if (found) {
          const [role, creds] = found;
          const loggedUser: User = {
            id: `demo_${role}`,
            phone: creds.phone,
            name: creds.name,
            role: role as UserRole,
            region: creds.region,
          };
          setUser(loggedUser);
          setLoading(false);
          resolve(loggedUser);
        } else {
          // Ici tu peux appeler ta vraie API plus tard
          reject(new Error('Numéro ou mot de passe incorrect'));
        }
      }, 800);
    });
  };

  const register = async (data: any): Promise<User> => {
    setLoading(true);
    // Implémente ton inscription ici (simulation ou API)
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = { id: Date.now().toString(), ...data };
        setUser(newUser);
        setLoading(false);
        resolve(newUser);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return { user, loading, error, login, register, logout };
};