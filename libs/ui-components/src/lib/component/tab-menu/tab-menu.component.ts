import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ChangeDetectionStrategy,
  SimpleChanges,
} from '@angular/core';
import { LogService, FormEvent } from '@ocw/ui-core';
import { Router } from '@angular/router';
import { TabMenuItem } from '@ocw/shared-models';

@Component({
  selector: 'ocw-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabMenuComponent implements OnInit, OnChanges {
  @Input() hideLabels = false;
  @Input() showSideHighlight = false;
  @Input() showMenuEvent: FormEvent<boolean>;
  @Input() iconClass = 'primary-grey-back-color';
  @Input() menu: TabMenuItem[];
  @Output() menuItemSelected: EventEmitter<
    FormEvent<number>
  > = new EventEmitter();
  @Output() mouseOver: EventEmitter<FormEvent<boolean>> = new EventEmitter();

  option: number;

  constructor(private logService: LogService, private router: Router) {
    this.logService.log('constituent info construc');
  }

  ngOnInit() {
    if (this.menu) {
      this.option = this.menu[0].type;
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    this.logService.log('tab-menu-component changes', simpleChanges);
    if (this.showMenuEvent) {
      //this.mouseOver.emit(this.showMenuEvent);
    }
  }

  mouseEnter(event: any) {
    //this.logService.log(event);
    //this.mouseOver.emit(new FormEvent(true, null, null));
  }

  mouseLeave(event: any) {
    //this.logService.log(event);
    //this.mouseOver.emit(new FormEvent(false, null, null));
  }

  getClass(adsType: number, active?: boolean): string {
    if (active) {
      return this.iconClass;
    }
    if (adsType !== 0 && !adsType) {
      return 'icon-inactive';
    }
    if (adsType === this.option) {
      return this.iconClass;
    } else {
      return 'icon-inactive';
    }
  }

  getDivClass(adsType: number): string {
    if (adsType !== 0 && !adsType) {
      return 'no-div';
    }
    if (!this.showSideHighlight) {
      return 'no-div';
    }
    if (adsType === this.option) {
      return 'show-div';
    } else {
      return 'hide-div';
    }
  }
  getSmallDivClass(adsType: number, active?: boolean): string {
    if (active) {
      return 'show-small-div';
    }
    if (!adsType) {
      return 'no-div';
    }
    if (!this.showSideHighlight) {
      return 'no-div';
    }
    if (adsType === this.option) {
      return 'show-small-div';
    } else {
      return 'hide-small-div';
    }
  }

  selectOption(selectedOption: number, route?: string) {
    if (route) {
      this.logService.log('route', route);
      this.router.navigate([route]);
    }
    this.option = selectedOption;
    const event = new FormEvent(this.option, null, null);
    this.logService.log('event emitted', selectedOption, event);
    this.menuItemSelected.emit(event);
  }
}
