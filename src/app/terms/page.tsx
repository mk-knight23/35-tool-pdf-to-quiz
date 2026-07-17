import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions of using MK QuizFlow for educational purposes.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <p className="text-2xs font-medium uppercase tracking-[0.08em] text-accent">Legal</p>
        <h1 className="font-display text-4xl text-ink mt-2">Terms of Service</h1>
        <p className="text-ink-secondary mt-2 text-base">
          Standard terms for using the QuizFlow web application.
        </p>
      </div>

      <hr className="border-line" />

      <div className="qf-prose flex flex-col gap-6 text-sm text-ink-secondary leading-relaxed">
        <section>
          <h2 className="font-display text-xl text-ink">1. Acceptance of Terms</h2>
          <p>
            By accessing and using QuizFlow, you agree to comply with and be bound by these terms. If you do not agree to these terms, please do not use the application.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">2. Permitted Use</h2>
          <p>
            QuizFlow is designed as a study aid for individual students, educators, and professionals. You are free to run the tool, generate study assets, and export materials for educational purposes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">3. Limitation of Liability</h2>
          <p>
            THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE.
          </p>
        </section>
      </div>
    </div>
  );
}
