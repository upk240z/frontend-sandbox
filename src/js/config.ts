export default class Config {
  private static constants: {[index: string]: any} = {
    'api-base': 'https://api.zaf.jp/'
  }

  private static constantsDevelop: {[index: string]: any} = {
    'api-base': 'http://localhost:3777/'
  }

  public static isProduction(): boolean {
    return !/^localhost/.test(window.location.host)
  }

  public static get(key: string): any {
    const constants = Config.isProduction() ? Config.constants : Config.constantsDevelop
    return constants[key]
  }
}
