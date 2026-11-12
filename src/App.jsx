import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import LandingPage from './pages/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FeaturesPage from './pages/FeaturesPage';
import CommunityImpactPage from './pages/CommunityImpactPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AccessibilityPage from './pages/AccessibilityPage';

// Onboarding Pages (100dvh full viewport)
import CitizenOnboarding from './pages/CitizenOnboarding';
import AuthorityOnboarding from './pages/AuthorityOnboarding';

// Citizen Dashboard & Layout
import CitizenDashboardLayout from './layouts/CitizenDashboardLayout';
import CitizenOverviewPage from './pages/citizen/CitizenOverviewPage';
import CitizenReportsPage from './pages/citizen/CitizenReportsPage';
import CitizenReportIssuePage from './pages/citizen/CitizenReportIssuePage';
import CitizenNearbyPage from './pages/citizen/CitizenNearbyPage';
import CitizenNotificationsPage from './pages/citizen/CitizenNotificationsPage';
import CitizenProfilePage from './pages/citizen/CitizenProfilePage';
import CitizenHelpPage from './pages/citizen/CitizenHelpPage';

// Authority Dashboard & Layout
import AuthorityDashboardLayout from './layouts/AuthorityDashboardLayout';
import AuthorityOverviewPage from './pages/authority/AuthorityOverviewPage';
import AuthorityIssuesPage from './pages/authority/AuthorityIssuesPage';
import AuthorityMapPage from './pages/authority/AuthorityMapPage';
import AuthorityAssignmentsPage from './pages/authority/AuthorityAssignmentsPage';
import AuthorityAnalyticsPage from './pages/authority/AuthorityAnalyticsPage';
import AuthoritySettingsPage from './pages/authority/AuthoritySettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Core Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Content Pages */}
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/community-impact" element={<CommunityImpactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Authentication Pages (100dvh zero-scroll) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Dedicated Role-Based Onboarding (100dvh zero-scroll) */}
        <Route path="/onboarding/citizen" element={<CitizenOnboarding />} />
        <Route path="/onboarding/authority" element={<AuthorityOnboarding />} />

        {/* Citizen Portal Dashboard Routes */}
        <Route path="/dashboard" element={<CitizenDashboardLayout />}>
          <Route index element={<CitizenOverviewPage />} />
          <Route path="reports" element={<CitizenReportsPage />} />
          <Route path="report-issue" element={<CitizenReportIssuePage />} />
          <Route path="nearby" element={<CitizenNearbyPage />} />
          <Route path="notifications" element={<CitizenNotificationsPage />} />
          <Route path="profile" element={<CitizenProfilePage />} />
          <Route path="help" element={<CitizenHelpPage />} />
        </Route>

        {/* Civic Authority Dashboard Routes */}
        <Route path="/authority" element={<Navigate to="/authority/dashboard" replace />} />
        <Route path="/authority" element={<AuthorityDashboardLayout />}>
          <Route path="dashboard" element={<AuthorityOverviewPage />} />
          <Route path="issues" element={<AuthorityIssuesPage />} />
          <Route path="map" element={<AuthorityMapPage />} />
          <Route path="assignments" element={<AuthorityAssignmentsPage />} />
          <Route path="analytics" element={<AuthorityAnalyticsPage />} />
          <Route path="settings" element={<AuthoritySettingsPage />} />
        </Route>

        {/* Informational & Legal Pages */}
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />

        {/* Fallback to Home */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
