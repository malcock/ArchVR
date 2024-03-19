export class Vector {
  private values: number[];

  constructor(...values: number[]) {
    this.values = values;
  }

  get dimension(): number {
    return this.values.length;
  }

  // Scalar multiplication
  scalarMultiply(scalar: number): Vector {
    const newValues = this.values.map((value) => value * scalar);
    return new Vector(...newValues);
  }

  // Vector addition
  add(other: Vector): Vector {
    if (this.dimension !== other.dimension) {
      throw new Error("Vectors must have the same dimension for addition.");
    }
    const newValues = this.values.map(
      (value, index) => value + other.values[index]
    );
    return new Vector(...newValues);
  }

  // Vector subtraction
  subtract(other: Vector): Vector {
    if (this.dimension !== other.dimension) {
      throw new Error("Vectors must have the same dimension for subtraction.");
    }
    const newValues = this.values.map(
      (value, index) => value - other.values[index]
    );
    return new Vector(...newValues);
  }

  // Vector multiply
  multiply(other: Vector): Vector {
    if (this.dimension !== other.dimension) {
      throw new Error("Vectors must have the same dimension for multiply.");
    }
    const newValues = this.values.map(
      (value, index) => value * other.values[index]
    );
    return new Vector(...newValues);
  }

  // Vector addition
  divide(other: Vector): Vector {
    if (this.dimension !== other.dimension) {
      throw new Error("Vectors must have the same dimension for divide.");
    }
    const newValues = this.values.map(
      (value, index) => value / other.values[index]
    );
    return new Vector(...newValues);
  }

  // Dot product
  dotProduct(other: Vector): number {
    if (this.dimension !== other.dimension) {
      throw new Error("Vectors must have the same dimension for dot product.");
    }
    return this.values.reduce(
      (result, value, index) => result + value * other.values[index],
      0
    );
  }

  // Cross product (for 2D and 3D vectors)
  crossProduct(other: Vector): Vector {
    if (this.dimension !== 3 || other.dimension !== 3) {
      throw new Error("Cross product is only defined for 3D vectors.");
    }
    const [x1, y1, z1] = this.values;
    const [x2, y2, z2] = other.values;
    const newX = y1 * z2 - z1 * y2;
    const newY = z1 * x2 - x1 * z2;
    const newZ = x1 * y2 - y1 * x2;
    return new Vector(newX, newY, newZ);
  }

  // Negate the vector
  negate(): Vector {
    const newValues = this.values.map((value) => -value);
    return new Vector(...newValues);
  }

  // Calculate the length (magnitude) of the vector
  length(): number {
    return Math.sqrt(
      this.values.reduce((sum, value) => sum + value * value, 0)
    );
  }

  // Normalize the vector (convert it to a unit vector)
  normalize(): Vector {
    const len = this.length();
    if (len === 0) {
      throw new Error("Cannot normalize a zero-length vector.");
    }
    const newValues = this.values.map((value) => value / len);
    return new Vector(...newValues);
  }

  toString(): string {
    return `[${this.values.join(", ")}]`;
  }

  toArray(): number[] {
    return this.values;
  }
}
