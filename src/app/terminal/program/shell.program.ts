import {Program} from './program';

export class ShellProgram extends Program {
  override initialize(): void {
    this.terminal.write(this._terminalService.getPrefixNL());
  }

  override onData(input: string): void {
    switch (input) {
      case '\r':
        // TODO execute command
        this.terminal.write(this._terminalService.getPrefixNL());
        break;
      case '\u007f':
        if (this.terminal.underlying!.buffer.active.cursorX > this._terminalService.getRawPrefix().length) {
          this.terminal.write('\b \b')
        }
        break;
      default:
        this.terminal.write(input);
        break;
    }
  }

  override exit(): void {}

}
