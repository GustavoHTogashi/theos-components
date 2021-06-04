export enum TIPO_CONTATO_ENUM {
  TELEFONE_RESIDENCIAL = 1,
  TELEFONE_COMERCIAL = 2,
  CELULAR = 3,
  FAX = 4,
  EMAIL = 5,
  SITE = 6,
  WHATSAPP = 7,
  SKYPE = 8,
  TELEGRAM = 9,
  VIBER = 10,
  ICQ = 11,
  YAHOO_MESSENGER = 12,
  FACEBOOK = 13,
  TWITTER = 14,
  GOOGLE_PLUS = 15,
  LINKEDIN = 17,
  ORKUT = 17,
  FLICKR = 18,
  INSTAGRAM = 19,
  YOUTUBE = 20,
}

export const TIPO_CONTATO = [
  {
    value: TIPO_CONTATO_ENUM.TELEFONE_RESIDENCIAL,
    label: 'Telefone Residencial',
    mask: '(00) 00000-0000||(00) 0000-0000',
  },
  {
    value: TIPO_CONTATO_ENUM.TELEFONE_COMERCIAL,
    label: 'Telefone Comercial',
    mask: '(00) 00000-0000||(00) 0000-0000',
  },
  {
    value: TIPO_CONTATO_ENUM.CELULAR,
    label: 'Celular',
    mask: '(00) 00000-0000||(00) 0000-0000',
  },
  {
    value: TIPO_CONTATO_ENUM.FAX,
    label: 'Fax',
    mask: '(00) 00000-0000||(00) 0000-0000',
  },
  {
    value: TIPO_CONTATO_ENUM.EMAIL,
    label: 'E-Mail',
    mask: '',
  },
  {
    value: TIPO_CONTATO_ENUM.SITE,
    label: 'Site',
    mask: '',
  },
  {
    value: TIPO_CONTATO_ENUM.WHATSAPP,
    label: 'WhatsApp',
    mask: '(00) 00000-0000||(00) 0000-0000',
  },
  {
    value: TIPO_CONTATO_ENUM.SKYPE,
    label: 'Skype',
    mask: '(00) 00000-0000||(00) 0000-0000',
  },
  {
    value: TIPO_CONTATO_ENUM.TELEGRAM,
    label: 'Telegram',
    mask: '(00) 00000-0000||(00) 0000-0000',
  },
  {
    value: TIPO_CONTATO_ENUM.VIBER,
    label: 'Viber',
    mask: '(00) 00000-0000||(00) 0000-0000',
  },
  {
    value: TIPO_CONTATO_ENUM.ICQ,
    label: 'ICQ',
    mask: '',
  },
  {
    value: TIPO_CONTATO_ENUM.YAHOO_MESSENGER,
    label: 'Yahoo Messenger',
    mask: '',
  },
  {
    value: TIPO_CONTATO_ENUM.FACEBOOK,
    label: 'Facebook',
    mask: '',
  },
  {
    value: TIPO_CONTATO_ENUM.TWITTER,
    label: 'Twitter',
    mask: '',
  },
  {
    value: TIPO_CONTATO_ENUM.GOOGLE_PLUS,
    label: 'Google+',
    mask: '',
  },
  {
    value: TIPO_CONTATO_ENUM.LINKEDIN,
    label: 'LinkedIn',
    mask: '',
  },
  {
    value: TIPO_CONTATO_ENUM.ORKUT,
    label: 'E-Orkut',
    mask: '',
  },
  {
    value: TIPO_CONTATO_ENUM.FLICKR,
    label: 'Flickr',
    mask: '',
  },
  {
    value: TIPO_CONTATO_ENUM.INSTAGRAM,
    label: 'Instagram',
    mask: '',
  },
  {
    value: TIPO_CONTATO_ENUM.YOUTUBE,
    label: 'YouTube',
    mask: '',
  },
];
