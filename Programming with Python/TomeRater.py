# Type Checking PEP 484 and PEP 526 Annotation Syntax
# https://github.com/python/typing
import re
import operator
from typing import Union, Dict, List, Hashable

class User(object):
    """
    User Class defines name, email and books
    """
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email
        self.books = {}

    def __repr__(self):
        return 'user: {}, email: {}, books read: {}, average rating: {:.2f}'.format(self.name, self.email, str(len(self.books)), self.rating)

    def __eq__(self, other_user: 'User') -> bool:
        return self.name == other_user.name and self.email == other_user.email

    def get_email(self):
        return self.email

    def change_email(self, address: str):
        self.email = address
        print('User email was changed to: {}'.format(self.email))

    def get_average_rating(self) -> float:
        ratings = [rating for rating in self.books.values() if rating]
        if ratings:
            return float(sum(ratings) / len(ratings))

    def read_book(self, book: 'Book', rating: Union[int, float] = None):
        self.books[book] = rating
        self.rating = self.get_average_rating()
        self.count = len(self.books)
        self.total_price = sum(book.price for book in self.books)

class Book(object):
    """
    Book class defines title, isbn and ratings
    """
    def __init__(self, title: str, isbn: int, price: float):
        self.title = title
        self.isbn = isbn
        self.price = price
        self.ratings = []

    def __eq__(self, other_book: 'Book') -> bool:
        return self.title == other_book.title and self.isbn == other_book.isbn

    def __repr__(self) -> str:
        return '{} with ISBN {} has an average rating of {:.2f}'.format(self.title, self.isbn, self.average_rating)

    def __hash__(self) -> Hashable:
        return hash((self.title, self.isbn))

    def get_title(self) -> str:
        return self.title

    def get_isbn(self) -> int:
        return self.isbn

    def get_price(self) -> float:
        return self.price

    def set_isbn(self, isbn: int):
        self.isbn = isbn
        print('{} ISBN is now set to {}'.format(self.title, self.isbn))

    def set_price(self, price: float) -> float:
        self.price = price
              
    def add_rating(self, rating: Union[int, float] = None):
        if rating and rating > 0 and rating <=4:
            self.ratings.append(float(rating))
            self.average_rating = self.get_average_rating()
            print('A rating of {:.2f} was added to {} with a total of {} ratings and an average rating of {:.2f}'.format(rating, self.title, str(len(self.ratings)), self.average_rating))
        else:
            print('Invalid Rating')
    
    def get_average_rating(self) -> float:
        if self.ratings:
            return float(sum(self.ratings) / len(self.ratings))
        return 0

class Fiction(Book):
    """
    Fiction class extends Book class and defines author
    """
    def __init__(self, title: str, author: str, isbn: int, price: float):
        Book.__init__(self, title, isbn, price)
        self.author = author

    def __repr__(self) -> str:
        return '{} by {} with ISBN {} has an average rating of {:.2f}'.format(self.title, self.author, self.isbn, self.average_rating)

    def get_author(self) -> str:
        return self.author

class Non_Fiction(Book):
    """
    Non-Fiction class extends Book class and defines subject and level
    """
    def __init__(self, title: str, subject: str, level: str, isbn: int, price: float):
        Book.__init__(self, title, isbn, price)
        self.subject = subject
        self.level = level
    
    def __repr__(self) -> str:
        return '{}, a {} manual on {} with ISBN {} has an average rating of {:.2f}'.format(self.title, self.level, self.subject, self.isbn, self.average_rating)

    def get_subject(self) -> str:
        return self.subject
    
    def get_level(self) -> str:
        return self.level

