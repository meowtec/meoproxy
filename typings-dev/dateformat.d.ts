declare function __dateFormatStatic(template: string): string;

declare module "dateformat" {
  export default __dateFormatStatic;
}
