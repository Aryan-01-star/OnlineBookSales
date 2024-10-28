import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
// import BannerCard from '../Pages/BannerCard.js';
// import { set } from 'mongoose';

function Newarrivals() {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetchRandomBooks();

      const intervalId = setInterval(fetchRandomBooks, 60000); // Fetch new books every 60 seconds

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    const fetchRandomBooks = async () => {
      setIsLoading(true);
      try {
        const randomStartIndex = Math.floor(Math.random() * 100);
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=7&startIndex=${randomStartIndex}`);

        if (!response.ok) {
          throw new Error('HTTP Error! Status: ' + response.status);
        }

        const data = await response.json();
        console.log(data);
        

        if (data.items) {
          
          const formattedBooks = data.items.map(item => ({
            id: item.id,
            bookTitle: item.volumeInfo.title,
            authorName: item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown Author',
            imageURL: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x193.png',
            category: item.volumeInfo.categories ? item.volumeInfo.categories[0] : 'Fiction'
          }));
          setBooks(formattedBooks);
        }
        else {
          setError('No books found');
        }
      }
      catch (error) {
        console.error('Error fetching books: ', error);
        setError('Falied to fetch books');
      }
      finally {
        setIsLoading(false);
      }
    };

    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {books.map((book, index) => (
            <Link to={`/book/${book.id}`}>
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={book.imageURL} alt={book.bookTitle} className="w-full h-48 object-cover" />
                  <div className="p-4 dark:bg-[rgb(30,30,30)] dark:text-white">
                      <h3 className="font-bold text-lg mb-2 truncate dark:text-white">{book.bookTitle}</h3>
                      <p className="text-sm text-gray-600 mb-2 dark:text-gray-400">{book.authorName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{book.category}</p>
                  </div>
              </div>
            </Link>
          ))}
      </div>
  );
}

export default Newarrivals;
