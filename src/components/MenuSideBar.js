import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './MenuSideBar.css';

function MenuSideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail('');
      }
    });
    // Cleanup the subscription on unmount.
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // After successful sign out, navigate to the login/signup page.
        navigate('/');
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <>
      <div className="hamburger" onClick={() => setIsOpen(true)}>
        ☰
      </div>

      {/* Dimming background */}
      {isOpen && <div className="backdrop" onClick={() => setIsOpen(false)} />}

      {/* Sidebar menu */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <img src="/profile.jpg" alt="Profile" className="profile-pic" />
          <p className="email">{userEmail || "Guest"}</p>
          <ul>
            <li>Privacy</li>
            <li>Security</li>
            <li>Information</li>
            <li className="logout" onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default MenuSideBar;
