import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Math Rush: Sphinx Challenge',
  description:
    'Privacy Policy for Math Rush: Sphinx Challenge, an educational math puzzle game on Android.',
};

const LAST_UPDATED = 'May 4, 2026';

export default function MathRushPrivacyPolicy() {
  return (
    <div className="page-shell">
      <div className="max-w-4xl mx-auto">
        <p className="text-center mb-4">
          <Link
            href="/math-rush/terms"
            className="text-accent hover:text-accent-dark underline"
          >
            Terms of Service
          </Link>
        </p>
        <div className="page-card">
          <h1 className="text-4xl font-bold text-text-primary mb-2 text-center">
            Privacy Policy
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
                1. Introduction
              </h2>
              <p className="text-text-secondary mb-4">
                This Privacy Policy explains how{' '}
                <strong>Math Rush: Sphinx Challenge</strong> (“the Game”, “we”,
                “us”) handles information when you install and play the Android
                version distributed through Google Play. The Game is an
                educational, single-player board-style puzzle: you use addition,
                subtraction, multiplication, and division on an 8×8 grid to score
                points against the clock.
              </p>
              <p className="text-text-secondary mb-4">
                By using the Game, you agree to this Policy. If you do not agree,
                please uninstall the Game and discontinue use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                2. Information we may process
              </h2>
              <p className="text-text-secondary mb-4">
                Depending on how you use the Game and which features you enable,
                the following categories may apply:
              </p>
              <ul className="list-disc pl-6 mb-4 text-text-secondary">
                <li>
                  <strong>Gameplay and app performance data</strong> — For
                  example scores, session length, feature usage, and crash or
                  diagnostics data processed through Google Play or your
                  device’s reporting tools, to keep the Game working and to
                  understand how it is used in aggregate.
                </li>
                <li>
                  <strong>Device and technical identifiers</strong> — Such as device
                  model, operating system version, language, and app version, as
                  typically provided by the platform to deliver updates and
                  compatible experiences.
                </li>
                <li>
                  <strong>Google Play Games Services (leaderboards)</strong> — If
                  you sign in with Google Play Games and use leaderboards, Google
                  may process account-related and gameplay-related data (for
                  example scores and identifiers needed to show rankings)
                  according to Google’s own policies. We do not operate a separate
                  account system inside the Game for that feature beyond what the
                  platform provides.
                </li>
              </ul>
              <p className="text-text-secondary mb-4">
                We do not require you to provide your real name, email address, or
                phone number inside the Game to play the core offline experience.
                Any personal data flows mainly through Google Play, Google Play
                Games, and your device as described below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                3. Third-party services (Google)
              </h2>
              <p className="text-text-secondary mb-4">
                The Game is distributed via <strong>Google Play</strong> and may
                use <strong>Google Play Games Services</strong> for leaderboards
                and related social/competitive features offered by Google.
              </p>
              <p className="text-text-secondary mb-4">
                Google’s handling of data is governed by Google’s documents,
                including the{' '}
                <a
                  href="https://policies.google.com/privacy"
                  className="text-accent hover:text-accent-dark underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Privacy Policy
                </a>{' '}
                and, where applicable,{' '}
                <a
                  href="https://developers.google.com/games/services"
                  className="text-accent hover:text-accent-dark underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Play Games Services
                </a>{' '}
                documentation. We encourage you to review those resources and
                your Google account privacy controls.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                4. How we use information
              </h2>
              <p className="text-text-secondary mb-4">
                We use information for legitimate purposes such as:
              </p>
              <ul className="list-disc pl-6 mb-4 text-text-secondary">
                <li>Providing, maintaining, and improving the Game;</li>
                <li>
                  Displaying leaderboards and related Play Games features when you
                  use them;
                </li>
                <li>
                  Understanding aggregated usage to improve difficulty, balance,
                  and educational value;
                </li>
                <li>Security, fraud prevention, and compliance with applicable law.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                5. Sharing
              </h2>
              <p className="text-text-secondary mb-4">
                We do not sell your personal information. Data may be processed by{' '}
                <strong>Google</strong> (hosting, distribution, Play Games
                Services, analytics or crash reporting as configured for the app)
                and by other processors strictly as needed to operate the Game on
                modern Android devices. We may also disclose information if
                required by law or to protect rights and safety.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                6. Retention
              </h2>
              <p className="text-text-secondary mb-4">
                Retention depends on the systems involved (for example Google Play
                Games leaderboard data is subject to Google’s retention practices).
                Locally stored data on your device is under your control and may be
                removed by clearing app data or uninstalling the Game.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                7. Children’s privacy
              </h2>
              <p className="text-text-secondary mb-4">
                The Game is intended for players <strong>13+</strong>. We do not
                knowingly collect personal information from anyone under 13 except
                where allowed by law and the platform. If you believe we have
                received information from a child under 13, contact us through the
                Play Store listing so we can take appropriate steps. Parents and
                guardians may use Google Play parental controls to manage device and
                account use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                8. International users
              </h2>
              <p className="text-text-secondary mb-4">
                Your information may be processed in countries where Google or its
                subprocessors operate. Those transfers are subject to Google’s
                terms and safeguards as described in Google’s privacy documentation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                9. Your choices and rights
              </h2>
              <p className="text-text-secondary mb-4">
                Depending on your region, you may have rights to access, correct,
                delete, or restrict certain processing of personal data. You can
                manage many Google-related settings in your Google Account and in
                the Google Play app. You may also contact us (see below) with
                privacy-related requests; we will respond in line with applicable
                law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                10. Changes to this Policy
              </h2>
              <p className="text-text-secondary mb-4">
                We may update this Privacy Policy from time to time. The “Last
                updated” date at the top will change when we do. Continued use of
                the Game after changes constitutes acceptance of the updated
                Policy, except where a stricter legal requirement applies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">
                11. Contact
              </h2>
              <p className="text-text-secondary mb-4">
                For privacy questions about{' '}
                <strong>Math Rush: Sphinx Challenge</strong>, contact the developer
                using the support email or link shown on the app’s Google Play
                Store listing.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-text-muted text-sm">
            <p>© Math Rush: Sphinx Challenge</p>
            <p className="mt-2">
              <Link
                href="/math-rush/terms"
                className="text-accent hover:text-accent-dark underline"
              >
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
