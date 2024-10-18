import {Program} from './program';
import {LoginService} from '../../login/login.service';
import {TerminalHelper} from '../../utils/terminal';

export class ProfileProgram extends Program {
  _loginService = this._programServiceInjector.inject(LoginService);

  override async initialize() {
    try {
      const profile = await this._loginService.getProfile();
      TerminalHelper.println(this.terminal);
      TerminalHelper.println(this.terminal, `Username: ${profile.username}`);
      TerminalHelper.println(this.terminal, `ID: ${profile.id}`);
      TerminalHelper.println(this.terminal, `Superuser: ${profile.superuser}`);
      TerminalHelper.println(this.terminal);
    } catch {
      TerminalHelper.println(this.terminal, 'You are not logged in! Please log in using the login command.')
    } finally {
      this.exit();
    }
  }

  override onData(input: string): void {}

}
