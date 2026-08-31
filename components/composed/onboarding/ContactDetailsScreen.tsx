"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateLocation, validatePhone } from "@/lib/onboarding-schema";

export function ContactDetailsScreen({
  phone,
  location,
  onChange,
  onNext,
}: {
  phone: string;
  location: string;
  onChange: (phone: string, location: string) => void;
  onNext: () => void;
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
      <h1 className="font-display text-2xl text-text-primary">How can we reach you?</h1>
      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="phone" className="utility-label text-text-secondary">
            Phone
          </label>
          <p className="mt-1 text-sm text-text-secondary">
            For account recovery only, nobody calls you unprompted.
          </p>
          <Input
            id="phone"
            type="tel"
            autoFocus
            value={phone}
            onChange={(event) => {
              onChange(event.target.value, location);
              setTouched((prev) => ({ ...prev, phone: true }));
            }}
            placeholder="(555) 123-4567"
            className="mt-2"
          />
          {phoneError ? <p className="mt-2 text-sm text-error">{phoneError}</p> : null}
        </div>
        <div>
          <label htmlFor="location" className="utility-label text-text-secondary">
            Location
          </label>
          <p className="mt-1 text-sm text-text-secondary">
            City and country is enough. It narrows which companies are worth writing to.
          </p>
          <Input
            id="location"
            value={location}
            onChange={(event) => {
              onChange(phone, event.target.value);
              setTouched((prev) => ({ ...prev, location: true }));
            }}
            placeholder="Berlin, Germany"
            className="mt-2"
          />
          {locationError ? <p className="mt-2 text-sm text-error">{locationError}</p> : null}
        </div>
      </div>
      <Button type="submit" className="mt-8">
        Continue
      </Button>
    </form>
  );
}
