import {Program} from './program';
import {LoginService} from '../../login/login.service';
import {TerminalHelper} from '../../utils/terminal';
import {NgTerminal} from 'ng-terminal';

export class LogoutProgram extends Program {
  private _loginService = this._programServiceInjector.inject(LoginService);

  override async initialize() {
    try {
      await this._loginService.logout();
      TerminalHelper.println(this.terminal, 'Logged out successfully.');
    } catch {
      TerminalHelper.println(this.terminal, 'You are currently not logged in.');
    }
    this.exit();
  }

  override onData(input: string): void {
  }

  static printHelpMessage(terminal: NgTerminal): void {
    TerminalHelper.println(terminal);
    TerminalHelper.println(terminal, 'Syntax: logout')
    TerminalHelper.println(terminal);
    TerminalHelper.println(terminal, 'Logs you out')
    TerminalHelper.println(terminal);
  }

}
