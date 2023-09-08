import React from "react";

const PopupMenu = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className='absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5'>
      <div
        className='py-1'
        role='menu'
        aria-orientation='vertical'
        aria-labelledby='options-menu'
      >
        {children}
      </div>
    </div>
  );
};

export default PopupMenu;
