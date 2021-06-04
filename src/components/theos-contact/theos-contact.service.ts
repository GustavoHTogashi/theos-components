import { Injectable } from '@angular/core';
import { TIPO_CONTATO } from './theos-contact.constants';
@Injectable()
export class TheosContactService {
  private readonly _PHONE_HOME_ID = 1;
  private readonly _PHONE_WORK_ID = 2;
  private readonly _CELLPHONE_ID = 3;
  private readonly _EMAIL_ID = 5;
  defaultLabelValueIds = [
    this._CELLPHONE_ID,
    this._PHONE_HOME_ID,
    this._PHONE_WORK_ID,
    this._EMAIL_ID,
  ];
  NO_CONTACT_TEXT = 'Nenhum contato selecionado';
  contactType = TIPO_CONTATO;
  mask(tel) {
    return tel.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  }
  contactLabel(contacts) {
    const VALUE = contacts;
    if (VALUE) {
      const PRINCIPAL_SELECIONADO = VALUE.filter(
        (data) =>
          this.defaultLabelValueIds.includes(data.contatoTipoId) &&
          data.ehPrincipal
      );
      const PRINCIPAL_NAO_SELECIONADO = VALUE.find((data) => data.ehPrincipal);
      const PRINCIPAL =
        PRINCIPAL_SELECIONADO.length > 0
          ? PRINCIPAL_SELECIONADO
          : PRINCIPAL_NAO_SELECIONADO;
      if (PRINCIPAL) {
        if (Array.isArray(PRINCIPAL)) {
          const CONTATOS = PRINCIPAL.map((p) => {
            const CONTATO = this.contactType.find(
              (tipo) => tipo.value === p.contatoTipoId
            );

            return {
              contato:
                CONTATO.mask !== ''
                  ? this.mask(p.contato.descricao)
                  : p.contato.descricao,
              tipoContato: p.contatoTipoId,
            };
          });

          const STRING = CONTATOS.reduce((prev, cur) => {
            prev.push(
              [
                cur.contato,
                this.contactType.find((tipo) => tipo.value === cur.tipoContato)
                  ?.label || null,
              ]
                .filter((a) => a)
                .join(' - ')
            );
            return prev;
          }, []).join('; ');
          return { label: STRING, isEmpty: false };
        } else {
          const {
            contato: { descricao: CONTATO },
            contatoTipoId: TIPO_CONTATO,
          } = PRINCIPAL;
          const { mask: MASK } = this.contactType.find(
            (tipo) => tipo.value === TIPO_CONTATO
          );
          const STRING = [
            MASK !== '' ? this.mask(CONTATO) : CONTATO,
            this.contactType.find((tipo) => tipo.value === TIPO_CONTATO)
              ?.label || null,
          ]
            .filter((a) => a)
            .join(' - ');
          return { label: STRING, isEmpty: false };
        }
      }
    }
    return { label: this.NO_CONTACT_TEXT, isEmpty: true };
  }

  firstDefault(value) {
    if (!value) return null;
    const PRINCIPAL_SELECIONADO = value.filter(
      (data) =>
        this.defaultLabelValueIds.includes(data.contatoTipoId) &&
        data.ehPrincipal
    );
    const PRINCIPAL_NAO_SELECIONADO = value.find((data) => data.ehPrincipal);
    const PRINCIPAL =
      PRINCIPAL_SELECIONADO.length > 0
        ? PRINCIPAL_SELECIONADO
        : PRINCIPAL_NAO_SELECIONADO;
    if (Array.isArray(PRINCIPAL)) return PRINCIPAL[0];
    return PRINCIPAL;
  }
}
