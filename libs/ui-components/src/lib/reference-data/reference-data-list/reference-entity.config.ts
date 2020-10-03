import {
  ReferenceValueAttribute,
  ReferenceItemAttribute,
  BaseDocumentField,
  ColumnDataType,
  ColumnDefinition
} from '@ocw/shared-models';

export const referenceItemColumns: ColumnDefinition[] = [
  {
    cdkColumnDef: `${ReferenceValueAttribute.val}`,
    cdkHeaderCellDef: 'Short Name',
    dataType: ColumnDataType.string,
    fieldName: `${ReferenceValueAttribute.val}`
  },
  {
    cdkColumnDef: `${ReferenceValueAttribute.name}`,
    cdkHeaderCellDef: 'Full Name',
    dataType: ColumnDataType.string,
    fieldName: `${ReferenceValueAttribute.name}`,
    hideAll: true
  },
  {
    cdkColumnDef: `${ReferenceItemAttribute.isActive}`,
    cdkHeaderCellDef: 'Active',
    dataType: ColumnDataType.Boolean,
    fieldName: `${ReferenceItemAttribute.isActive}`
  },
  {
    cdkColumnDef: `${BaseDocumentField.id}`,
    cdkHeaderCellDef: 'Id',
    dataType: ColumnDataType.string,
    fieldName: `${BaseDocumentField.id}`,
    hideAll: true
  },
  {
    cdkColumnDef: `${ReferenceValueAttribute.uid}`,
    cdkHeaderCellDef: 'Uid',
    dataType: ColumnDataType.string,
    fieldName: `${ReferenceValueAttribute.uid}`,
    hideAll: true
  }
];
