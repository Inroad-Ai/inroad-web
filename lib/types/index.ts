/** Barrel for lib/types/. Existing code imports from "@/lib/types" and gets
 * everything below; new code may import a specific submodule directly
 * (e.g. "@/lib/types/person") once there's a reason to. */

export * from "@/lib/types/company";
export * from "@/lib/types/person";
export * from "@/lib/types/pipeline";
export * from "@/lib/types/ui-state";
