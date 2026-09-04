"use client";

import { useId } from "react";

import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { RepeatableList } from "@/components/ui/RepeatableList";
import { UrlInput } from "@/components/ui/UrlInput";
import type { CertificateEntry } from "@/lib/api-client/client";

const BLANK: CertificateEntry = {
  name: "",
  issuer: "",
  date: "",
  credential_id: "",
  credential_url: "",
};

export function CertificatesEditor({
  entries,
  onChange,
}: {
  entries: CertificateEntry[];
  onChange: (entries: CertificateEntry[]) => void;
}) {
  const idPrefix = useId();

  return (
    <RepeatableList
      items={entries}
      onChange={onChange}
      newItem={() => ({ ...BLANK })}
      addLabel="Add certificate"
      emptyLabel="No certificates or achievements added yet."
    >
      {(entry, update, index) => {
        const nameId = `${idPrefix}-${index}-name`;
        const issuerId = `${idPrefix}-${index}-issuer`;
        const dateId = `${idPrefix}-${index}-date`;
        const credentialId = `${idPrefix}-${index}-credential-id`;
        const credentialUrlId = `${idPrefix}-${index}-credential-url`;

        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Certificate or achievement" htmlFor={nameId}>
                <Input
                  id={nameId}
                  value={entry.name ?? ""}
                  onChange={(event) => update({ name: event.target.value })}
                  placeholder="Meta Front-End Developer"
                />
              </Field>
              <Field label="Issuer" htmlFor={issuerId}>
                <Input
                  id={issuerId}
                  value={entry.issuer ?? ""}
                  onChange={(event) => update({ issuer: event.target.value })}
                  placeholder="Coursera"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date" htmlFor={dateId}>
                <Input
                  id={dateId}
                  value={entry.date ?? ""}
                  onChange={(event) => update({ date: event.target.value })}
                  placeholder="Nov 2024"
                />
              </Field>
              <Field label="Credential ID" htmlFor={credentialId}>
                <Input
                  id={credentialId}
                  value={entry.credential_id ?? ""}
                  onChange={(event) => update({ credential_id: event.target.value })}
                  placeholder="Credential identifier"
                />
              </Field>
            </div>
            <Field label="Credential link" htmlFor={credentialUrlId}>
              <UrlInput
                id={credentialUrlId}
                value={entry.credential_url ?? ""}
                onChange={(event) => update({ credential_url: event.target.value })}
                placeholder="https://credentials.example.com/verify"
              />
            </Field>
          </>
        );
      }}
    </RepeatableList>
  );
}
