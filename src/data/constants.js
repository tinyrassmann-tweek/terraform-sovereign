export const AI_AGENTS = [
  {
    id: 'lead-capture',
    name: 'Lead Capture',
    note: 'C♯',
    icon: '🎯',
    blurb: 'Catches every inbound inquiry the moment it lands — web, phone, or social — and scores it in seconds.',
  },
  {
    id: 'scheduling',
    name: 'Scheduling',
    note: 'G',
    icon: '📅',
    blurb: 'Books, reschedules, and reminds automatically, keeping your calendar in perfect tempo.',
  },
  {
    id: 'follow-up',
    name: 'Follow-up',
    note: 'E',
    icon: '🔁',
    blurb: 'Nurtures prospects with timely, personalized sequences so no opportunity fades out.',
  },
  {
    id: 'support-triage',
    name: 'Support Triage',
    note: 'B♭',
    icon: '🛟',
    blurb: 'Answers common questions instantly and routes the rest to the right human, fast.',
  },
  {
    id: 'reputation',
    name: 'Reputation',
    note: 'A',
    icon: '⭐',
    blurb: 'Monitors reviews, requests feedback at the right moment, and keeps your rating in harmony.',
  },
];

export const DISCORD_PAIN_POINTS = [
  {
    id: 'manual-data-entry',
    name: 'Manual Data Entry',
    agentId: 'follow-up',
    description: 'Hours lost copying leads and notes between tools — follow-up automation takes over the repetition.',
  },
  {
    id: 'missed-leads',
    name: 'Missed Leads',
    agentId: 'lead-capture',
    description: 'Inquiries arrive after hours and go cold overnight — lead capture answers every one, instantly.',
  },
  {
    id: 'slow-response',
    name: 'Slow Response',
    agentId: 'support-triage',
    description: 'Customers wait days for answers and drift to competitors — triage responds in seconds.',
  },
  {
    id: 'owner-burnout',
    name: 'Owner Burnout',
    agentId: 'scheduling',
    description: 'You are the calendar, the dispatcher, and the reminder system — scheduling hands it all back.',
  },
];

export const PRICING_TIERS = [
  {
    id: 'client-free',
    name: 'Audience (Clients)',
    price: 0,
    cadence: 'forever',
    features: [
      'Browse vetted AI Conductors',
      'Book orchestration sessions',
      'Resonance reviews & ratings',
      'Discord-to-Harmony assessment',
    ],
    cta: 'Find Your Conductor',
  },
  {
    id: 'section-player',
    name: 'Section Player',
    price: 29,
    cadence: 'mo',
    features: [
      'Listed in the Conductor directory',
      'Unlimited client bookings',
      'Resonance review responses',
      'Basic performance metrics',
    ],
    cta: 'Join the Ensemble',
  },
  {
    id: 'first-chair',
    name: 'First Chair',
    price: 99,
    cadence: 'mo',
    sponsored: true,
    features: [
      'Sponsored placement in the Overture',
      'First Chair badge & priority ranking',
      'Advanced tuning analytics',
      'Featured portfolio showcase',
    ],
    cta: 'Take the Podium',
  },
];

export const BRAND = {
  platform: 'Think Tank Solutions AI',
  method: 'Brand Symphony Arrangement Method',
  tagline: 'The Market is Loud. Orchestrate It.',
};
