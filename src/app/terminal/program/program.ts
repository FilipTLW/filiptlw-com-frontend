import {NgTerminal} from 'ng-terminal';
import {Subject} from 'rxjs';
import {TerminalService} from '../terminal.service';
import {AppService} from '../../app.service';
import {LoginService} from '../../login/login.service';

export abstract class Program {
  constructor(protected terminal: NgTerminal, protected _exit: Subject<void>, protected _terminalService: TerminalService, protected _appService: AppService, protected _loginService: LoginService, protected args: string = '') {
    this.initialize();
  }

  abstract onData(input: string): void;

  protected initialize(): void {}

  protected exit(): void {
    this._exit.next();
  }

  public kill(): void {}
}
