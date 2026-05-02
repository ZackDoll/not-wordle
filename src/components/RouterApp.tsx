'use client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import StartPage from '@/views/StartPage';
import HomePage from '@/views/HomePage';
import CustomSetupPage from '@/views/CustomSetupPage';
import CustomGamePage from '@/views/CustomGamePage';
import QuickPlayPage from '@/views/QuickPlayPage';

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
