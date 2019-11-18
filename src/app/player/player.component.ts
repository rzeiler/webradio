import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { categories } from '../channels';
import { MatSelectionList, MatSelectionListChange, MatListOption } from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';
import LocalStorageDB from 'local-storage-db';
import { Channel } from '../models/channel';
import { Tab } from '../models/tab';
import { Settings } from '../models/settings';
import { Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  @ViewChild('player', null) _player: ElementRef;
  @ViewChild('tabGroup', null) tabGroup;

  _showGithub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  _disabledVolume: boolean = true;
  _disabledPlay: boolean = true;
  _disabledStop: boolean = true;

  _currentChannel: Channel = new Channel();

  _currentChannelDisplay: string = "";
  _clickedPlay: boolean = false;
  _volume: number = 0.8;

  _interval = null;
  _intervalStep: number = null;
  _intervalTemp: string = null;

  _MatSelectionList: MatSelectionList = null;
  _MatListOption: MatListOption = null;

  data: Tab[];
  settings: Settings;

  constructor(breakpointObserver: BreakpointObserver, public meta: Meta) {
    breakpointObserver.observe([
      Breakpoints.Web,
      Breakpoints.TabletLandscape
    ]).subscribe(result => {
      this._showGithub.next(result.matches);
    });
  }

  handleSelection(event: MatSelectionListChange) {
    this._MatSelectionList = event.source;
    this._MatListOption = event.option;

    if (this._MatListOption.selected) {
      this.setStop();
      this._MatSelectionList.deselectAll();
      this._MatListOption._setSelected(true);
      this.onSelect(event.option.value);
    } else {
      this.setStop();
    }
  }

  getLocation(href:string) {
    var l = document.createElement("a");
    l.href = href;
    return l;
  };

  ngOnInit() {
    /* open db */
    const db = new LocalStorageDB('webradio');
    /* is set */
    let _categories = db.get('categories');
    let _settings = db.get('settings');

    if (_settings === undefined) {
      db.create('settings', { tab: 0, volume: 0.7 });
    }

    if (_categories === undefined) {
      db.create('categories', categories as Tab[]);
    }
    /* get */
    this.data = db.get('categories') as Tab[];
    this.settings = db.get('settings') as Settings
    /* set default value */
    this._volume = this.settings.volume;
    this.tabGroup.selectedIndex = this.settings.tab;

    this._player.nativeElement.volume = this._volume;
  }

  onSelect(cannel) {
    clearInterval(this._interval);
    this._disabledVolume = false;
    this._disabledStop = false;
    this._disabledPlay = false;
    this._player.nativeElement.src = cannel.url;
    this._clickedPlay = true;
    this._currentChannel = cannel;
    document.title = "webradio - " + cannel.name;
    this.animateTitle();

     
  
    /* set local db */
    let currentTabIndex: number = 0;
    this.data.forEach((tab: Tab, i: number) => {
      tab.channels.forEach((_cannel: Channel) => {
        if (_cannel.name == cannel.name) {
          currentTabIndex = i;
          if (_cannel.clicked === null)
            _cannel.clicked = 0;
          _cannel.clicked++;
        }
      });
    });
    this.settings.tab = currentTabIndex;
    /* open and update db */
    const db = new LocalStorageDB('webradio');
    db.update(this.data, 'categories');
    db.update(this.settings, 'settings');
  }

  animateTitle() {
    const self = this;
    let text = `${self._currentChannel.name} - ${self._currentChannel.location} - ${self._currentChannel.city} - `;
    self._currentChannelDisplay = text;
    let _displTemp = text;
    let _displStep = 0;
    this._intervalTemp = document.title;
    this._intervalStep = 0;
    this._interval = setInterval(() => {
      if ((this._intervalStep + 1) >= this._intervalTemp.length)
        this._intervalStep = 0;
      document.title = this._intervalTemp.substring(this._intervalStep);
      document.title += " " + this._intervalTemp.replace(document.title, '');
      this._intervalStep++;
      if ((_displStep + 1) >= _displTemp.length)
        _displStep = 0;
      self._currentChannelDisplay = text.substring(_displStep);
      self._currentChannelDisplay += text.replace(self._currentChannelDisplay, '');
      _displStep++;
    }, 300)
  }

  setPlay() {
    if (this._MatListOption != null)
      this._MatListOption._setSelected(true);

    this._clickedPlay = !this._clickedPlay;
    if (this._clickedPlay) {
      this._player.nativeElement.play();
    } else {
      this._player.nativeElement.pause();
    }
  }

  setStop() {
    if (this._MatSelectionList != null)
      this._MatSelectionList.deselectAll();

    clearInterval(this._interval);
    document.title = "webradio";
    this._currentChannelDisplay = "";
    this._clickedPlay = false;
    this._player.nativeElement.pause();
    this._player.nativeElement.currentTime = 0;

  }

  onChange(event) {
    this._volume = event.value;
    this._player.nativeElement.volume = event.value;
    /* open and update db */
    this.settings.volume = this._volume;
    const db = new LocalStorageDB('webradio');
    db.update(this.settings, 'settings');
  }

}
