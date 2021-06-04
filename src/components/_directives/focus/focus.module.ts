import { TheosCustomFocusDirective } from "./focus.directive";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@NgModule({
	declarations: [
		TheosCustomFocusDirective,
	],
	imports: [
		CommonModule,
	],
	exports: [
		TheosCustomFocusDirective
	],
})
export class FocusDirectiveModule { }
