import {Program} from './program';
import {NgTerminal} from 'ng-terminal';
import {TerminalHelper} from '../../utils/terminal';

export class EzModeProgram extends Program {
  override initialize(): void {
    const args: string[] = this.args.split(' ').filter(arg => arg !== '');
    if (args.length === 0) {
      EzModeProgram.printHelpMessage(this.terminal);
    } else {
      switch (args[0]) {
        case 'enable':
          this._appService.setEzMode(true);
          TerminalHelper.println(this.terminal, 'EZ-Mode enabled.');
          break;
        case 'disable':
          this._appService.setEzMode(false);
          TerminalHelper.println(this.terminal, 'EZ-Mode disabled.');
          break;
        default:
          EzModeProgram.printHelpMessage(this.terminal);
          break;
      }
    }
    this.exit();
  }

  override onData(_: string): void {}

  static printHelpMessage(terminal: NgTerminal): void {
    TerminalHelper.println(terminal);
    TerminalHelper.println(terminal, `Syntax: ezmode { enable | disable }`);
    TerminalHelper.println(terminal);
    TerminalHelper.println(terminal, `Enables UI controls for the website.`);
    TerminalHelper.println(terminal);
  }
}
