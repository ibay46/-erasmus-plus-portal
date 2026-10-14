"use client";

import { useActionState } from "react";
import { submitConsultingLead, type LeadFormState } from "@/lib/actions/leads";
import { CONSULTING_SERVICES_EN } from "@/lib/content/consultingServices";
import { Card } from "@/components/ui/Card";

const initialState: LeadFormState = { success: false };

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

export default function EnglishDanismanlikTalepPage() {
  const [state, formAction, isPending] = useActionState(submitConsultingLead, initialState);

  if (state.success) {
    return (
      <Card className="max-w-md">
        <h1 className="text-2xl font-semibold mb-2 text-foreground">Your request has been received</h1>
        <p className="text-muted-foreground">
          Our team will get back to you as soon as possible. Thank you for your interest.
        </p>
      </Card>
    );
  }

  return (
    <Card className="max-w-md md:max-w-2xl lg:max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Consulting Request</h1>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="locale" value="en" />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="service" className="block text-sm font-medium mb-1 text-foreground">
              Service
            </label>
            <select id="service" name="service" required className={inputClass}>
              {CONSULTING_SERVICES_EN.map((s) => (
                <option key={s.slug} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1 text-foreground">
              Full Name
            </label>
            <input id="name" name="name" required className={inputClass} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-foreground">
              Email
            </label>
            <input id="email" type="email" name="email" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1 text-foreground">
              Phone (optional)
            </label>
            <input id="phone" name="phone" className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1 text-foreground">
            Your Message
          </label>
          <textarea id="message" name="message" required rows={4} className={inputClass} />
        </div>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer w-full inline-flex justify-center items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto lg:px-10"
        >
          {isPending ? "Sending..." : "Send Request"}
        </button>
      </form>
    </Card>
  );
}
