import type { ReactNode } from "react";

export const metadata = {
  title: "Privacy Policy & Data Protection Notice | Erasmus+ Portal",
  description:
    "The notice explaining what purposes and legal basis Erasmus+ Portal processes your personal data under, and your rights, in line with Turkey's KVKK (Law No. 6698).",
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3 text-foreground">{title}</h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

export default function EnglishGizlilikPolitikasiPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold mb-2 text-foreground">
        Privacy Policy &amp; Data Protection Notice
      </h1>
      <p className="text-xs text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
      </p>

      <div className="mb-8 rounded-lg border border-accent/40 bg-accent/[0.04] p-4 text-xs text-muted-foreground">
        This notice is prepared to fulfil the disclosure obligation under Article 10 of Turkey&rsquo;s Law
        No. 6698 on the Protection of Personal Data (&quot;KVKK&quot;). The data controller&rsquo;s full
        legal name, address and tax identification number, as well as the request contact e-mail
        address, must be completed/updated by the site operator; this text does not substitute for
        independent legal advice.
      </div>

      <Section title="1. Data Controller">
        <p>
          Your personal data is processed, as data controller, by the operator of this website,
          operated under the &quot;Erasmus+ Portal&quot; brand (erasmusportal.com), for the purposes
          and scope described below.
        </p>
      </Section>

      <Section title="2. Categories of Personal Data Processed">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-foreground">Identity and Contact Information:</strong> Full name, e-mail address, phone number (via forms such as account registration, consulting requests).</li>
          <li><strong className="text-foreground">Account Information:</strong> Password (stored irreversibly encrypted/hashed), membership tier, and, if you sign in with Google, the name/e-mail/profile picture shared from your Google account.</li>
          <li><strong className="text-foreground">Project and Organisation Information:</strong> Project name/number, and the coordinator and partner organisations&rsquo; official name, address, tax/PIC number and <strong className="text-foreground">legal representative&rsquo;s name</strong>, bank account details (IBAN, etc.), and the project manager&rsquo;s name/phone/e-mail, entered while using &quot;My Projects&quot; and related tools.</li>
          <li><strong className="text-foreground">Mobility/Travel Information:</strong> The name and title of real persons (assigned staff, approving/controlling officers) entered in the travel-expense notification tool.</li>
          <li><strong className="text-foreground">Request/Contact Information:</strong> Name, e-mail, phone and message content submitted through the Consulting Request form.</li>
          <li><strong className="text-foreground">Transaction Security Information:</strong> An irreversibly anonymised visitor/usage identifier generated to prevent misuse and enforce usage-right limits (e.g. a daily/monthly AI usage counter).</li>
        </ul>
        <p>
          Among the categories above, data under &quot;Project and Organisation Information&quot; and
          &quot;Mobility/Travel Information&quot; is mostly entered by the account holder on behalf of
          partner organisations or third parties involved in the project; responsibility for entering
          this data and the obligation to inform the relevant third parties belongs to the account
          holder who enters it into the system (see Article 7).
        </p>
      </Section>

      <Section title="3. Purposes of Processing Personal Data">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Creating an account, authentication, and managing membership tier,</li>
          <li>Providing the tools (budget calculators, document/form generators, project profile) and AI-assisted draft-generation services,</li>
          <li>Turning the project information you enter into an actual document (PDF/Excel) for the tool you selected,</li>
          <li>Evaluating and responding to consulting and membership-upgrade requests,</li>
          <li>Securing the service and protecting it against misuse,</li>
          <li>Fulfilling legal obligations.</li>
        </ul>
      </Section>

      <Section title="4. Legal Basis">
        <p>
          Your personal data is processed based on the legal grounds listed in KVKK Articles 5 and 9,
          including being directly related to the establishment or performance of a contract,
          fulfilment of a legal obligation, the data controller&rsquo;s legitimate interest, and (including
          the overseas transfers described in Article 5 below) your explicit consent.
        </p>
      </Section>

      <Section title="5. Transfer of Personal Data (Including Overseas Transfer)">
        <p>
          To provide the service, your personal data may be shared with our server/hosting
          infrastructure providers (e.g. Vercel Inc., Neon Inc. — both US-based) and the service
          providers we use for text generation in AI-assisted tools (e.g. OpenAI, Anthropic — both
          US-based).
        </p>
        <p>
          These transfers are evaluated under KVKK Article 9, which governs the transfer of data to
          countries without an adequate level of protection; the explicit consent you give when
          creating an account is deemed to also cover transfers under this scope. Only the project/text
          data necessary for that tool&rsquo;s function is sent to the AI tools.
        </p>
      </Section>

      <Section title="6. Retention Period">
        <p>
          Your personal data is permanently deleted from our systems for as long as your account is
          active, and from the moment you delete your account or the relevant project, except for the
          period required by legal retention obligations.
        </p>
      </Section>

      <Section title="7. Entering Data Belonging to Third Parties">
        <p>
          When you enter personal data belonging to third parties — such as your partner
          organisation&rsquo;s legal representative, your project manager, or staff participating in a
          mobility — into &quot;My Projects&quot; and its linked tools, you are deemed to have accepted
          that you are authorised to enter this data and that you are responsible for informing the
          relevant individuals under this Notice.
        </p>
      </Section>

      <Section title="8. Data Subject Rights (KVKK Art. 11)">
        <p>Under Article 11 of the KVKK, you have the following rights:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>To learn whether your personal data is being processed,</li>
          <li>To request information if it has been processed,</li>
          <li>To learn the purpose of processing and whether it is used accordingly,</li>
          <li>To know the third parties to whom it is transferred domestically or abroad,</li>
          <li>To request correction if it has been processed incompletely or incorrectly,</li>
          <li>To request its deletion/destruction within the conditions set out in the KVKK,</li>
          <li>To request that the above actions be notified to the third parties to whom the data has been transferred,</li>
          <li>To object to a result that arises against you solely through analysis by automated systems,</li>
          <li>To request compensation if you suffer damage due to unlawful processing.</li>
        </ul>
      </Section>

      <Section title="9. Deleting Your Account and Projects">
        <p>
          You can permanently delete your account from the &quot;My Account&quot; page, and your
          individual projects (along with all tool data linked to that project) from the &quot;My
          Projects&quot; page, at any time.
        </p>
      </Section>

      <Section title="10. How to Apply">
        <p>
          To exercise your rights, you can send your requests to the site operator using your
          registered e-mail address. (Data controller&rsquo;s application e-mail address: to be added by
          the site operator.)
        </p>
      </Section>
    </div>
  );
}
