import {FunctionsUsingCSI, NgTerminal} from 'ng-terminal';

export namespace TerminalHelper {
  export function println(terminal: NgTerminal, text: string = ''): void {
    terminal.write(text);
    terminal.write('\n');
    terminal.write(FunctionsUsingCSI.cursorColumn(1));
  }
}
