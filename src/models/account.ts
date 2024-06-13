import { Totp } from "../totp";

export class Account {
  constructor(
    public accountUUID: string,
    public secret: string,
    public type: string,
    public label: string,
    public addedAt: number,
    public timeStep: number = 30,
    public counter?: number,
    public issuer?: string,
  ) {}

  /**
   * 二段階認証コードをこのアカウントのsecret, type, counterに基づき生成します
   * @returns 二段階認証コード
   */
  public genTwoFaCode = (): string => {
    let code = "";

    if (this.type === "totp") {
      const totp = new Totp(6, this.timeStep);
      const key = totp.decodeB32Code(this.secret);
      code = totp.totp(key, new Date());
    } else if (this.type === "hotp") {
      const hotp = new Totp(6, this.timeStep);
      const key = hotp.decodeB32Code(this.secret);

      // counterが入ってなければデフォルトで0いれる
      let generatorCounter = 0;

      // 入ってればfgeneratorCounterにいれる
      if (this.counter !== undefined) {
        generatorCounter = this.counter;
      }

      code = hotp.hotp(key, generatorCounter);
    }

    return code;
  };
}
