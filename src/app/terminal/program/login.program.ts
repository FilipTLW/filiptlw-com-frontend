import {Program} from './program';
import {LoginService} from '../../login/login.service';
import {NgTerminal} from 'ng-terminal';
import {TerminalHelper} from '../../utils/terminal';

export class LoginProgram extends Program {
  readonly _loginService = this._programServiceInjector.inject(LoginService);

  public override initialize() {
    const args = this.args.split(' ').filter(arg => arg !== '');
    if (args.length === 1) {
      switch (args[0]) {
        case 'github':
          this._loginService.loginWithGithub().then();
          break;
        default:
          LoginProgram.printHelpMessage(this.terminal);
          break;
      }
    } else {
      LoginProgram.printHelpMessage(this.terminal);
    }
    this.exit();
  }

  override onData(input: string): void {}

  static printHelpMessage(terminal: NgTerminal): void {
    TerminalHelper.println(terminal);
    TerminalHelper.println(terminal, `Syntax: login METHOD`);
    TerminalHelper.println(terminal);
    TerminalHelper.println(terminal, 'Logs you in using provided METHOD.');
    TerminalHelper.println(terminal, 'You will be redirected to the 3rd party SSO provider.');
    TerminalHelper.println(terminal);
    TerminalHelper.println(terminal, 'Available METHODs: github')
    TerminalHelper.println(terminal);
  }

}
