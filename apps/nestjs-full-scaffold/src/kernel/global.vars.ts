export class GlobalVars {
  static appName: string;
  static osHostName: string;
  static processId: string;

  static pjf: unknown;

  static getForLogger(): object {
    return {"hostname": GlobalVars.osHostName, "pid": GlobalVars.processId}
  }
}
