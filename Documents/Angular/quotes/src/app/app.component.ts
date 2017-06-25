import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/observable';
import { ImageLoaderComponent } from './image-loader/image-loader.component';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  user: Observable<firebase.User>;
  userInfo: any;
  quotes: any = [];
  books: FirebaseListObservable<any[]>;
  book: FirebaseListObservable<any[]>;
  activeBook: string = '';
  bookVal: string = '';
  quoteVal: string = '';
  database;

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase) {

    this.database = firebase.database();
    this.user = this.afAuth.authState;
    this.user.subscribe( data => {
      if (data === null) return;      
      this.userInfo = data;
      this.books = af.list(`/users/${this.userInfo.uid}`, {
        query: {
          limitToLast: 50
        }
      });
    })

  }
  login() {
    this.afAuth.auth.signInAnonymously();
  }

  loginGoogle() {
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
      this.afAuth.auth.signOut();
  }

  goToBookQuotes(book): void {
    this.activeBook = book.title;
    this.book = this.af.list(`/users/${this.userInfo.uid}/${this.activeBook.toLowerCase().split(' ').join('-')}`);
    this.book.subscribe(data => {
      if (data && data.length !== 1) {
        console.log(data);
        this.quotes = [];
        Object.keys(data[0]).forEach( prop => {
          this.quotes.push(data[0][prop])
        })
      } else {
        this.quotes = [];
      }
    })
  }

  addQuote(quoteText: string) {
    this.af.list(`/users/${this.userInfo.uid}/${this.activeBook.toLowerCase().split(' ').join('-')}/quotes/`).push(quoteText);
    this.quoteVal = '';
  }

  addBook(bookTitle: string) {
    const id = new Date().getUTCMilliseconds();
    this.database.ref(`/users/${this.userInfo.uid}/${bookTitle.toLowerCase().split(' ').join('-')}`).set({
      title: bookTitle,
      quotes: []
    })
    this.bookVal = '';
  }

  removeBook(book): void {
    this.database.ref(`/users/${this.userInfo.uid}/${book.$key}`).remove();
  }

  removeQuote(quoteToRemove): void {
    let books = this.af.list(`/users/${this.userInfo.uid}/${this.activeBook.toLowerCase().split(' ').join('-')}/quotes`);
    books.subscribe( data => 
      data.filter( (quote, i) => {
        quote.$value === quoteToRemove ? this.af.list(`/users/${this.userInfo.uid}/${this.activeBook.toLowerCase().split(' ').join('-')}/quotes/${data[i].$key}`).remove() : -1;
      })
    )
  }
}