import { Book } from "../features/book/bookSlice";

const FAVOURITES_KEY = "favouriteBooks";

export function getFavourites(): Book[] {
  const data = localStorage.getItem(FAVOURITES_KEY);
  return data ? JSON.parse(data) : [];
}

export function addFavourite(book: Book) {
  const favs = getFavourites();
  if (!favs.find((b) => b.key === book.key)) {
    favs.push(book);
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favs));
  }
}

export function removeFavourite(bookKey: string) {
  const favs = getFavourites().filter((b) => b.key !== bookKey);
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favs));
}

export function isFavourite(bookKey: string): boolean {
  return getFavourites().some((b) => b.key === bookKey);
} 