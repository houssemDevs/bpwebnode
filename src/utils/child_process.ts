import cp from 'child_process';
import { isObject } from 'util';

interface IEnv {
  [s: string]: string;
}

/**
 * Utiliy class help to fork nodejs worker, fire and forget style.
 *
 * @export
 */
export default class PromiseChildProcess {
  private script_file: string;
  private env: IEnv;
  private timeout: number;

  /**
   * Creates an instance of PromiseChildProcess.
   * @param {string} file script file to run in the worker process.
   * @param {IEnv} env envirnment variables to pass to the worker process.
   * @param {number} [timeout=1000 * 60] total milliseconds to wait before rejecting the return value promise.
   */
  constructor(file: string, env: IEnv, timeout: number = 1000 * 60) {
    this.script_file = file;
    this.env = env;
    this.timeout = timeout;
  }

  /**
   * fork the worker process and return a promise that resolve once the
   *  child process return a value using process.send(val). if the timeouts reach
   *  its limits and the worker does return nothing the promise is rejected.
   *
   * @returns {Promise<any>}
   */
  public run(): Promise<any> {
    return new Promise((res, rej) => {
      const worker = cp.fork(this.script_file, [], { env: this.env });
      const t = setTimeout(() => {
        worker.kill();
        rej(new Error('worker is taking too long.'));
      }, this.timeout);
      worker.on('message', msg => {
        clearTimeout(t);
        res(msg);
      });
    });
  }
}
