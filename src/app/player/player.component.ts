import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { categories } from '../channels';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  @ViewChild('player', null) _player: ElementRef;

  _disabledVolume: boolean = true;
  _disabledPlay: boolean = true;
  _disabledStop: boolean = true;

  _currentChamel: string = "";
  _clickedPlay: boolean = false;
  _volume: number = 0.5;

  channels = categories;

  constructor() { }

  ngOnInit() { 


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
    this._clickedPlay = false;
    this._player.nativeElement.pause();
    this._player.nativeElement.currentTime = 0;
  }


  onChange(event) {
    this._volume = event.value;
    this._player.nativeElement.volume = event.value;
  }

}
