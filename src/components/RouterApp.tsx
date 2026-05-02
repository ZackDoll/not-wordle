'use client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StartPage from '@/pages/StartPage';
import HomePage from '@/pages/HomePage';

export default function RouterApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/daily" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
