export class Account {
  constructor(
    // 認証情報を識別するためのid
    // uuidを使いたい
    public dbId: number,

    public secret: string,
    public type: "totp" | "hotp",
    public label: string,
    public counter?: number,
    public issuer?: string
  ) {}


}
