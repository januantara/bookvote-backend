import { bookRepository, BookFilterProps } from '../../repositories/book.repository';
import { getBookInfoByURL } from '../../utils/scraper';
import { type AddBookDataProps } from './book.validation';

export const bookService = {
    getBooks: (params: BookFilterProps) => bookRepository.findAllWithFilters(params),
    getTopBooks: () => bookRepository.findTopBooks(),
    getPurchasedBooks: () => bookRepository.getPurchasedBooks(),
    getBookInfoByURL: (url: string) => getBookInfoByURL(url),
    getBookById: (bookId: number) => bookRepository.findById(bookId),
    getBookByName: (title: string) => bookRepository.findByName(title),
    addBook: (data: AddBookDataProps) => bookRepository.add(data)
};
