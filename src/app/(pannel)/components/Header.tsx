'use client';

import React from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import { FiLogOut, FiSettings, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { useRolesStore } from '@/store/rolesStore';

const Header: React.FC = () => {
  const { user, clearUser } = useRolesStore();
  const username = user?.username || 'User'; // ✅ changed from username → name
  const role = user?.role || 'admin';

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      clearUser();
      window.location.reload();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header
      className="bg-dark text-white py-2 border-bottom border-secondary shadow-lg"
      style={{
        position: 'relative',
        top: 0,
        width: '100%',
        zIndex: 1030,
      }}
    >
      <Container fluid className="d-flex align-items-center justify-content-between px-3">
        {/* Left Section */}
        <div className="d-flex align-items-center fw-bold text-uppercase">
          <FiSettings className="me-2 text-warning" size={20} />
          {role} Panel
        </div>

        {/* Right Section */}
        <div className="d-flex align-items-center">
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="outline-light"
              id="dropdown-basic"
              className="d-flex align-items-center"
            >
              <FiUser className="me-2" />
              {username}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                href={`/${role}/profile`}
                className="d-flex align-items-center"
              >
                <FiUser className="me-2 text-primary" /> Profile
              </Dropdown.Item>

              <Dropdown.Item
                as={Link}
                href={`/${role}/settings`}
                className="d-flex align-items-center"
              >
                <FiSettings className="me-2 text-secondary" /> Settings
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item
                onClick={handleLogout}
                className="d-flex align-items-center text-danger"
              >
                <FiLogOut className="me-2" /> Log Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </header>
  );
};

export default Header;
