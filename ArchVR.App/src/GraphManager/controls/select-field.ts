import { ClassicPreset } from "rete";

export class SelectField extends ClassicPreset.Control {
  constructor(
    public value: string,
    public options: Array<{ text: string; value: string }>,
    public change: (val?: any) => void,
    public placeholder = "Choose an option"
  ) {
    super();
  }

  setValue(value: string) {
    this.value = value;
    this.change(value);
  }
}
