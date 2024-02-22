export interface HierarchyItem {
  id: string | undefined;
  name: string | undefined;
  graphId: string | undefined;
  ifcType: string | undefined;
  objectType: string | undefined;
  selected?: boolean;
  children: HierarchyItem[];
}
