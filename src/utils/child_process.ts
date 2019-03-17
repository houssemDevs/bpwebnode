import cp from 'child_process';
import { isObject } from 'util';

export default class PromiseChildProcess {
  private script_file: string;
  private id: string;
  constructor(file: string, id: string) {
    this.script_file = file;
    this.id = id;
  }
  public run(): Promise<any> {
    return new Promise((res, rej) => {
      const worker = cp.fork(this.script_file, [], { env: { id: this.id } });
      worker.on('message', msg => {
        console.log(`Recived msg : ${msg}`);
        if (!isObject(msg)) {
          res(msg);
        }
      });
    });
  }
}
