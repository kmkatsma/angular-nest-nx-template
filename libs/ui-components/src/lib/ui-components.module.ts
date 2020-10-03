import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpService } from '@ocw/ui-core';
import { NgxMaskModule } from 'ngx-mask';
import { AddressFormService } from './app/address/address-form.service';
import { AddressValidatorComponent } from './app/address/address-validator/address-validator.component';
import { AddressComponent } from './app/address/address.component';
import { CitySelectionComponent } from './app/address/city-selection/city-selection.component';
import { TownshipSelectionComponent } from './app/address/township-selection/township-selection.component';
import { ChangeHistoryComponent } from './app/change-history/change-history.component';
import { ChangeHistoryService } from './app/change-history/change-history.service';
import { AddContactComponent } from './app/contacts/add-contact/add-contact.component';
import { ContactsComponent } from './app/contacts/contacts.component';
import { ContactsService } from './app/contacts/contacts.service';
import { OtherContactEditComponent } from './app/contacts/other-contact-edit/other-contact-edit.component';
import { PartnerEditComponent } from './app/contacts/partner-edit/partner-edit.component';
import { LoadingComponent } from './app/loading/loading.component';
import { LogoutComponent } from './app/logout/logout.component';
import { NotFoundComponent } from './app/not-found/not-found.component';
import { NoteEditComponent } from './app/notes-list/note-edit.component';
import { NotesListComponent } from './app/notes-list/notes-list.component';
import { NotesService } from './app/notes-list/notes.service';
import { ReportListComponent } from './app/report-list/report-list.component';
import { UserAdminService } from './app/user/user-admin.service';
import { UserEditComponent } from './app/user/user-edit/user-edit.component';
import { UserListComponent } from './app/user/user-list/user-list.component';
import { AppNotificationsComponent } from './component/app-notifications/app-notifications.component';
import { AuditFieldsComponent } from './component/audit-fields/audit-fields.component';
import { CardSelectComponent } from './component/card-select/card-select.component';
import { CardTitleComponent } from './component/card-title/card-title.component';
import { ContainerPageComponent } from './component/containers/container-page.component';
import { ContentPageWrapperComponent } from './component/containers/content-page-wrapper.component';
import { DataListComponent } from './component/data-lists/data-list.component';
import { DocumentListComponent } from './component/data-lists/document-list.component';
import { ListControlComponent } from './component/data-lists/list-control.component';
import { DataTableHeaderComponent } from './component/data-tables/data-table-header/data-table-header.component';
import { DataTablePrintService } from './component/data-tables/data-table-print.service';
import { DataTableScrollableComponent } from './component/data-tables/data-table-scrollable.component';
import { DataTableComponent } from './component/data-tables/data-table.component';
import { DataTableService } from './component/data-tables/data-table.service';
import { InputDialogComponent } from './component/dialog/input-dialog.component';
import { MessageBoxComponent } from './component/dialog/message-box.component';
import { MessageBoxService } from './component/dialog/message-box.service';
import { WaitingDialogComponent } from './component/dialog/waiting-dialog.component';
import { ComponentList2Component } from './component/dynamic/component-list-2/component-list-2.component';
import { ComponentListItem2Component } from './component/dynamic/component-list-2/component-list-item-2.component';
import { ComponentListService } from './component/dynamic/component-list-2/component-list.service';
import { ComponentListItemComponent } from './component/dynamic/component-list/component-list-item.component';
import { ComponentListComponent } from './component/dynamic/component-list/component-list.component';
import { FieldListComponent } from './component/dynamic/field-list.component';
import { GenericFormComponent } from './component/dynamic/generic-form.component';
import { TabMenuComponent } from './component/tab-menu/tab-menu.component';
import { AutoCompleteService } from './controls/autocomplete/auto-complete.service';
import { AutocompleteIdComponent } from './controls/autocomplete/autocomplete-id.component';
import { AutocompleteValueComponent } from './controls/autocomplete/autocomplete-value.component';
import { AutoCompleteComponent } from './controls/autocomplete/autocomplete.component';
import { ButtonComponent } from './controls/button/button-component';
import { DateRangePickerComponent } from './controls/date-range-picker/date-range-picker.component';
import { DatepickerComponent } from './controls/datepicker/datepicker.component';
import { DialogActionsComponent } from './controls/dialog-actions/dialog-actions.component';
import { FooterButtonComponent } from './controls/footer-button/footer-button.component';
import { InputFileComponent } from './controls/input-file/input-file.component';
import { LinkedFieldsListComponent } from './controls/linked-fields-list/linked-fields-list.component';
import { MultiSelectNumberComponent } from './controls/multi-select-number/multi-select-number.component';
import { MultiSelectComponent } from './controls/multi-select/multi-select.component';
import { EditNotesComponent } from './controls/note-input/edit-notes/edit-notes.component';
import { NoteInputComponent } from './controls/note-input/note-input.component';
import { SelectFieldComponent } from './controls/select-field/select-field.component';
import { SelectComponent } from './controls/select/select.component';
import { TextFieldComponent } from './controls/text-field/text-field.component';
import { ToolbarTitleComponent } from './controls/toolbar-title/toolbar-title.component';
import { CustomMaterialModule } from './custom-material.module';
import { AttributeEntityEditComponent } from './reference-data/attribute-entity-edit/attribute-entity-edit.component';
import { CustomEntityEditComponent } from './reference-data/custom-entity-edit/custom-entity-edit.component';
import { DataEditComponent } from './reference-data/data-edit/data-edit.component';
import { ReferenceDataListComponent } from './reference-data/reference-data-list/reference-data-list.component';
import { DataMaintenanceContainerComponent } from './reference-data/reference-data-picker/data-maintenance-container.component';
import { DataMaintenanceListComponent } from './reference-data/reference-data-picker/data-maintenance-list.component';
import { ReferenceDataService } from './reference-data/reference-data.service';
import { ReferenceEntityActionsComponent } from './reference-data/reference-entity-actions/reference-entity-actions.component';
import { ReferenceEntityEditBaseComponent } from './reference-data/reference-entity-edit-base/reference-entity-edit-base.component';
import { ReferenceEntityEditComponent } from './reference-data/reference-entity-edit/reference-entity-edit.component';
import { ReferenceYearEditComponent } from './reference-data/reference-year-edit/reference-year-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    FlexLayoutModule,
    RouterModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    MessageBoxComponent,
    NotFoundComponent,
    DataTableComponent,
    ListControlComponent,
    AutoCompleteComponent,
    EditNotesComponent,
    NoteInputComponent,
    InputFileComponent,
    WaitingDialogComponent,
    DataTableHeaderComponent,
    InputDialogComponent,
    NotesListComponent,
    NoteEditComponent,
    TabMenuComponent,
    PartnerEditComponent,
    OtherContactEditComponent,
    AddContactComponent,
    ContactsComponent,
    AddressComponent,
    LinkedFieldsListComponent,
    DatepickerComponent,
    AuditFieldsComponent,
    SelectComponent,
    GenericFormComponent,
    AddressValidatorComponent,
    DataTableScrollableComponent,
    ContentPageWrapperComponent,
    ReportListComponent,
    DataMaintenanceListComponent,
    DateRangePickerComponent,
    CitySelectionComponent,
    TownshipSelectionComponent,
    FooterButtonComponent,
    AutocompleteIdComponent,
    AutocompleteValueComponent,
    CustomEntityEditComponent,
    ReferenceEntityEditBaseComponent,
    MultiSelectComponent,
    AttributeEntityEditComponent,
    MultiSelectNumberComponent,
    ReferenceDataListComponent,
    ReferenceEntityEditComponent,
    CardTitleComponent,
    DialogActionsComponent,
    AppNotificationsComponent,
    ToolbarTitleComponent,
    LogoutComponent,
    LoadingComponent,
    DataMaintenanceContainerComponent,
    ComponentListComponent,
    ComponentListItemComponent,
    ReferenceYearEditComponent,
    ReferenceEntityActionsComponent,
    DataListComponent,
    DataEditComponent,
    TextFieldComponent,
    SelectFieldComponent,
    FieldListComponent,
    ChangeHistoryComponent,
    ComponentList2Component,
    ComponentListItem2Component,
    ContainerPageComponent,
    DocumentListComponent,
    ButtonComponent,
    UserEditComponent,
    UserListComponent,
    CardSelectComponent,
  ],
  exports: [
    MessageBoxComponent,
    NotFoundComponent,
    DataTableComponent,
    ListControlComponent,
    AutoCompleteComponent,
    EditNotesComponent,
    NoteInputComponent,
    InputFileComponent,
    WaitingDialogComponent,
    DataTableHeaderComponent,
    InputDialogComponent,
    NotesListComponent,
    NoteEditComponent,
    TabMenuComponent,
    PartnerEditComponent,
    OtherContactEditComponent,
    AddContactComponent,
    ContactsComponent,
    AddressComponent,
    LinkedFieldsListComponent,
    DatepickerComponent,
    AuditFieldsComponent,
    SelectComponent,
    GenericFormComponent,
    AddressValidatorComponent,
    DataTableScrollableComponent,
    ContentPageWrapperComponent,
    ReportListComponent,
    DataMaintenanceListComponent,
    DateRangePickerComponent,
    CitySelectionComponent,
    TownshipSelectionComponent,
    FooterButtonComponent,
    AutocompleteIdComponent,
    AutocompleteValueComponent,
    CustomEntityEditComponent,
    ReferenceEntityEditBaseComponent,
    MultiSelectComponent,
    AttributeEntityEditComponent,
    MultiSelectNumberComponent,
    ReferenceDataListComponent,
    ReferenceEntityEditComponent,
    CardTitleComponent,
    DialogActionsComponent,
    AppNotificationsComponent,
    ToolbarTitleComponent,
    LogoutComponent,
    LoadingComponent,
    DataMaintenanceContainerComponent,
    ComponentListComponent,
    ComponentListItemComponent,
    ReferenceYearEditComponent,
    ReferenceEntityActionsComponent,
    DataListComponent,
    DataEditComponent,
    TextFieldComponent,
    SelectFieldComponent,
    FieldListComponent,
    ChangeHistoryComponent,
    ComponentList2Component,
    ComponentListItem2Component,
    ContainerPageComponent,
    ButtonComponent,
    UserEditComponent,
    UserListComponent,
    CardSelectComponent,
  ],
  providers: [
    MessageBoxService,
    HttpService,
    AutoCompleteService,
    NotesService,
    ContactsService,
    AddressFormService,
    DataTableService,
    ReferenceDataService,
    DataTablePrintService,
    ChangeHistoryService,
    ComponentListService,
    UserAdminService,
  ],
  entryComponents: [],
})
export class UiComponentsModule {}
