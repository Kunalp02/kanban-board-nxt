'use client';

import { FiLogOut } from 'react-icons/fi';

type HeaderProps = {
  user: { name: string; role?: string } | null;
  onAuthClick: () => void;
};

export default function Header({ user, onAuthClick }: HeaderProps) {
  return (
    <header className="bg-white shadow py-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
        <h1 className="text-lg font-semibold text-indigo-700">Kanban Board</h1>

        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="font-medium text-gray-800">{user.name}</span>
                {user.role && (
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md uppercase font-semibold tracking-wide">
                    {user.role}
                  </span>
                )}
              </div>

              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  title="Logout"
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <FiLogOut size={18} />
                </button>
              </form>
            </div>
          ) : (
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md shadow-md transition duration-300"
              onClick={onAuthClick}
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}


