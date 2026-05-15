// Seed data for playbooks — used for initial DB population and as fallback for static rendering

export const PLAYBOOK_SEED_DATA = [
  {
    title: 'String Setup Playbook',
    slug: 'string-setup',
    description: 'Understand poly, multifilament and synthetic gut. Learn what string and tension actually suits your game.',
    longDescription: 'Most players string their racket the same way every time without understanding why. This playbook explains the difference between string types, how tension affects play, and what to choose based on your style.',
    price: 7.99,
    category: 'Equipment',
    tags: ['strings', 'tension', 'setup', 'equipment'],
    featured: true,
    published: true,
    previewContent: `
      <h2>What this playbook covers</h2>
      <ul>
        <li>Poly vs multifilament vs synthetic gut — the real differences</li>
        <li>String tension explained simply</li>
        <li>Strings for spin, control, comfort and power</li>
        <li>When to restring and why</li>
        <li>The most common string mistakes</li>
      </ul>
      <p>This is a preview. Purchase the full playbook to access all content.</p>
    `,
  },
  {
    title: 'Racket Buying Playbook',
    slug: 'racket-buying',
    description: 'Head size, weight, balance, swingweight and string pattern explained. Buy the right racket the first time.',
    longDescription: 'Buying the wrong racket is expensive and frustrating. This playbook breaks down every specification you need to understand before spending money on a new racket.',
    price: 9.99,
    category: 'Equipment',
    tags: ['racket', 'buying', 'equipment', 'specs'],
    featured: true,
    published: true,
    previewContent: `
      <h2>What this playbook covers</h2>
      <ul>
        <li>Head size — what it actually means for your game</li>
        <li>Weight and balance explained</li>
        <li>Swingweight — the most important number most players ignore</li>
        <li>String pattern and how it affects spin and control</li>
        <li>Stiffness and arm comfort</li>
        <li>Racket types by player style</li>
        <li>Common buying mistakes to avoid</li>
      </ul>
    `,
  },
  {
    title: 'Tennis Shoe Playbook',
    slug: 'tennis-shoe',
    description: 'Hard court, clay and all-court shoes reviewed by playing style. Stop wasting money on the wrong shoes.',
    longDescription: 'Tennis shoes are one of the most important equipment decisions players make, yet most players choose by looks. This playbook helps you choose by function.',
    price: 6.99,
    category: 'Equipment',
    tags: ['shoes', 'equipment', 'hard court', 'clay'],
    featured: false,
    published: true,
    previewContent: `
      <h2>What this playbook covers</h2>
      <ul>
        <li>Hard court shoes — durability, support and cushioning</li>
        <li>Clay court shoes — grip and slide patterns</li>
        <li>Speed shoes vs stability shoes</li>
        <li>Wide feet considerations</li>
        <li>When to replace your shoes</li>
      </ul>
    `,
  },
  {
    title: 'Warm-Up Playbook',
    slug: 'warm-up',
    description: 'A structured 10-minute tennis warm-up covering dynamic movement, shoulder prep and serve preparation.',
    longDescription: 'Most players skip the warm-up or do it wrong. This playbook gives you a clear, practical routine that takes 10 minutes and prepares every part of your body for tennis.',
    price: 4.99,
    category: 'Training',
    tags: ['warm-up', 'training', 'preparation', 'movement'],
    featured: true,
    published: true,
    previewContent: `
      <h2>What this playbook covers</h2>
      <ul>
        <li>A complete 10-minute tennis warm-up</li>
        <li>Dynamic movement patterns specific to tennis</li>
        <li>Shoulder and rotator cuff preparation</li>
        <li>Wrist and forearm activation</li>
        <li>Footwork activation drills</li>
        <li>Serve preparation sequence</li>
      </ul>
    `,
  },
  {
    title: 'Cool-Down Playbook',
    slug: 'cool-down',
    description: 'Post-tennis cool-down, stretching structure and a recovery checklist to reduce soreness and improve recovery.',
    longDescription: 'Recovery starts the moment you finish playing. This playbook gives you a simple, effective cool-down routine that most recreational players never bother with.',
    price: 4.99,
    category: 'Training',
    tags: ['cool-down', 'recovery', 'stretching', 'training'],
    featured: false,
    published: true,
    previewContent: `
      <h2>What this playbook covers</h2>
      <ul>
        <li>Post-tennis cool-down sequence</li>
        <li>Stretching structure by muscle group</li>
        <li>Breathing reset techniques</li>
        <li>Recovery checklist</li>
      </ul>
    `,
  },
  {
    title: 'Match Tactics Playbook',
    slug: 'match-tactics',
    description: 'Singles and doubles tactics, serve patterns, return tactics, and how to beat different player types.',
    longDescription: 'Tactics are what separates club players who practise from club players who win. This playbook gives you clear, practical strategies you can use in your next match.',
    price: 9.99,
    category: 'Matchplay',
    tags: ['tactics', 'matchplay', 'singles', 'doubles', 'serve'],
    featured: true,
    published: true,
    previewContent: `
      <h2>What this playbook covers</h2>
      <ul>
        <li>Singles tactics for different court surfaces</li>
        <li>Doubles tactics and positioning</li>
        <li>Serve patterns — where to serve and why</li>
        <li>Return tactics</li>
        <li>How to beat different player types</li>
        <li>Tie-break tactics</li>
        <li>Handling pressure points</li>
      </ul>
    `,
  },
  {
    title: 'Beginner Tennis Setup Playbook',
    slug: 'beginner-setup',
    description: 'First racket, first shoes, first strings and a basic structure to start playing and improving from day one.',
    longDescription: 'Starting tennis is overwhelming. There are thousands of rackets, hundreds of strings, and endless conflicting advice online. This playbook cuts through all of it.',
    price: 9.99,
    category: 'Beginner',
    tags: ['beginner', 'setup', 'equipment', 'getting started'],
    featured: false,
    published: true,
    previewContent: `
      <h2>What this playbook covers</h2>
      <ul>
        <li>How to choose your first racket</li>
        <li>First shoes — what actually matters</li>
        <li>First string setup and tension</li>
        <li>A basic warm-up to start with</li>
        <li>How to structure your first few months</li>
        <li>What not to waste money on</li>
      </ul>
    `,
  },
  {
    title: 'Club Player Playbook',
    slug: 'club-player',
    description: 'Equipment setup, string and tension advice, match tactics, and practice structure for club-level players.',
    longDescription: 'Club players have specific needs. You play regularly, you compete, and you want to improve — but you also have limited time. This playbook is built for you.',
    price: 14.99,
    category: 'Club Player',
    tags: ['club', 'tactics', 'equipment', 'training', 'practice'],
    featured: false,
    published: true,
    previewContent: `
      <h2>What this playbook covers</h2>
      <ul>
        <li>Club player equipment setup</li>
        <li>String and tension for competitive club play</li>
        <li>Match tactics at club level</li>
        <li>Practice structure for club players</li>
        <li>Match day preparation</li>
      </ul>
    `,
  },
  {
    title: 'Grip Guide',
    slug: 'grip-guide',
    description: 'Grip size, overgrips, replacement grips and grip build-up basics. Get your grip right.',
    longDescription: 'An incorrectly sized grip affects your serve, your volleys and your arm comfort. This quick guide covers everything you need to know about grip.',
    price: 3.99,
    category: 'Equipment',
    tags: ['grip', 'overgrip', 'equipment', 'setup'],
    featured: false,
    published: true,
    previewContent: `
      <h2>What this playbook covers</h2>
      <ul>
        <li>How to find your correct grip size</li>
        <li>Overgrips — types and how to apply them</li>
        <li>Replacement grips vs overgrips</li>
        <li>Sweaty hands solutions</li>
        <li>Grip build-up basics</li>
      </ul>
    `,
  },
  {
    title: 'Tennis Nutrition and Fuelling Guide',
    slug: 'nutrition-fuelling',
    description: 'Match-day food, hydration basics and what to eat before, during and after tennis. Practical and simple.',
    longDescription: 'What you eat and drink affects how you play. This guide gives you simple, practical fuelling strategies for match days and training sessions.',
    price: 6.99,
    category: 'Fitness',
    tags: ['nutrition', 'fuelling', 'hydration', 'match day'],
    featured: false,
    published: true,
    previewContent: `
      <h2>What this playbook covers</h2>
      <ul>
        <li>General match-day food ideas</li>
        <li>Hydration basics for tennis</li>
        <li>What to eat before a match</li>
        <li>What to drink during a match</li>
        <li>Post-match recovery nutrition</li>
      </ul>
      <p><strong>Disclaimer:</strong> This is general information only. Not medical or dietetic advice.</p>
    `,
  },
]

