import Ajv from "ajv"
import { describe, it, expect } from "vitest"
import supportedPlatforms from "../supported-platforms.json"
import supportedPlatformsSchema from "../supported-platforms.schema.json"

const ajv = new Ajv()
const validate = ajv.compile(supportedPlatformsSchema)
const valid = validate(supportedPlatforms)

describe("supported-platforms.json", () => {
  it("should be a valid JSON schema", () => {
    if (!valid) {
      if (validate.errors) {
        const errorMessages = validate.errors
          .map(error => error.message)
          .join("\n")
        console.error("Validation errors:", errorMessages)
      } else {
        console.error(
          "AJV validation failed, but no error details were provided.",
        )
      }
    }
    expect(valid).toBeTruthy()
  })
})
