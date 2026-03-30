import Ajv from "ajv";
import { describe, it, expect } from "vitest";
import testimonials from "../testimonials.json";
import schema from "../testimonials.schema.json";

const ajv = new Ajv();
const validate = ajv.compile(schema);

describe("testimonials.json", () => {
  it("should match the schema", () => {
    const valid = validate(testimonials);

    if (!valid && validate.errors) {
      const errorMessages = validate.errors
        .map((error) => `${error.instancePath} ${error.message}`)
        .join("\n");
      console.error("Validation errors:\n", errorMessages);
    }

    expect(valid).toBe(true);
  });

  it("should only have type as 'member' or 'sustainer'", () => {
    const invalidTestimonials = testimonials.filter(
      (t) => t.type !== "member" && t.type !== "sustainer"
    );

    if (invalidTestimonials.length > 0) {
      console.error(
        "Invalid type values found in testimonials:",
        invalidTestimonials
      );
    }

    expect(invalidTestimonials.length).toBe(0);
  });
});
