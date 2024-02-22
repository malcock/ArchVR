export interface IfcMeta {
  id: string;
  Name: string;
  ifcType: string;
  ObjectType: string;
  attr: Attr;
  Tag: string;
  IfcFurnitureType?: IfcFurnitureType[];
  IfcElementQuantity?: IfcElementQuantity[];
  IfcPropertySet?: IfcPropertySet[];
  IfcPresentationLayerAssignment?: IfcPresentationLayerAssignment[];
  IfcMaterialLayerSetUsage?: IfcMaterialLayerSetUsage[];
  IfcDoorStyle?: IfcDoorStyle[];
  IfcWindowStyle?: IfcWindowStyle[];
  IfcWallType?: IfcAbstractType[];
  IfcPlateType?: IfcAbstractType[];
  IfcCurtainWallType?: IfcAbstractType[];
  IfcBuildingElementProxyType?: IfcAbstractType[];
  IfcColumnType?: IfcAbstractType[];
  IfcDuctSegmentType?: IfcAbstractType[];
  [key: string]: IfcAbstractType[] | any;
}

export interface IfcMaterialLayerSetUsage {
  LayerSetName: string;
  LayerSetDirection: string;
  DirectionSense: string;
  OffsetFromReferenceLine: number;
  IfcMaterialLayer: IfcMaterialLayer[];
  id: string;
}

export interface IfcMaterialLayer {
  Name: string;
  LayerThickness: number;
}

export interface IfcPresentationLayerAssignment {
  Name: string;
  id: string;
}

export interface IfcPropertySet {
  Name: string;
  IfcPropertySingleValue: IfcPropertySingleValue[];
  id: string;
}

export interface IfcPropertySingleValue {
  Name: string;
  NominalValue?:
    | boolean
    | boolean
    | number
    | number
    | string
    | string
    | string
    | string;
}

export interface IfcQuantityArea {
  Name: string;
  Description: string;
  AreaValue: number;
}
export interface IfcQuantityLength {
  Name: string;
  Description: string;
  LengthValue: number;
}
export interface IfcQuantityVolume {
  Name: string;
  Description: string;
  VolumeValue: number;
}

export interface IfcElementQuantity {
  Name: string;
  Description: string;
  MethodOfMeasurement: string;
  IfcQuantityArea?: IfcQuantityArea[];
  IfcQuantityLength?: IfcQuantityLength[];
  IfcQuantityVolume?: IfcQuantityVolume[];
  id: string;
}

export interface IfcDoorStyle {
  Name: string;
  OperationType: string;
  ConstructionType: string;
  ParameterTakesPrecedence: boolean;
  Sizeable: boolean;
  id: string;
}
export interface IfcFurnitureType {
  Name: string;
  ElementType: string;
  AssemblyPlace: string;
  id: string;
}

export interface IfcWindowStyle {
  Name: string;
  ConstructionType: string;
  OperationType: string;
  ParameterTakesPrecedence: boolean;
  Sizeable: boolean;
  id: string;
}

export interface IfcAbstractType {
  Name: string;
  PredefinedType: string;
  ElementType?: string;
  ApplicableOccurrence?: string;
  id: string;
}

export interface Attr {
  Description?: any;
  ObjectPlacement: string;
  LongName?: string;
  CompositionType?: string;
  InteriorOrExteriorSpace?: string;
  OverallHeight?: number;
  OverallWidth?: number;
}
