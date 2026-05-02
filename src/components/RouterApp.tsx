'use client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import StartPage from '@/pages/StartPage';
import HomePage from '@/pages/HomePage';
import CustomSetupPage from '@/pages/CustomSetupPage';
import CustomGamePage from '@/pages/CustomGamePage';
import QuickPlayPage from '@/pages/QuickPlayPage';

export default function RouterApp() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/daily" element={<HomePage />} />
        <Route path="/play" element={<QuickPlayPage />} />
        <Route path="/custom" element={<CustomSetupPage />} />
        <Route path="/custom/play/:encoded" element={<CustomGamePage />} />
      </Routes>
    </BrowserRouter>
  );
}
