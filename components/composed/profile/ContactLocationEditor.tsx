"use client";

import { useId } from "react";

import { allCountries, type CountryData } from "country-region-data";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const phoneCountries = new Set<string>(getCountries());
const countriesByNameLength = [...allCountries].sort(
  ([left], [right]) => right.length - left.length,
);

interface ParsedLocation {
  address: string;
  country: CountryData | null;
  region: string;
}

function parseLocation(value: string): ParsedLocation {
  const location = value.trim();
  const country =
    countriesByNameLength.find(([name]) => location === name || location.endsWith(`, ${name}`)) ??
    null;

  if (!country) return { address: location, country: null, region: "" };

  const remainder = location === country[0] ? "" : location.slice(0, -(country[0].length + 2));
  const region = country[2].find(([name]) => remainder === name || remainder.endsWith(`, ${name}`));

  if (!region) return { address: remainder, country, region: "" };

  const address = remainder === region[0] ? "" : remainder.slice(0, -(region[0].length + 2));
  return { address, country, region: region[0] };
}

function composeLocation(address: string, region: string, country: string): string {
  return [address.trim(), region, country].filter(Boolean).join(", ");
}

function callingCodeFor(countryCode: string): string {
  if (!phoneCountries.has(countryCode)) return "";
  return getCountryCallingCode(countryCode as CountryCode);
}

function nationalNumber(phone: string, countryCode: string): string {
  const parsed = parsePhoneNumberFromString(
    phone,
    phoneCountries.has(countryCode) ? (countryCode as CountryCode) : undefined,
  );
  if (parsed) return parsed.nationalNumber;

  const callingCode = callingCodeFor(countryCode);
  const withoutPrefix = callingCode
    ? phone.replace(new RegExp(`^\\+${callingCode}\\s*`), "")
    : phone;
  return withoutPrefix.trim();
}

export function ContactLocationEditor({
  location,
  phone,
  phoneError,
  locationError,
  onLocationChange,
  onPhoneChange,
}: {
  location: string;
  phone: string;
  phoneError?: string | null;
  locationError?: string | null;
  onLocationChange: (location: string) => void;
  onPhoneChange: (phone: string) => void;
}) {
  const idPrefix = useId();
  const countryId = `${idPrefix}-country`;
  const regionId = `${idPrefix}-region`;
  const addressId = `${idPrefix}-address`;
  const phoneId = `${idPrefix}-phone`;
  const parsedLocation = parseLocation(location);
  const countryCode = parsedLocation.country?.[1] ?? "";
  const callingCode = callingCodeFor(countryCode);
  const regions = parsedLocation.country?.[2] ?? [];
  const phoneValue = countryCode ? nationalNumber(phone, countryCode) : phone;

  function changeCountry(nextCode: string) {
    const nextCountry = allCountries.find(([, code]) => code === nextCode) ?? null;
    const currentNationalNumber = nationalNumber(phone, countryCode);
    const nextCallingCode = callingCodeFor(nextCode);

    onLocationChange(composeLocation(parsedLocation.address, "", nextCountry?.[0] ?? ""));
    onPhoneChange(
      nextCallingCode && currentNationalNumber
        ? `+${nextCallingCode} ${currentNationalNumber}`
        : currentNationalNumber,
    );
  }

  function changePhone(value: string) {
    onPhoneChange(callingCode && value ? `+${callingCode} ${value.trimStart()}` : value);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Country" htmlFor={countryId}>
          <Select
            id={countryId}
            value={countryCode}
            onChange={(event) => changeCountry(event.target.value)}
            className="w-full"
          >
            <option value="">Select country</option>
            {allCountries.map(([name, code]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="State or province" htmlFor={regionId}>
          <Select
            id={regionId}
            value={parsedLocation.region}
            onChange={(event) =>
              onLocationChange(
                composeLocation(
                  parsedLocation.address,
                  event.target.value,
                  parsedLocation.country?.[0] ?? "",
                ),
              )
            }
            disabled={!countryCode || regions.length === 0}
            className="w-full disabled:cursor-not-allowed disabled:bg-surface-raised disabled:text-text-secondary"
          >
            <option value="">
              {regions.length > 0 ? "Select state or province" : "No regions available"}
            </option>
            {regions.map(([name, code]) => (
              <option key={`${code}-${name}`} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="City or address"
          htmlFor={addressId}
          error={locationError}
          errorId={`${addressId}-error`}
        >
          <Input
            id={addressId}
            aria-invalid={locationError ? true : undefined}
            aria-describedby={locationError ? `${addressId}-error` : undefined}
            value={parsedLocation.address}
            onChange={(event) =>
              onLocationChange(
                composeLocation(
                  event.target.value,
                  parsedLocation.region,
                  parsedLocation.country?.[0] ?? "",
                ),
              )
            }
            placeholder="City or address"
          />
        </Field>
        <Field
          label="Phone number"
          htmlFor={phoneId}
          error={phoneError}
          errorId={`${phoneId}-error`}
        >
          <div className="flex overflow-hidden rounded-sm border border-line bg-surface focus-within:border-signal-teal">
            {callingCode ? (
              <span className="flex items-center border-r border-line bg-surface-raised px-3 text-sm text-text-secondary">
                +{callingCode}
              </span>
            ) : null}
            <Input
              id={phoneId}
              aria-invalid={phoneError ? true : undefined}
              aria-describedby={phoneError ? `${phoneId}-error` : undefined}
              value={phoneValue}
              onChange={(event) => changePhone(event.target.value)}
              placeholder={callingCode ? "Phone number" : "+1 555 0100"}
              className="border-0 focus:border-0"
            />
          </div>
        </Field>
      </div>
    </div>
  );
}
