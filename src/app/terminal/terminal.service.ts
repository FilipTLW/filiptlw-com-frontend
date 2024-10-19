import { Injectable } from '@angular/core';
import {foreColor256, RESET} from '../utils/color';
import {LoginService} from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {
  constructor(private _loginService: LoginService) { }

  getPrefix(): string {
    const {username, superuser} = this._loginService.profile() ?? {username: 'anonymous', superuser: false};
    return `${foreColor256(46)}${username}${RESET}@${foreColor256(46)}filiptlw.com \x1b[0min ${foreColor256(165)}/ \x1b[0m${superuser ? '#' : '$'} `;
  }

  getRawPrefix(): string {
    const {username, superuser} = this._loginService.profile() ?? {username: 'anonymous', superuser: false};
    return `${username}@filiptlw.com in / ${superuser ? '#' : '$'} `;
  }

  getMOTD(): string {
    return `Welcome to filiptlw.com! Type 'help' to get a list of available commands.`;
  }
}
