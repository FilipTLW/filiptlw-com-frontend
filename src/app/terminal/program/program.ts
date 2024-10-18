import {NgTerminal} from 'ng-terminal';
import {Subject} from 'rxjs';
import {ProgramServiceInjector} from './program-service-injector';

export abstract class Program {
  constructor(protected terminal: NgTerminal, protected _exit: Subject<void>, protected _programServiceInjector: ProgramServiceInjector, protected args: string = '') {
  }

  abstract onData(input: string): void;

  public initialize(): void {}

  public onAuthError(): void { }

  protected exit(): void {
    this._exit.next();
  }

  public kill(): void {}
}
