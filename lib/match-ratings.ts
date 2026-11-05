"use client";

import { useCallback, useEffect, useState } from "react";

import { rateMatch, withdrawRating } from "@/lib/api-client/client";
import { requireAccessToken } from "@/lib/auth-native/browser";
import type { MatchRating, RatingReason, RatingVerdict } from "@/lib/types";

/** In the order the reasons menu lists them. A company-level "not for me"
 * needs no reason: the API records it as not_this_company. */
export const RATING_REASONS: { value: RatingReason; label: string }[] = [
  { value: "wrong_stack", label: "Wrong tech stack" },
  { value: "wrong_location", label: "Wrong location" },
  { value: "too_senior", label: "Too senior" },
  { value: "too_junior", label: "Too junior" },
  { value: "wrong_role", label: "Not the kind of role I want" },
  { value: "not_this_company", label: "Not interested in this company" },
];

export function reasonLabel(reason: RatingReason): string {
  return RATING_REASONS.find((r) => r.value === reason)?.label ?? reason;
}

function ratingId(companyId: string, roleKey: string): string {
  return `${companyId}:${roleKey}`;
}

export interface MatchRatings {
  get: (companyId: string, roleKey: string) => MatchRating | null;
  rate: (
    companyId: string,
    roleKey: string,
    verdict: RatingVerdict,
    reasons?: RatingReason[],
  ) => Promise<void>;
  undo: (companyId: string, roleKey: string) => Promise<void>;
  isPending: (companyId: string, roleKey: string) => boolean;
  /** Why the last save of this rating failed, if it did. */
  errorFor: (companyId: string, roleKey: string) => string;
}

export interface LoadedRating {
  companyId: string;
  rating: MatchRating;
}

/** The user's ratings on one page, saved as they are made. `loaded` is what
 * the page's own data already says; pass a memoized array, since a new one
 * replaces what this holds. */
export function useMatchRatings(loaded: LoadedRating[]): MatchRatings {
  const [ratings, setRatings] = useState<Record<string, MatchRating>>({});

  useEffect(() => {
    setRatings(
      Object.fromEntries(
        loaded.map(({ companyId, rating }) => [ratingId(companyId, rating.role_key), rating]),
      ),
    );
  }, [loaded]);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<{ id: string; message: string } | null>(null);

  const save = useCallback(async (id: string, change: (token: string) => Promise<void>) => {
    setPending(id);
    setError(null);
    try {
      await change(await requireAccessToken());
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not save your rating.";
      setError({ id, message });
    } finally {
      setPending(null);
    }
  }, []);

  const rate = useCallback(
    (company: string, roleKey: string, verdict: RatingVerdict, reasons: RatingReason[] = []) => {
      const id = ratingId(company, roleKey);
      return save(id, async (token) => {
        const saved = await rateMatch(company, roleKey, verdict, reasons, token);
        setRatings((current) => ({ ...current, [id]: saved }));
      });
    },
    [save],
  );

  const undo = useCallback(
    (company: string, roleKey: string) => {
      const id = ratingId(company, roleKey);
      return save(id, async (token) => {
        await withdrawRating(company, roleKey, token);
        setRatings(({ [id]: _removed, ...rest }) => rest);
      });
    },
    [save],
  );

  const get = useCallback(
    (company: string, roleKey: string) => ratings[ratingId(company, roleKey)] ?? null,
    [ratings],
  );

  const isPending = useCallback(
    (company: string, roleKey: string) => pending === ratingId(company, roleKey),
    [pending],
  );

  const errorFor = useCallback(
    (company: string, roleKey: string) =>
      error?.id === ratingId(company, roleKey) ? error.message : "",
    [error],
  );

  return { get, rate, undo, isPending, errorFor };
}
