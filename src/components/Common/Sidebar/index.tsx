import React from "react";
import { BsXLg } from "react-icons/bs";

interface SidebarProps {
  onClose: () => void;
  header: string;
  children: React.ReactNode;
}
const Sidebar: React.FC<SidebarProps> = ({ header, children, onClose }) => {
  return (
    <div className="z-[100] fixed top-0 right-0 w-full max-w-[480px] bg-[#0e002a]/95 backdrop-blur-xl p-8 h-screen shadow-2xl border-l border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {header}
        </h2>
        <button
          type="button"
          className="group p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
          onClick={onClose}
        >
          <span className="sr-only">Close menu</span>
          <BsXLg className="text-xl text-gray-400 group-hover:text-white transition-colors" />
        </button>
      </div>
      {children}
    </div>
  );
};

export default Sidebar;
