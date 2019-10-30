import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { categories } from '../channels';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  @ViewChild('player', null) _player: ElementRef;

  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Methods": "POST,GET,DELETE,PUT",
      'Vary': 'Origin'
    })
  };

  _disabledVolume: boolean = true;
  _disabledPlay: boolean = true;
  _disabledStop: boolean = true;

  _currentChamel: string = "";
  _clickedPlay: boolean = false;
  _volume: number = 0.8;

  _interval = null;
  _intervalStep: number = null;
  _intervalTemp: string = null;

  channels = categories;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // this.channels.forEach(category => {
    //   // console.log(category);
    //   category.channels.forEach(channel => {
    //     this.http.head(channel.url, this.httpOptions).subscribe(succ => console.log('succ', succ), error => console.log('error', error));
    //     //console.log(channel);
    //   });
    // });
    this._player.nativeElement.volume = this._volume;
  }

  onSelect(cannel) {
    this._disabledVolume = false;
    this._disabledStop = false;
    this._disabledPlay = false;
    this._player.nativeElement.src = cannel.url;
    this._clickedPlay = true;
    this._currentChamel = cannel.name;
    document.title = "webradio - " + cannel.name;
    this.animateTitle();
  }

  animateTitle() {
    this._intervalTemp = document.title;
    this._intervalStep = 0;
    this._interval = setInterval(() => {
      if ((this._intervalStep + 1) >= this._intervalTemp.length)
        this._intervalStep = 0;
      document.title = this._intervalTemp.substring(this._intervalStep);
      document.title += " " + this._intervalTemp.replace(document.title, '');
      this._intervalStep++;
    }, 500)
  }

  setPlay() {
    this._clickedPlay = !this._clickedPlay;
    if (this._clickedPlay) {
      this._player.nativeElement.play();
    } else {
      this._player.nativeElement.pause();
    }
  }

  setStop() {
    clearInterval(this._interval);
    document.title = this._intervalTemp;
    this._clickedPlay = false;
    this._player.nativeElement.pause();
    this._player.nativeElement.currentTime = 0;
  }

  onChange(event) {
    this._volume = event.value;
    this._player.nativeElement.volume = event.value;
  }

}
