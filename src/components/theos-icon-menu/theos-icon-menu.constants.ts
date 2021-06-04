export interface TheosIconMenuConfig {
  menuIconsStyle: any;
  menuIconsSize?: number;
  menuIconsList?: TheosIconMenuButtonsConfig[];
  menuLabelList?: TheosLabelMenuButtonsConfig[];
  menuLabelSize?: number;
  isMenuLabelOnly?: boolean;
  buttonOptionSize: number;
  buttonOptionStyle: any;
  [key: string]: any;
}

export interface TheosIconMenuButtonsConfig {
  iconName: string;
  disable: boolean;
  action: (params: any) => void;
}

export interface TheosLabelMenuButtonsConfig {
  label: string;
  disable: boolean;
  action: (params: any) => void;
}
