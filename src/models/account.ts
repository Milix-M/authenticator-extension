export class Account {
  constructor(
    public secret: string,
    public type: "totp" | "hotp",
    public label: string,
    public counter?: number,
    public issuer?: string
  ) {}


}
