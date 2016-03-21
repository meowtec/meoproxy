declare module "ip" {
  export function address(): string;
}


declare var QRCode: QRCodeConstructor;

interface QRCodeConstructor {
  new (element, text);
}

declare module "qrcode" {
  export = QRCode;
}
