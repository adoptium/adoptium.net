import React from "react";

interface ClientPaginationProps {
    currentPage: number;
    totalPages: number;
    onNavigate: (page: number) => void;
}

const ClientPagination: React.FC<ClientPaginationProps> = ({ currentPage, totalPages, onNavigate }) => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);
        let start = Math.max(2, currentPage - 2);
        let end = Math.min(totalPages - 1, currentPage + 2);
        if (currentPage <= 3) {
            start = 2;
            end = 5;
        }
        if (currentPage >= totalPages - 2) {
            start = totalPages - 4;
            end = totalPages - 1;
        }
        if (start > 2) pages.push("...");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
    }
    return (
        <div className="flex justify-center items-center gap-8 md:gap-14 my-8">
            <button
                disabled={currentPage === 1}
                onClick={() => onNavigate(currentPage - 1)}
                className="flex items-center gap-3 px-3 py-2 rounded disabled:opacity-50"
            >
                Previous
            </button>
            <div className="flex items-center gap-5">
                <div className="flex items-center justify-between gap-6 border border-[#3E3355] rounded-[80px] px-6 py-3">
                    {pages.map((page, idx) =>
                        page === "..." ? (
                            <span key={idx} className="tab-button-text mb-0">...</span>
                        ) : (
                            <button
                                key={idx}
                                onClick={() => onNavigate(page as number)}
                                className={`tab-button-text mb-0 px-2 ${page === currentPage ? "font-bold text-pink" : ""}`}
                                disabled={page === currentPage}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>
            </div>
            <button
                disabled={currentPage === totalPages}
                onClick={() => onNavigate(currentPage + 1)}
                className="flex items-center gap-3 px-3 py-2 rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default ClientPagination;
