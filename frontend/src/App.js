import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import UserProfilePage from "./pages/auth/UserProfilePage";
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Settings from './pages/Settings';
import About from './pages/About';
import HowToUse from './pages/HowToUse';
import Feature from './pages/Feature';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feature" element={<Feature />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex place-items-center text-white text-2xl bg-gray-900">
              Page not found
            </div>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}
