import cp from 'child_process';
import { isObject } from 'util';

interface IEnv {
  [s: string]: string;
}

export default class PromiseChildProcess {
  private script_file: string;
  private env: IEnv;
  private timeout: number;
  constructor(file: string, env: IEnv, timeout: number = 1000 * 60) {
    this.script_file = file;
    this.env = env;
    this.timeout = timeout;
  }
  public run(): Promise<any> {
    return new Promise((res, rej) => {
      const t = setTimeout(() => rej(), this.timeout);
      const worker = cp.fork(this.script_file, [], { env: this.env });
      worker.on('message', msg => {
        clearTimeout(t);
        res(msg);
      });
    });
  }
}
