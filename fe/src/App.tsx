import { Route, Router } from "@solidjs/router";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LoginFormPage from "./pages/LoginFormPage";
import ForgotPassword from "./pages/ForgotPassword";
import VerificationPage from "./pages/VerificationPage";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import TambahWishlist from "./pages/AddWishlist"
import UpdateWishlist from './pages/UpdateWishlist';
import RiwayatWishlist from './pages/RiwayatWishlist';
import EditProfil from './pages/EditProfile';
import Grafik from "./pages/Grafik";

function App() {
  return (
    <Router>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/login/form" component={LoginFormPage} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/verification" component={VerificationPage} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/tambah-wishlist" component={TambahWishlist} />
      <Route path="/wishlist/update" component={UpdateWishlist} />
      <Route path="/riwayatwishlist" component={RiwayatWishlist} />
      <Route path="/edit-profile" component={EditProfil} />
      <Route path="/grafik" component={Grafik} />
    </Router>
  );
}export default App;