class TomeRater(object):
    """
    The TomeRater ... just now realized this is a pun on Tomb Raider. Nice.
    """
    def __init__(self):
        self.users = {}
        self.books = {}
        self.library = {}

    def __repr__(self) -> str:
        return 'TomeRater has {} users and {} books'.format(len(self.users), len(self.books))
    
    def __eq__(self, other_tomerater: 'TomeRater') -> bool:
        return self.users == other_tomerater.users and self.books == other_tomerater.books

    def add_user(self, name: str, email: str, user_books: Dict['Book', Union[int, float]] = None):
        if not email in self.users and self.validate_email(email):
            new_user = User(name, email)
            self.users[email] = new_user
            if user_books:
                for book in user_books:
                    self.add_book_to_user(book, email)
        else:
            print('You entered an invalid email {email}!'.format(email=email))

    def validate_email(self, email: str) -> bool:
        return re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email)

    def create_book(self, title: str, isbn: int, price: float = 0.00) -> 'Book':
        if isbn not in self.library:  
            new_book = Book(title, isbn, price)
            self.library[isbn] = new_book
            print('Add {} with ISBN {} to TomeRater'.format(title, isbn))
            return new_book
        else:
            print('{} not added, a book with ISBN {} already exists!'.format(title, isbn))
            return None

    def create_novel(self, title: str, author: str, isbn: int, price: float = 0.00) -> 'Fiction':
        if isbn not in self.library:  
            new_novel = Fiction(title, author, isbn, price)
            self.library[isbn] = new_novel
            print('Add {} with ISBN {} to TomeRater'.format(title, isbn))
            return new_novel
        else:
            print('{} not added, a book with ISBN {} already exists!'.format(title, isbn))
            return None
    
    def create_non_fiction(self, title: str, subject: str, level: str, isbn: int, price: float = 0.00) -> 'Non_Fiction':
        if isbn not in self.library:
            new_non_fiction = Non_Fiction(title, subject, level, isbn, price)
            self.library[isbn] = new_non_fiction
            print('Add {} with ISBN {} to TomeRater'.format(title, isbn))
            return new_non_fiction
        else:
            print('{} not added, a book with ISBN {} already exists!'.format(title, isbn))
            return None

    def add_book_to_user(self, book: 'Book', email: str, rating: Union[int, float] = None):
        user = self.users.get(email)
        if book:
            try:
                user.read_book(book, rating)
                if book not in self.books:
                    self.books[book] = 0
                self.books[book] += 1
                book.add_rating(rating)
            except ValueError:
                print('No user with email {}'.format(email))

    def get_most_read_book(self) -> List['Books']:
        if self.books:
            # return list(k for k, v in self.books.items() if v == max(self.books.values()))
            max_read = max(self.books.values()) # edited to prevent iterating each loop for performance improvement
            return list(k for k, v in self.books.items() if v == max_read)
        return None

    def highest_rated_book(self) -> List['Books']:
        if self.books:
            # return list(k for k in self.books.keys() if k.average_rating == max(k.average_rating for k in self.books.keys()))
            max_rating = max(k.average_rating for k in self.books.keys()) # edited to prevent iterating each loop for performance improvement
            return list(k for k in self.books.keys() if k.average_rating == max_rating)
        return None

    def most_positive_user(self) -> List['User']:
        if self.users:
            # return list(v for v in self.users.values() if v.rating == max(v.rating for v in self.users.values()))
            max_user = max(v.rating for v in self.users.values()) # edited to prevent iterating each loop for performance improvement
            return list(v for v in self.users.values() if v.rating == max_user)
        return None

    def print_catalog(self):
        for book in self.books:
            print(book)

    def print_users(self):
        for user in self.users.values():
            print(user)

    def get_user_average_rating(self, email: str) -> float: 
        user = self.users.get(email)
        if user:
            return user.average_user_rating
        print('No user with email {}'.format(email)) # edited as this should probably return float not a str
        return None 

    def get_n_most_read_books(self, n) -> List['Book']:
        if n >= 0 and n <= len(self.books): # edited to check that n is valid
            return sorted(self.books, key=self.books.get, reverse=True)[:n]
        return None

    def get_n_most_prolific_readers(self, n) -> List['User']:
        if n >= 0 and n <= len(self.users): # edited to check that n is valid
            return sorted(self.users.values(), key=operator.attrgetter('count'), reverse=True)[:n]

    def get_n_most_expensive_books(self, n) -> List['Book']:
        if n >= 0 and n <= len(self.books): # edited to check that n is valid
            return sorted(self.books.keys(), key=operator.attrgetter('price'), reverse=True)[:n]
        return None

    def get_worth_of_user(self, user_email) -> float:
        if self.validate_email(user_email): # edited to check e-mail is at least valid
            return self.users[user_email].total_price
        print('{} is an invalid email, please try your query again.'.format(user_email))
        return None