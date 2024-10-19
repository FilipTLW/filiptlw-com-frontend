import {Program} from './program';
import {LoginService} from '../../login/login.service';
import {TerminalHelper} from '../../utils/terminal';
import {NgTerminal} from 'ng-terminal';

export class ProfileProgram extends Program {
  _loginService = this._programServiceInjector.inject(LoginService);

  override async initialize() {
    const profile = this._loginService.profile();
    if (profile !== null) {
      TerminalHelper.println(this.terminal);
      TerminalHelper.println(this.terminal, `Username: ${profile.username}`);
      TerminalHelper.println(this.terminal, `ID: ${profile.id}`);
      TerminalHelper.println(this.terminal, `Superuser: ${profile.superuser}`);
      TerminalHelper.println(this.terminal);
    } else {
      TerminalHelper.println(this.terminal, 'You are not logged in! Please log in using the login command.')
    }
    this.exit();
  }

  override onData(input: string): void {}

  static printHelpMessage(terminal: NgTerminal): void {
    TerminalHelper.println(terminal);
    TerminalHelper.println(terminal, 'Syntax: profile');
    TerminalHelper.println(terminal);
    TerminalHelper.println(terminal, 'Shows information about your profile.');
    TerminalHelper.println(terminal);
  }

}
