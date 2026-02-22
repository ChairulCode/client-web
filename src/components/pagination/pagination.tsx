import "./pagination.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
	const getPageNumbers = () => {
		const pages = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 3) {
				pages.push(1, 2, 3, "...", totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
			} else {
				pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
			}
		}
		return pages;
	};

	const handlePageChange = (page: number | string) => {
		if (typeof page === "string") return;
		if (page < 1 || page > totalPages) return;
		onPageChange(page);
	};

	return (
		<div className='pagination-container'>
			{/* Tombol Previous */}
			<button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className='pagination-btn pagination-arrow'>
				<ChevronLeft size={20} />
			</button>

			{/* Render Angka Halaman */}
			{getPageNumbers().map((page, index) => {
				// Tentukan class tambahan secara dinamis
				let btnClass = "pagination-btn";
				if (page === currentPage) btnClass += " active";
				if (page === "...") btnClass += " dots";

				return (
					<button key={index} onClick={() => handlePageChange(page)} disabled={page === "..."} className={btnClass}>
						{page}
					</button>
				);
			})}

			{/* Tombol Next */}
			<button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className='pagination-btn pagination-arrow'>
				<ChevronRight size={20} />
			</button>
		</div>
	);
}
