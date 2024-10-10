import { Injectable } from '@angular/core';
import {FunctionsUsingCSI} from 'ng-terminal';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  constructor() { }

  getPrefix(): string {
    return `${FunctionsUsingCSI.cursorColumn(1)}\x1b[0;92mroot\x1b[0m@\x1b[0;92mfiliptlw.com \x1b[0min \x1b[0;95m/ \x1b[0m$ `;
  }

  getPrefixNL(): string {
    return `\n${this.getPrefix()}`;
  }

  getRawPrefix(): string {
    return `root@filiptlw.com in / $ `;
  }

  getMOTD(): string {
    return `Welcome to filiptlw.com! Type 'help' to get a list of available commands.`;
  }
}
