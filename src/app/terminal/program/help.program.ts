import {Program} from './program';
import {TerminalHelper} from '../../utils/terminal';
import {foreColor256, RESET} from '../../utils/color';
import {NgTerminal} from 'ng-terminal';
import {EchoProgram} from './echo.program';
import {EzModeProgram} from './ezmode.program';
import {LoginProgram} from './login.program';
import {ProfileProgram} from './profile.program';
import {LogoutProgram} from './logout.program';

export class HelpProgram extends Program {
  public override initialize(): void {
    if (this.args.trim().length === 0) {
      TerminalHelper.println(this.terminal);
      TerminalHelper.println(this.terminal, `${foreColor256(33)}Available commands:`);
      TerminalHelper.println(this.terminal, `${foreColor256(14)}help      ${RESET}Prints this help message`);
      TerminalHelper.println(this.terminal, `${foreColor256(14)}echo      ${RESET}Echoes back the provided text`);
      TerminalHelper.println(this.terminal, `${foreColor256(14)}ezmode    ${RESET}Enables UI controls for the website`);
      TerminalHelper.println(this.terminal, `${foreColor256(14)}login     ${RESET}Logs you in using your chosen login method`);
      TerminalHelper.println(this.terminal, `${foreColor256(14)}profile   ${RESET}Shows you information about your profile`);
      TerminalHelper.println(this.terminal, `${foreColor256(14)}logout    ${RESET}Logs you out`);
      TerminalHelper.println(this.terminal);
      TerminalHelper.println(this.terminal, `Use help COMMAND to get additional help specific for COMMAND.`)
      TerminalHelper.println(this.terminal);
    } else {
      switch (this.args.trim().split(' ')[0]) {
        case 'help':
        case 'man':
          HelpProgram.printHelpMessage(this.terminal);
          break;
        case 'echo':
          EchoProgram.printHelpMessage(this.terminal);
          break;
        case 'ezmode':
          EzModeProgram.printHelpMessage(this.terminal);
          break;
        case 'login':
          LoginProgram.printHelpMessage(this.terminal);
          break;
        case 'profile':
          ProfileProgram.printHelpMessage(this.terminal);
          break;
        case 'logout':
          LogoutProgram.printHelpMessage(this.terminal);
          break;
      }
    }
    this.exit();
  }

  override onData(_: string): void {}

  static printHelpMessage(terminal: NgTerminal): void {
    TerminalHelper.println(terminal);
    TerminalHelper.println(terminal, `Syntax: help [COMMAND]`);
    TerminalHelper.println(terminal, `Aliases: man`);
    TerminalHelper.println(terminal);
    TerminalHelper.println(terminal, `When no COMMAND is specified, the command returns a list of all available commands.`);
    TerminalHelper.println(terminal, `When a COMMAND is specified, the command returns help specific for COMMAND.`);
    TerminalHelper.println(terminal);
  }

}
