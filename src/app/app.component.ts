import { Component, isDevMode } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  template: '<app-player></app-player>',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'webradio';
  constructor(
    private snackBar: MatSnackBar,
    private swUpdate: SwUpdate,
    private swPush: SwPush) {
 
    if (!isDevMode())
      this.setupUpdates();
    //this.setupPush();

  }

  setupUpdates() {
    this.swUpdate.available.subscribe(u => {
      // Update wurde entdeckt

      // Update herunterladen
      this.swUpdate.activateUpdate().then(e => {
        // Update wurde heruntergeladen

        const message = 'Webradio neue Version';
        const action = 'Ok, Laden!';

        // Benutzer auf Update hinweisen und Seite neu laden
        this.snackBar.open(message, action).onAction().subscribe(
          () => location.reload()
        );
      });
    });

    // Auf Updates prüfen
    this.swUpdate.checkForUpdate();
  }

  setupPush() {

    const key = 'BBc7Bb5f5...';

    this.swPush.requestSubscription({
      serverPublicKey: key
    })
      .then(sub => {
        console.debug('Push Subscription', JSON.stringify(sub));
      },
        err => {
          console.error('error registering for push', err);
        });
  }

}
