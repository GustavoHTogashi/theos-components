export interface TheosAgButtons {
  id: string;
  icon: string;
  style: { [klass: string]: string };
  methodName: string;
  disabled?: boolean;
  tooltip?: { message: string; class: string };
}
