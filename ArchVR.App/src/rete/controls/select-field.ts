import { ClassicPreset } from "rete";

export class SelectField extends ClassicPreset.Control {
  constructor(
    public value: string,
    public options: Array<{ text: string; value: string }>,
    public change: (val?: any) => void
  ) {
    super();
  }

  setValue(value: string) {
    this.value = value;
    this.change(value);
  }
}
