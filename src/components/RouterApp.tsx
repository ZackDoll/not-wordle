'use client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import StartPage from '@/pages/StartPage';
import HomePage from '@/pages/HomePage';
import CustomSetupPage from '@/pages/CustomSetupPage';
import CustomGamePage from '@/pages/CustomGamePage';

export default function RouterApp() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/daily" element={<HomePage />} />
        <Route path="/custom" element={<CustomSetupPage />} />
        <Route path="/custom/play/:encoded" element={<CustomGamePage />} />
      </Routes>
    </BrowserRouter>
  );
}
