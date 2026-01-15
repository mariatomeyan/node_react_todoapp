import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white border-b border-gray-100">
            <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">Todos</h1>
                </div>
                {user && (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
                        <button onClick={logout} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
