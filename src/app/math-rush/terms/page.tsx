import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Math Rush: Sphinx Challenge',
  description:
    'Terms of Service for Math Rush: Sphinx Challenge, an educational math puzzle game on Android.',
};

const LAST_UPDATED = 'May 4, 2026';

export default function MathRushTermsOfService() {
  return (
    <div className="page-shell">
      <div className="max-w-4xl mx-auto">
        <p className="text-center mb-4">
          <Link
            href="/math-rush/privacy"
            className="text-accent hover:text-accent-dark underline"
          >
            Privacy Policy
          </Link>
        </p>
        <div className="page-card">
          <h1 className="text-4xl font-bold text-text-primary mb-2 text-center">
            Terms of Service
          </h1>
          <p className="text-center text-text-muted mb-2">
            <strong>Math Rush: Sphinx Challenge</strong> · Android
          </p>

          <div className="prose prose-lg max-w-none">
            <p className="text-text-muted mb-6">
              <strong>Last updated:</strong> {LAST_UPDATED}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                1. Agreement
              </h2>
              <p className="text-text-secondary mb-4">
                These Terms of Service (“Terms”) govern your use of{' '}
                <strong>Math Rush: Sphinx Challenge</strong> (“the Game”), an
                educational single-player math puzzle distributed on Android
                (including via Google Play). By downloading, installing, or using
                the Game, you agree to these Terms. If you do not agree, do not use
                the Game.
              </p>
              <p className="text-text-secondary mb-4">
                Your use of Google Play and optional{' '}
                <strong>Google Play Games Services</strong> (for example
                leaderboards) is also subject to Google’s applicable terms and
                policies, including the{' '}
                <a
                  href="https://play.google.com/intl/ALL_en/about/play-terms/"
                  className="text-accent hover:text-accent-dark underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Play Terms of Service
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                2. Description of the Game
              </h2>
              <p className="text-text-secondary mb-4">
                The Game challenges you on an 8×8 board: you combine three numbers
                using addition, subtraction, multiplication, and division to match
                values on the grid, score points, manage lives, and play within a
                time limit. The experience is intended to support skills such as
                calculation, logic, spatial reasoning, and quick decision-making.
                Age guidance: <strong>13+</strong>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                3. License
              </h2>
              <p className="text-text-secondary mb-4">
                Subject to these Terms and the store rules, we grant you a personal,
                non-exclusive, non-transferable, revocable license to install and
                use the Game for private, non-commercial entertainment and learning.
                You may not copy, modify, distribute, sell, or lease the Game or its
                assets except as expressly allowed by law or by us in writing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                4. Acceptable use
              </h2>
              <p className="text-text-secondary mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 mb-4 text-text-secondary">
                <li>
                  cheat, exploit bugs, or manipulate scores or leaderboards in an
                  unfair or fraudulent way;
                </li>
                <li>
                  reverse engineer, decompile, or attempt to extract source code
                  except where mandatory local law allows it;
                </li>
                <li>
                  use the Game in violation of law, third-party rights, or platform
                  rules;
                </li>
                <li>
                  interfere with servers, networks, or other users’ enjoyment of the
                  service.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                5. Google Play Games and online features
              </h2>
              <p className="text-text-secondary mb-4">
                Leaderboards and related features may be provided through{' '}
                <strong>Google Play Games Services</strong>. Availability can
                change by region, device, or Google policy. We are not responsible
                for outages or changes made by Google. See our{' '}
                <Link
                  href="/math-rush/privacy"
                  className="text-accent hover:text-accent-dark underline"
                >
                  Privacy Policy
                </Link>{' '}
                for how data may be processed in connection with those services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                6. Updates and changes
              </h2>
              <p className="text-text-secondary mb-4">
                We may release updates (content, balance, bug fixes, or technical
                changes). Some updates may be required to continue using the Game.
                We may also modify these Terms; the “Last updated” date will
                reflect material revisions. If you keep using the Game after
                changes, you accept the updated Terms to the extent permitted by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                7. Disclaimer of warranties
              </h2>
              <p className="text-text-secondary mb-4">
                The Game is provided <strong>“as is”</strong> and{' '}
                <strong>“as available”</strong> without warranties of any kind, to
                the fullest extent permitted by law. We do not warrant uninterrupted
                or error-free operation or that the Game will meet every user’s
                expectations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                8. Limitation of liability
              </h2>
              <p className="text-text-secondary mb-4">
                To the maximum extent permitted by applicable law, we and our
                licensors shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or for loss of profits, data, or
                goodwill, arising from or related to your use of the Game. Our
                aggregate liability for any claim arising out of these Terms or the
                Game shall not exceed the amount you paid us specifically for the
                Game in the twelve (12) months before the claim (if any such payment
                exists; many copies are free).
              </p>
              <p className="text-text-secondary mb-4">
                Some jurisdictions do not allow certain limitations; in those cases,
                our liability is limited to the minimum permitted by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                9. Intellectual property
              </h2>
              <p className="text-text-secondary mb-4">
                The Game, its name, artwork, audio, and related content are protected
                by intellectual property laws. Google, Android, and Google Play are
                trademarks of Google LLC. This document does not grant any rights to
                third-party marks.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                10. Termination
              </h2>
              <p className="text-text-secondary mb-4">
                We may suspend or stop providing the Game or any feature. You may stop
                using the Game at any time by uninstalling it. Provisions that by
                their nature should survive (for example limitations of liability,
                governing law where allowed) will survive termination.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                11. Governing law
              </h2>
              <p className="text-text-secondary mb-4">
                These Terms are governed by the laws applicable in your jurisdiction
                as required by mandatory consumer protection rules, except where
                Google Play or another mandatory rule specifies otherwise. Courts or
                dispute bodies with competent jurisdiction may apply.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                12. Contact
              </h2>
              <p className="text-text-secondary mb-4">
                For questions about these Terms, use the support contact published on
                the Game’s Google Play Store listing.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-text-muted text-sm">
            <p>© Math Rush: Sphinx Challenge</p>
            <p className="mt-2">
              <Link
                href="/math-rush/privacy"
                className="text-accent hover:text-accent-dark underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
