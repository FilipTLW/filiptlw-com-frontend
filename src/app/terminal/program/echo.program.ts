import {Program} from './program';
import {FunctionsUsingCSI} from 'ng-terminal';

export class EchoProgram extends Program {
  protected override initialize(): void {
    this.terminal.write(this.args);
    this.terminal.write('\n');
    this.terminal.write(FunctionsUsingCSI.cursorColumn(1));
    this.exit();
  }

  override async onData(_: string): Promise<void> {}

}
