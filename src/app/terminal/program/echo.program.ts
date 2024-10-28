import {Program} from './program';
import {TerminalHelper} from '../../utils/terminal';
import {NgTerminal} from 'ng-terminal';

export class EchoProgram extends Program {
  public override initialize(): void {
    TerminalHelper.println(this.terminal, this.args.split(' ').filter(arg => arg !== '').join(' '));
    this.exit();
  }

  override onData(_: string): void {console.log(_)}

  static printHelpMessage(terminal: NgTerminal): void {
    TerminalHelper.println(terminal);
    TerminalHelper.println(terminal, `Syntax: echo [arg ...]`);
    TerminalHelper.println(terminal);
    TerminalHelper.println(terminal, `Write arguments to the terminal.`);
    TerminalHelper.println(terminal, `Display the args, separated by a single space character and followed by a newline, on the terminal.`);
    TerminalHelper.println(terminal);
  }

}
