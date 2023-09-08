import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import PopupMenu from "./PopupMenu";

const UserMenu = ({ user, isOpen }) => {
  return (
    <PopupMenu isOpen={isOpen}>
      <div className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'>
        {user.username}
      </div>
      <div className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'>
        {user.firstname} {user.lastname}
      </div>
      <div className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'>
        {user.administrator && "Administrator"}
      </div>
      <button className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'>
        Logout
      </button>
    </PopupMenu>
  );
};

const NotificationsMenu = ({ notifications, isOpen }) => {
  return (
    <PopupMenu isOpen={isOpen}>
      <ul>
        {notifications.forEach((notification, key) => (
          <li
            key={key}
            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          >
            {notification.message}
          </li>
        ))}
      </ul>
    </PopupMenu>
  );
};

function getFirstSubpathCapitalized(url) {
  // Split the URL by '/' and filter out any empty strings
  const parts = url.split("/").filter(Boolean);

  // If there's no subpath, return 'Monitor'
  if (parts.length === 0) {
    return "Monitor";
  }

  // Take the first subpath
  const firstSubpath = parts[0];

  // Capitalize the first letter and return
  return (
    firstSubpath.charAt(0).toUpperCase() + firstSubpath.slice(1).toLowerCase()
  );
}

const Topbar = ({ user }) => {
  const appName = getFirstSubpathCapitalized(useLocation().pathname);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsMenuOpen, setNotificationsMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
  };

  const userMenuRef = useRef(null);
  const notificationsMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (
        notificationsMenuRef.current &&
        !notificationsMenuRef.current.contains(event.target)
      ) {
        setNotificationsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentTime = new Date().toLocaleTimeString();
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className='relative'>
      <div className='bg-gray-200 dark:bg-gray-800 p-4 flex justify-between items-center'>
        <div className='flex items-center'>
          <button onClick={toggleSidebar} className='mr-4'>
            ☰
          </button>
          <p className='mr-2 font-bold'>{appName}</p>
        </div>
        <div className='flex items-center'>
          <span className='mr-2'>
            {currentDate} {currentTime}
          </span>
          <button onClick={toggleDarkMode} className='mr-2'>
            🌙
          </button>
          <div className='relative' ref={notificationsMenuRef}>
            <button
              onClick={() => setNotificationsMenuOpen(!notificationsMenuOpen)}
              className='mr-2'
            >
              🔔
            </button>
            <NotificationsMenu
              isOpen={notificationsMenuOpen}
              notifications={[
                { message: "Fire!", level: 3 },
                { message: "Abnormal temperature.", level: 2 },
              ]}
            />
          </div>

          <div className='relative' ref={userMenuRef}>
            <button onClick={() => setUserMenuOpen(!userMenuOpen)}>👤</button>
            <UserMenu isOpen={userMenuOpen} user={user} />
          </div>
        </div>
      </div>

      <div
        className={`fixed top-15 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out h-screen w-64 bg-gray-300 dark:bg-gray-700 shadow-md`}
      >
        <ul>
          <li className='mb-2'>
            <a href='/'>Monitor</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Topbar;
