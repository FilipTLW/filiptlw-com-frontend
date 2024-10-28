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
    return `${foreColor256(46)}${username}${RESET}@${foreColor256(46)}${window.location.host} ${RESET}in ${foreColor256(165)}${window.location.pathname} ${RESET}${superuser ? '#' : '$'} `;
  }

  getRawPrefix(): string {
    const {username, superuser} = this._loginService.profile() ?? {username: 'anonymous', superuser: false};
    return `${username}@${window.location.host} in ${window.location.pathname} ${superuser ? '#' : '$'} `;
  }

  getMOTD(): string {
    return `Welcome to ${window.location.host}! Type 'help' to get a list of available commands.`;
  }
}
