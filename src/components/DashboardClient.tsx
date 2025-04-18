'use client';

import { useState } from 'react';
import Header from './Header';
import Board from './Board';
import LoginRegisterModal from './LoginRegisterModal';

type Props = {
  user: { name: string } | null;
};

export default function DashboardClient({ user }: Props) {
  const [isModalOpen, setModalOpen] = useState(false);
  console.log(user);
  return (
    <>
      <Header user={user} onAuthClick={() => setModalOpen(true)} />
      <Board onAuthClick={() => setModalOpen(true)} />
      <LoginRegisterModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

