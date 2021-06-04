export const ECLESIAL_DEFAULT_MESSAGES = {
  saveSuccess: 'Cadastrado com sucesso.',
  updateSuccess: 'Atualizado com sucesso.',
  deleteSuccess: 'Excluído com sucesso.',
  connectionSuccess: 'Conexão realizada com sucesso.',
  requiredFieldsNotFilled:
    'Existem campos obrigatórios não preenchidos, por favor verifique.',
  invalidFields:
    'Existem campos não preenchidos corretamente, por favor verifique.',
  noPermission: 'Sem permissão',
  expiredPermission:
    'Acesso expirado, será preciso fazer novo login no sistema.',
};

export const ECLESIAL_VALIDATORS_MESSAGES = {
  required: (name: string) => `${name} é obrigatório`,
  minLength: (length: number) =>
    `Digite no mínimo ${length} caractere${length > 1 ? 's' : ''}`,
  maxLength: (length: number) =>
    `Digite no máximo ${length} caractere${length > 1 ? 's' : ''}`,
  dateInvalid: () => `Data inválida`,
};

export const INTERVAL_LIGATURE_TEXT = 'a'

export const THEOS_COMPONENTS_PREFIXES = {
  accountingSelection: 'acct-slctn',
  address: 'addrss',
  ask: 'ask',
  avatar: 'avtr',
  box: 'box',
  button: 'btn',
  calendar: 'cal',
  card: 'cd',
  checkbox: 'ckb',
  contact: 'cntct',
  date: 'dt',
  dateInterval: 'dt-intr',
  dialog: 'dialog',
  field: 'fld',
  fieldInfo: 'fld-info',
  file: 'fl',
  filterGrid: 'fltr-grd',
  filterListTree: 'fltr-lst-tree',
  floatButton: 'flt-btn',
  iconMenu: 'i-mn',
  inactivate: 'inctv',
  input: 'ipt',
  inputImage: 'inpt-img',
  inputSearch: 'srch',
  inputSearchGroup: 'srch-g',
  listView: 'lst-v',
  loader: 'ldr',
  moneyInterval: 'mon-intr',
  notification: 'ntfn',
  number: 'nmb',
  pagination: 'pgntn',
  radio: 'rd',
  searchDialog: 'srch-dialog',
  select: 'slct',
  selectSearch: 'slct-srch',
  sideBar: 'sd-bar',
  switch: 'swtch',
  tabs: 'tb',
  textArea: 'tx-a',
  variables: 'acct-var',
  window: 'wnd',
};