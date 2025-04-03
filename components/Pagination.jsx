'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Don't render pagination if there's only one page or less
  if (totalPages <= 1) {
    return null
  }

  const handlePrevious = () => {
    setCurrentPage(Math.max(1, currentPage - 1))
  }

  const handleNext = () => {
    setCurrentPage(Math.min(totalPages, currentPage + 1))
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5 // Show at most 5 page numbers
    
    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page
      pageNumbers.push(1)
      
      // Calculate start and end of page numbers to show
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        end = 4
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pageNumbers.push('...')
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pageNumbers.push('...')
      }
      
      // Always include last page
      pageNumbers.push(totalPages)
    }
    
    return pageNumbers
  }

  return (
    <div className="mt-6 flex items-center justify-center">
      <nav className="flex items-center space-x-1">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          variant="outline"
          size="icon"
          className="h-8 w-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous Page</span>
        </Button>
        
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">...</span>
          ) : (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className={`h-8 w-8 ${
                currentPage === page 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'text-indigo-600 border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              {page}
            </Button>
          )
        ))}
        
        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          variant="outline"
          size="icon"
          className="h-8 w-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next Page</span>
        </Button>
      </nav>
    </div>
  )
}
