import React from "react"
import { BsXLg } from "react-icons/bs"

interface SidebarProps {
    onClose: () => void
    header: string
    children: React.ReactNode
}
const Sidebar: React.FC<SidebarProps> = ({ header, children, onClose }) => {
    return (
        <div className="z-[100] fixed top-0 right-0 w-full max-w-[480px] bg-[#0e002a] p-6 pt-8 h-screen rounded-s-3xl">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{header}</h1>
                <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-white-700"
                    onClick={onClose}
                >
                    <span className="sr-only">Close menu</span>
                    <div className="border-2 border-[#3e3355] p-3 rounded-full">
                        <BsXLg className="text-xl" />
                    </div>
                </button>
            </div>
            {children}
        </div>
    )
}

export default Sidebar
