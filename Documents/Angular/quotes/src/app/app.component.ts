import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/observable';
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

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase) {

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
    this.activeBook = book.title.toLowerCase().split(' ').join('-');
    this.book = this.af.list(`/users/${this.userInfo.uid}/${this.activeBook}`);
    this.book.subscribe(data => {
      if (data.length !== 1) {
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
    this.af.list(`/users/${this.userInfo.uid}/${this.activeBook}/quotes/`).push(quoteText);
    this.quoteVal = '';
  }

  addBook(bookTitle: string) {
    const database = firebase.database();
    const id = new Date().getUTCMilliseconds();
    database.ref(`/users/${this.userInfo.uid}/${bookTitle.toLowerCase().split(' ').join('-')}`).set({
      title: bookTitle,
      quotes: []
    })
    this.bookVal = '';
  }
}