import { Buffer } from "buffer";
import crypto from 'crypto';

/**
 * TOTP, HOTPの計算を行います
 */
export class Totp {
  private readonly _DIGIT: number = 6;
  private readonly _TIME_STEP: number = 30;
  private readonly _BASE32TABLE:{ [key: string]: number } = {
    'A': 0, 'J': 9, 'S': 18, '3': 27,
    'B': 1, 'K': 10, 'T': 19, '4': 28,
    'C': 2, 'L': 11, 'U': 20, '5': 29,
    'D': 3, 'M': 12, 'V': 21, '6': 30,
    'E': 4, 'N': 13, 'W': 22, '7': 31,
    'F': 5, 'O': 14, 'X': 23,
    'G': 6, 'P': 15, 'Y': 24,
    'H': 7, 'Q': 16, 'Z': 25,
    'I': 8, 'R': 17, '2': 26,
  };

  constructor(DIGIT: number, TIME_STEP: number) {
    this._DIGIT = DIGIT;
    this._TIME_STEP = TIME_STEP;
  }

  /**
   * TOTPの値を計算します
   * @param key 共有されたシークレット
   * @param date Unix Time
   *
   * @returns 6桁のTOTPの値
   */
  public totp(key: Buffer, date: Date): string {
    const cnt = Math.floor(date.getTime() / 1000 / this._TIME_STEP);

    return this.hotp(key, cnt);
  }

  public hotp(key: Buffer, cnt: number): string {
    const buf = Buffer.alloc(8);
    buf.writeUInt32BE(Math.floor(cnt / 2 ** 32), 0);
    buf.writeUInt32BE(cnt, 4);

    const val = this.truncate(this.hmacsha1(key, buf));
    // 桁数足りなかったら0で埋める
    return val.toString().padStart(this._DIGIT, '0')
  }

  /**
   * 20byteのバイナリ文字列を10桁未満のnumber型の数値に変換します
   * @param data 20byteのバイナリ文字列
   *
   * @returns 10桁未満のnumber型の数値
   */
  private truncate(data: Buffer): number {
    const offset = data[data.length - 1] & 0x0f;

    const code = data.readUInt32BE(offset) & 0x7fffffff;

    return code % 10 ** this._DIGIT;
  }

  /**
   * HMAC-SHA-1の値を計算する
   * @param key シークレット
   * @param message  ストリームデータ
   * @returns 20byteのバイナリ文字列
   */
  private hmacsha1(key: Buffer, message: Buffer): Buffer {
    const hmac = crypto.createHmac("sha1", key);
    hmac.update(message);
    return hmac.digest();
  }

  /**
   * Base32文字列をBufferに変換します
   * @param str
   * @returns 
   */
  public decodeB32Code(str: string): Buffer {
    str = str.toUpperCase().replace(/[^A-Z234567]/g, "");
    str = str.padEnd(Math.ceil(str.length / 8) * 8, "A");

    const data = Array.from(str).map((value) => this._BASE32TABLE[value]);
    const buf = Buffer.alloc((data.length / 8) * 5);
    for (let i = 0, j = 0; i < data.length; i += 8, j += 5) {
      buf[j] = (data[i + 0] << 3) | (data[i + 1] >> 2);
      let tmp = 0;
      for (let shift = 30, k = 1; shift >= 0; shift -= 5, k++) {
        tmp |= data[i + k] << shift;
      }
      buf.writeUInt32BE(tmp >>> 0, j + 1);
    }

    return buf;
  }
}