export const BUNDLE_SEED_DATA = [
  {
    title: 'Equipment Bundle',
    slug: 'equipment-bundle',
    description: 'Everything you need to make better equipment decisions — racket, strings, shoes and grip.',
    price: 24.99,
    category: 'Bundle',
    isBundle: true,
    featured: true,
    published: true,
    playbookSlugs: ['racket-buying', 'string-setup', 'tennis-shoe', 'grip-guide'],
    previewContent: '<p>Includes: Racket Buying Playbook, String Setup Playbook, Tennis Shoe Playbook, Grip Guide.</p>',
  },
  {
    title: 'Training Bundle',
    slug: 'training-bundle',
    description: 'Warm-up, cool-down and drill sheets to build structure into every session.',
    price: 24.99,
    category: 'Bundle',
    isBundle: true,
    featured: false,
    published: true,
    playbookSlugs: ['warm-up', 'cool-down'],
    previewContent: '<p>Includes: Warm-Up Playbook, Cool-Down Playbook.</p>',
  },
  {
    title: 'Matchplay Bundle',
    slug: 'matchplay-bundle',
    description: 'Tactics, warm-up and match preparation in one bundle.',
    price: 24.99,
    category: 'Bundle',
    isBundle: true,
    featured: false,
    published: true,
    playbookSlugs: ['match-tactics', 'warm-up'],
    previewContent: '<p>Includes: Match Tactics Playbook, Warm-Up Playbook.</p>',
  },
  {
    title: 'Beginner Bundle',
    slug: 'beginner-bundle',
    description: 'Everything a new player needs to start with the right equipment and a structured warm-up.',
    price: 29.99,
    category: 'Bundle',
    isBundle: true,
    featured: true,
    published: true,
    playbookSlugs: ['beginner-setup', 'racket-buying', 'tennis-shoe', 'warm-up'],
    previewContent: '<p>Includes: Beginner Tennis Setup Playbook, Racket Buying Playbook, Tennis Shoe Playbook, Warm-Up Playbook.</p>',
  },
  {
    title: 'Complete RacketLogic Library',
    slug: 'complete-library',
    description: 'Every current RacketLogic playbook in one purchase. The complete collection.',
    price: 59.99,
    category: 'Bundle',
    isBundle: true,
    featured: true,
    published: true,
    playbookSlugs: [
      'string-setup', 'racket-buying', 'tennis-shoe', 'warm-up', 'cool-down',
      'match-tactics', 'beginner-setup', 'club-player', 'grip-guide', 'nutrition-fuelling',
    ],
    previewContent: '<p>Includes all current RacketLogic playbooks.</p>',
  },
]
