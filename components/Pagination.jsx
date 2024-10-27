import { Button } from "@/components/ui/button"

export default function Pagination({ currentPage, setCurrentPage, totalItems, itemsPerPage }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="mt-4 flex justify-center gap-2">
      <Button 
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
        disabled={currentPage === 1}
        className="rounded-full"
      >
        Previous
      </Button>
      <span className="flex items-center">Page {currentPage} of {totalPages}</span>
      <Button 
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
        disabled={currentPage === totalPages}
        className="rounded-full"
      >
        Next
      </Button>
    </div>
  );
}