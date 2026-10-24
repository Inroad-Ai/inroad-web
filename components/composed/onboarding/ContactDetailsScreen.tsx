"use client";

import { useState } from "react";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { validateLocation, validatePhone } from "@/lib/onboarding-schema";

import { StepFooter } from "./StepFooter";
import { StepHeading } from "./StepHeading";

export function ContactDetailsScreen({
  phone,
  location,
  onChange,
  onNext,
  onBack,
}: {
  phone: string;
  location: string;
  onChange: (phone: string, location: string) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const [touched, setTouched] = useState({ phone: false, location: false });

  const phoneError = touched.phone ? validatePhone(phone) : null;
  const locationError = touched.location ? validateLocation(location) : null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setTouched({ phone: true, location: true });
        if (!validatePhone(phone) && !validateLocation(location)) onNext();
      }}
    >
      <StepHeading title="How can we reach you?" />
      <div className="mt-7 grid gap-5">
        <Field
          label="Phone"
          htmlFor="phone"
          hint="For account recovery only, nobody calls you unprompted."
          error={phoneError}
          errorId="phone-error"
        >
          <Input
            id="phone"
            type="tel"
            autoFocus
            autoComplete="tel"
            value={phone}
            aria-invalid={phoneError ? true : undefined}
            aria-describedby={phoneError ? "phone-error" : undefined}
            onChange={(event) => {
              onChange(event.target.value, location);
              setTouched((prev) => ({ ...prev, phone: true }));
            }}
            placeholder="(555) 123-4567"
          />
        </Field>
        <Field
          label="Location"
          htmlFor="location"
          hint="City and country is enough. It narrows which companies are worth writing to."
          error={locationError}
          errorId="location-error"
        >
          <Input
            id="location"
            autoComplete="address-level2"
            value={location}
            aria-invalid={locationError ? true : undefined}
            aria-describedby={locationError ? "location-error" : undefined}
            onChange={(event) => {
              onChange(phone, event.target.value);
              setTouched((prev) => ({ ...prev, location: true }));
            }}
            placeholder="Berlin, Germany"
          />
        </Field>
      </div>
      <StepFooter onBack={onBack} />
    </form>
  );
}
