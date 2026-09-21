"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { IntegrationsConnectors } from "@/components/composed/landing/IntegrationsConnectors";
import { Reveal } from "@/components/ui/Reveal";
import { LANDING_EASE, LANDING_VIEWPORT, useLandingMotion } from "@/lib/landing-motion";

type Tool = {
  name: string;
  render: () => ReactNode;
};

/** Official marks, not stand-ins. The six that ship as flat vector paths
 * (from simple-icons, CC0) are recolored to their real brand color; Gmail,
 * Apollo, Hunter, and ContactOut already have their own full-color logo
 * files under /public/logos, shared with the connected-accounts page. */
function VectorMark({
  path,
  viewBox = "0 0 24 24",
  color,
}: {
  path: string;
  viewBox?: string;
  color: string;
}) {
  return (
    <svg viewBox={viewBox} className="h-5 w-5">
      <path d={path} fill={color} />
    </svg>
  );
}

function ImageMark({ src, name }: { src: string; name: string }) {
  return (
    <span className="relative block h-6 w-6">
      <Image src={src} alt={name} fill sizes="24px" className="object-contain" />
    </span>
  );
}

const LEFT_TOOLS: Tool[] = [
  { name: "Gmail", render: () => <ImageMark src="/logos/gmail.svg" name="Gmail" /> },
  {
    name: "Outlook",
    render: () => (
      <VectorMark
        color="#0078D4"
        path="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V10.85l1.24.72h.01q.1.07.18.18.07.12.07.25zm-6-8.25v3h3v-3zm0 4.5v3h3v-3zm0 4.5v1.83l3.05-1.83zm-5.25-9v3h3.75v-3zm0 4.5v3h3.75v-3zm0 4.5v2.03l2.41 1.5 1.34-.8v-2.73zM9 3.75V6h2l.13.01.12.04v-2.3zM5.98 15.98q.9 0 1.6-.3.7-.32 1.19-.86.48-.55.73-1.28.25-.74.25-1.61 0-.83-.25-1.55-.24-.71-.71-1.24t-1.15-.83q-.68-.3-1.55-.3-.92 0-1.64.3-.71.3-1.2.85-.5.54-.75 1.3-.25.74-.25 1.63 0 .85.26 1.56.26.72.74 1.23.48.52 1.17.81.69.3 1.56.3zM7.5 21h12.39L12 16.08V17q0 .41-.3.7-.29.3-.7.3H7.5zm15-.13v-7.24l-5.9 3.54Z"
      />
    ),
  },
  {
    name: "Google Drive",
    render: () => (
      <VectorMark
        color="#FFBA00"
        path="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z"
      />
    ),
  },
  {
    name: "Google Calendar",
    render: () => (
      <VectorMark
        color="#4285F4"
        path="M18.316 5.684H24v12.632h-5.684V5.684zM5.684 24h12.632v-5.684H5.684V24zM18.316 5.684V0H1.895A1.894 1.894 0 0 0 0 1.895v16.421h5.684V5.684h12.632zm-7.207 6.25v-.065c.272-.144.5-.349.687-.617s.279-.595.279-.982c0-.379-.099-.72-.3-1.025a2.05 2.05 0 0 0-.832-.714 2.703 2.703 0 0 0-1.197-.257c-.6 0-1.094.156-1.481.467-.386.311-.65.671-.793 1.078l1.085.452c.086-.249.224-.461.413-.633.189-.172.445-.257.767-.257.33 0 .602.088.816.264a.86.86 0 0 1 .322.703c0 .33-.12.589-.36.778-.24.19-.535.284-.886.284h-.567v1.085h.633c.407 0 .748.109 1.02.327.272.218.407.499.407.843 0 .336-.129.614-.387.832s-.565.327-.924.327c-.351 0-.651-.103-.897-.311-.248-.208-.422-.502-.521-.881l-1.096.452c.178.616.505 1.082.977 1.401.472.319.984.478 1.538.477a2.84 2.84 0 0 0 1.293-.291c.382-.193.684-.458.902-.794.218-.336.327-.72.327-1.149 0-.429-.115-.797-.344-1.105a2.067 2.067 0 0 0-.881-.689zm2.093-1.931l.602.913L15 10.045v5.744h1.187V8.446h-.827l-2.158 1.557zM22.105 0h-3.289v5.184H24V1.895A1.894 1.894 0 0 0 22.105 0zm-3.289 23.5l4.684-4.684h-4.684V23.5zM0 22.105C0 23.152.848 24 1.895 24h3.289v-5.184H0v3.289z"
      />
    ),
  },
  { name: "Hunter", render: () => <ImageMark src="/logos/hunter.png" name="Hunter" /> },
];

const RIGHT_TOOLS: Tool[] = [
  { name: "Apollo", render: () => <ImageMark src="/logos/apollo.svg" name="Apollo" /> },
  { name: "ContactOut", render: () => <ImageMark src="/logos/contactout.png" name="ContactOut" /> },
  {
    name: "LinkedIn",
    render: () => (
      <VectorMark
        color="#0A66C2"
        path="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    ),
  },
  {
    name: "Notion",
    render: () => (
      <VectorMark
        color="#000000"
        path="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"
      />
    ),
  },
  {
    name: "Slack",
    render: () => (
      <VectorMark
        color="#4A154B"
        path="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
      />
    ),
  },
];

function ToolBadge({ tool, index }: { tool: Tool; index: number }) {
  const reduceMotion = useLandingMotion();

  return (
    <motion.div
      data-node
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line bg-surface shadow-card sm:h-12 sm:w-12"
      title={tool.name}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={LANDING_VIEWPORT}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.4, delay: index * 0.08 + 0.35, ease: LANDING_EASE }
      }
    >
      {tool.render()}
    </motion.div>
  );
}

function ToolColumn({ tools, side }: { tools: Tool[]; side: "left" | "right" }) {
  return (
    <ul
      className={`flex flex-1 flex-col justify-between gap-6 sm:gap-8 ${side === "right" ? "items-end" : "items-start"}`}
    >
      {tools.map((tool, index) => (
        <li key={tool.name}>
          <ToolBadge tool={tool} index={index} />
        </li>
      ))}
    </ul>
  );
}

export function Integrations() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="overflow-hidden border-b border-line bg-signal-amber-subtle/25">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div ref={containerRef} className="relative flex items-stretch gap-6 sm:gap-10">
          <IntegrationsConnectors containerRef={containerRef} />

          <ToolColumn tools={LEFT_TOOLS} side="left" />

          <Reveal
            data-hub-card
            className="relative my-2 flex min-w-0 flex-[1.8] items-center justify-center rounded-lg border-y-2 border-signal-amber/40 bg-paper px-4 py-10 text-center sm:px-8"
            offset={0}
            duration={0.5}
          >
            <div className="max-w-sm">
              <p className="utility-label text-signal-amber">Fits your workflow</p>
              <h2 className="mt-4 font-display text-2xl font-semibold tracking-[-0.04em] text-ink sm:text-3xl">
                Plugs into the tools <span className="text-signal-amber">you already use.</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
                Inroad connects to your email, your contact-finding tools, and the rest of your
                search setup, so research and outreach live where you already work.
              </p>
            </div>
          </Reveal>

          <ToolColumn tools={RIGHT_TOOLS} side="right" />
        </div>
      </div>
    </section>
  );
}
