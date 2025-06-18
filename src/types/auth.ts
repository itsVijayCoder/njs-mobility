export interface User {
   id: string;
   email: string;
   full_name: string;
   role: UserRole;
   status: "active" | "inactive";
   created_at: string;
   updated_at: string;
}

export type UserRole =
   | "admin"
   | "manager"
   | "shift_operator_1"
   | "shift_operator_2"
   | "shift_operator_3";

export interface AuthState {
   user: User | null;
   isLoading: boolean;
   isAuthenticated: boolean;
}

export interface LoginCredentials {
   email: string;
   password: string;
}

export interface AuthContextType extends AuthState {
   login: (credentials: LoginCredentials) => Promise<void>;
   logout: () => Promise<void>;
   updateUser: (user: Partial<User>) => void;
}
