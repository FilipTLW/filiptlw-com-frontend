import { Injectable } from '@angular/core';
import {foreColor256, RESET} from '../utils/color';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  constructor() { }

  getPrefix(): string {
    return `${foreColor256(46)}anonymous${RESET}@${foreColor256(46)}filiptlw.com \x1b[0min ${foreColor256(165)}/ \x1b[0m$ `;
  }

  getRawPrefix(): string {
    return `anonymous@filiptlw.com in / $ `;
  }

  getMOTD(): string {
    return `Welcome to filiptlw.com! Type 'help' to get a list of available commands.`;
  }
}
