import { useState, useContext, createContext } from 'react';

// This will define what the User info will hold
type User = {
    id: string;
    username: string;
    profile_picture: string;
};

// This defines the type for UserContext for typescript
type UserContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// This is used within app.tsx to provide the user information
export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>({
        id: '-1',
        username: '',
        profile_picture: '',
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

// This function is used anywhere you want to use user information
export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return ctx;
}
