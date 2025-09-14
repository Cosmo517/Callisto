import { useState, useContext, createContext } from 'react';

// This will define what the User info will hold
type Page = {
    page: string;
};

// This defines the type for UserContext for typescript
type PageContextType = {
    page: Page;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
};

const PageContext = createContext<PageContextType | undefined>(undefined);

// This is used within app.tsx to provide the user information
export function PageProvider({ children }: { children: React.ReactNode }) {
    const [page, setPage] = useState<Page>({
        page: 'Library',
    });

    return (
        <PageContext.Provider value={{ page, setPage }}>
            {children}
        </PageContext.Provider>
    );
}

// This function is used anywhere you want to use user information
export function usePage() {
    const ctx = useContext(PageContext);
    if (!ctx) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return ctx;
}
