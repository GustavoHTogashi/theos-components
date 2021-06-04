import {
	TheosSelectOption,
	TheosSelectSearchComponent
} from './theos-select-search.component';

describe('TheosSelectSearchComponent', () => {
//   let component: TheosSelectSearchComponent;
//   let fixture: ComponentFixture<TheosSelectSearchComponent>;

//   const ICONS = {
//     X,
//     ChevronDown,
//     Search,
//   };

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [TheosSelectSearchComponent],
//       providers: [FormBuilder],
//       imports: [
//         BrowserAnimationsModule,
//         CommonModule,
//         ReactiveFormsModule,
//         FeatherModule.pick(ICONS),
//         MatMenuModule,
//         MatTooltipModule,
//         MatInputModule,
//         DirectivesModule,
//       ],
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(TheosSelectSearchComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('Deve criar o componente', () => {
//     expect(component).toBeTruthy();
//   });

//   it('Deve adicionar opcoes no componente', () => {
//     adicionarMock(component);
//     expect(component.options).toHaveLength(mock.length);
//   });

//   it('Deve conter no formControl o valor da opcao "Cachorro" selecionada', () => {
//     adicionarMock(component);
//     let formBuilder = TestBed.inject(FormBuilder);
//     let fg = formBuilder.group({
//       control: null,
//     });
//     const C = fg.get('control') as FormControl;
//     const CACHORRO = mock.find((m) => m.label === 'Cachorro');
//     component.control = C;
//     component.selectOption(CACHORRO);
//     expect(component.control.value).toEqual(CACHORRO.value);
//   });

//   it('Deve selecionar todas as opcoes do menu ao clicar em "selecionar todas"', () => {
//     adicionarMock(component);
//     component.multiSelect = true;
//     component.selectAll();
//     const MOCK_VALUES = mock.map((m) => m.value);
//     expect(component.control.value).toEqual(MOCK_VALUES);
//   });

//   it('Deve ser do tipo multiSelecao e ter várias opções selecionadas', () => {
//     adicionarMock(component);
//     let formBuilder = TestBed.inject(FormBuilder);
//     let fg = formBuilder.group({
//       control: null,
//     });
//     const C = fg.get('control') as FormControl;
//     component.control = C;
//     component.multiSelect = true;
//     const [MOCK1, MOCK2, MOCK3] = mock.filter((m) =>
//         [1, 3, 5].includes(m.value)
//       ),
//       RESULT = [MOCK1.value, MOCK2.value, MOCK3.value];
//     component.selectOption(MOCK1);
//     component.selectOption(MOCK2);
//     component.selectOption(MOCK3);
//     fixture.detectChanges();
//     expect(component.control.value).toEqual(RESULT);
//   });
});

var adicionarMock = (component: TheosSelectSearchComponent) => {
  component.options = mock;
};

var mock: Array<TheosSelectOption> = [
  { value: 1, label: 'Gato' },
  { value: 2, label: 'Cachorro' },
  { value: 3, label: 'Rato' },
  { value: 4, label: 'Cobra' },
  { value: 5, label: 'Tamanduá' },
];
