'use client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import StartPage from '@/views/StartPage';
import HomePage from '@/views/HomePage';
import CustomSetupPage from '@/views/CustomSetupPage';
import CustomGamePage from '@/views/CustomGamePage';
import QuickPlayPage from '@/views/QuickPlayPage';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

export default function RouterApp() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <AuthProvider>
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
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}
