/**
 * The Forsyth Group LLC - Identity, Role Governance & Tool Catalog Configuration
 * https://forsythgroup.org
 */

window.FG_CONFIG = {
  // Configurable Google OAuth 2.0 Web Client ID
  // Can be overridden via localStorage or in the /admin console
  defaultGoogleClientId: '761563137497-8gp00e2qdaqsh39j6snf5p3s7kqunvda.apps.googleusercontent.com',

  // Permanent Root Superadmins - automatically assigned ['Admin', 'Developer']
  // and immune to accidental deletion or lockout
  superadmins: [
    'eric@forsythgroup.org',
    'eric@wideareacomm.com'
  ],

  // Initial Seed Team Members
  initialUsers: [
    {
      email: 'eric@forsythgroup.org',
      name: 'Eric Forsyth',
      roles: ['Admin', 'Developer'],
      status: 'active',
      department: 'Architecture & Leadership',
      notes: 'Root Superadmin / Principal Enterprise Architect',
      isRootSuperadmin: true,
      addedAt: '2026-10-14T09:00:00.000Z'
    },
    {
      email: 'eric@wideareacomm.com',
      name: 'Eric Forsyth (WideAreaComm)',
      roles: ['Admin', 'Developer'],
      status: 'active',
      department: 'Executive Engineering',
      notes: 'Root Superadmin / Wide Area Communications',
      isRootSuperadmin: true,
      addedAt: '2026-10-14T09:00:00.000Z'
    }
  ],

  // Developer External Tools Catalog - Grouped by Provider
  toolGroups: [
    {
      id: 'google',
      provider: 'Google Developer Ecosystem',
      icon: 'google',
      description: 'Mobile distribution, cloud compute, Gemini AI models, and identity.',
      color: 'blue',
      tools: [
        {
          id: 'google-play-console',
          name: 'Google Play Console',
          subtitle: 'Android App Publishing & Tracks',
          url: 'https://play.google.com/console',
          badge: 'Mobile Releases',
          description: 'Manage production release tracks, closed beta tracks, app bundles, and Android Vitals for InvoiceCamp & PantryPlay.',
          relatedProjects: ['InvoiceCamp', 'PantryPlay', 'RegimenScout'],
          docsUrl: 'https://developer.android.com/distribute'
        },
        {
          id: 'google-ai-studio',
          name: 'Google AI Studio',
          subtitle: 'Gemini Models & API Keys',
          url: 'https://aistudio.google.com',
          badge: 'Gemini AI',
          description: 'Rapid prototyping, prompt engineering, multimodal testing, and Gemini 1.5/2.0 API key governance for HelpDx and RegimenScout.',
          relatedProjects: ['HelpDx', 'RegimenScout'],
          docsUrl: 'https://ai.google.dev'
        },
        {
          id: 'google-cloud-console',
          name: 'Google Cloud Platform (GCP)',
          subtitle: 'Cloud Infrastructure & IAM',
          url: 'https://console.cloud.google.com',
          badge: 'Enterprise Cloud',
          description: 'Manage GCP projects, Service Accounts, OAuth consent screens, API quotas, and Google Workspace cloud integrations.',
          relatedProjects: ['ForsythGroup.org', 'HelpDx', 'InvoiceCamp'],
          docsUrl: 'https://cloud.google.com/docs'
        },
        {
          id: 'google-firebase-console',
          name: 'Google Firebase Console',
          subtitle: 'Mobile Telemetry & Notifications',
          url: 'https://console.firebase.google.com',
          badge: 'Mobile Backend',
          description: 'Push notification routing, Cloud Messaging (FCM), Crashlytics, and mobile telemetry for Expo applications.',
          relatedProjects: ['InvoiceCamp', 'PantryPlay'],
          docsUrl: 'https://firebase.google.com/docs'
        },
        {
          id: 'google-workspace-admin',
          name: 'Google Workspace Admin',
          subtitle: 'Domain Governance & Security',
          url: 'https://admin.google.com',
          badge: 'Organization',
          description: 'Directory administration, security policies, DNS delegation, and user accounts for forsythgroup.org.',
          relatedProjects: ['ForsythGroup.org'],
          docsUrl: 'https://support.google.com/a'
        }
      ]
    },
    {
      id: 'apple',
      provider: 'Apple Developer Ecosystem',
      icon: 'apple',
      description: 'iOS distribution, TestFlight beta testing, certificates, and app store listings.',
      color: 'slate',
      tools: [
        {
          id: 'apple-app-store-connect',
          name: 'Apple App Store Connect',
          subtitle: 'iOS Distribution & Review',
          url: 'https://appstoreconnect.apple.com',
          badge: 'App Store',
          description: 'Manage iOS app listings, In-App Purchases, pricing, App Store reviews, and metadata for InvoiceCamp (org.forsythgroup.invcamp) and PantryPlay.',
          relatedProjects: ['InvoiceCamp', 'PantryPlay'],
          docsUrl: 'https://developer.apple.com/app-store-connect/'
        },
        {
          id: 'apple-developer-account',
          name: 'Apple Developer Account',
          subtitle: 'Certificates, Identifiers & Profiles',
          url: 'https://developer.apple.com/account/resources/certificates/list',
          badge: 'Credentials',
          description: 'Provisioning profiles, distribution certificates, App IDs, Apple Sign-In service keys, and push notification APNs keys.',
          relatedProjects: ['InvoiceCamp', 'PantryPlay'],
          docsUrl: 'https://developer.apple.com/account/'
        },
        {
          id: 'apple-testflight',
          name: 'TestFlight Beta Testing',
          subtitle: 'Internal & Public Builds',
          url: 'https://appstoreconnect.apple.com/apps',
          badge: 'Beta Testing',
          description: 'Distribute daily builds to internal testers and external beta user groups with real-time crash and feedback telemetry.',
          relatedProjects: ['InvoiceCamp', 'PantryPlay'],
          docsUrl: 'https://developer.apple.com/testflight/'
        }
      ]
    },
    {
      id: 'anthropic',
      provider: 'Anthropic Claude AI',
      icon: 'sparkles',
      description: 'Next-generation reasoning, agentic coding, Claude 3.5 Sonnet / Opus API, and prompt engineering.',
      color: 'amber',
      tools: [
        {
          id: 'claude-ai',
          name: 'Claude.ai Workspace',
          subtitle: 'Claude 3.5 Sonnet & Projects',
          url: 'https://claude.ai',
          badge: 'AI Assistant',
          description: 'Primary conversational workspace for team code planning, architecture design, and project knowledge artifacts.',
          relatedProjects: ['ForsythGroup.org', 'HelpDx', 'PantryPlay'],
          docsUrl: 'https://claude.ai'
        },
        {
          id: 'claude-platform',
          name: 'Anthropic Console (platform.claude.ai)',
          subtitle: 'API Keys & Model Workbench',
          url: 'https://platform.claude.ai',
          badge: 'API Platform',
          description: 'Anthropic developer platform, Claude API keys, prompt evaluation workbench, token monitoring, and rate limit governance.',
          relatedProjects: ['HelpDx', 'PantryPlay'],
          docsUrl: 'https://docs.anthropic.com'
        }
      ]
    },
    {
      id: 'openai',
      provider: 'OpenAI Developer Suite',
      icon: 'openai',
      description: 'GPT-4o APIs, text embeddings, vision assistants, and conversational research.',
      color: 'emerald',
      tools: [
        {
          id: 'openai-platform',
          name: 'OpenAI API Platform',
          subtitle: 'Model Dashboard & Keys',
          url: 'https://platform.openai.com',
          badge: 'LLM Platform',
          description: 'Manage OpenAI API keys, token usage, rate limits, and model playground for HelpDx and PantryPlay vision analysis.',
          relatedProjects: ['HelpDx', 'PantryPlay', 'pims-ai-resolver'],
          docsUrl: 'https://platform.openai.com/docs'
        },
        {
          id: 'chatgpt-workspace',
          name: 'ChatGPT Pro / Team',
          subtitle: 'Collaborative Reasoning',
          url: 'https://chatgpt.com',
          badge: 'AI Chat',
          description: 'Advanced data analysis, code refactoring, and prototype ideation.',
          relatedProjects: ['Research', 'Architecture'],
          docsUrl: 'https://help.openai.com'
        }
      ]
    },
    {
      id: 'github',
      provider: 'GitHub Source Control & CI/CD',
      icon: 'github',
      description: 'Source code repositories, automated pull requests, issue tracking, and GitHub Pages deployments.',
      color: 'zinc',
      tools: [
        {
          id: 'github-org',
          name: 'GitHub Organization (e4syth)',
          subtitle: 'All Forsyth Group Repositories',
          url: 'https://github.com/e4syth',
          badge: 'Version Control',
          description: 'Central organization profile with all active projects, branches, pull requests, and security alerts.',
          relatedProjects: ['All Projects'],
          docsUrl: 'https://docs.github.com'
        },
        {
          id: 'github-forsythgroup',
          name: 'ForsythGroup.org Repo',
          subtitle: 'e4syth/ForsythGroup.org',
          url: 'https://github.com/e4syth/ForsythGroup.org',
          badge: 'Repo',
          description: 'Enterprise website codebase, telemetry status monitor, and developer portal.',
          relatedProjects: ['ForsythGroup.org'],
          docsUrl: 'https://github.com/e4syth/ForsythGroup.org'
        },
        {
          id: 'github-invoicecamp',
          name: 'InvoiceCamp Repo',
          subtitle: 'e4syth/InvoiceCamp',
          url: 'https://github.com/e4syth/InvoiceCamp',
          badge: 'Repo',
          description: 'React Native + Expo SDK 52 mobile invoicing & customer portal application.',
          relatedProjects: ['InvoiceCamp'],
          docsUrl: 'https://github.com/e4syth/InvoiceCamp'
        },
        {
          id: 'github-helpdx',
          name: 'HelpDx Repo',
          subtitle: 'e4syth/HelpDx',
          url: 'https://github.com/e4syth/HelpDx',
          badge: 'Repo',
          description: 'Next.js 15 enterprise IT helpdesk PWA with PostgreSQL pgvector and Gemini integration.',
          relatedProjects: ['HelpDx'],
          docsUrl: 'https://github.com/e4syth/HelpDx'
        },
        {
          id: 'github-pantryplay',
          name: 'PantryPlay Repo',
          subtitle: 'e4syth/PantryPlay',
          url: 'https://github.com/e4syth/PantryPlay',
          badge: 'Repo',
          description: 'Mobile pantry management and AI recipe staging application.',
          relatedProjects: ['PantryPlay'],
          docsUrl: 'https://github.com/e4syth/PantryPlay'
        },
        {
          id: 'github-regimenscout',
          name: 'RegimenScout Repo',
          subtitle: 'e4syth/RegimenScout',
          url: 'https://github.com/e4syth/RegimenScout',
          badge: 'Repo',
          description: 'Clinical supplement & medication safety research tool with Gemini engine.',
          relatedProjects: ['RegimenScout'],
          docsUrl: 'https://github.com/e4syth/RegimenScout'
        },
        {
          id: 'github-acapalive',
          name: 'ACAPALive Repo',
          subtitle: 'e4syth/ACAPALive',
          url: 'https://github.com/e4syth/ACAPALive',
          badge: 'Repo',
          description: 'Full-stack cloud conference attendee & organizer PWA for A/CAPA.',
          relatedProjects: ['ACAPALive'],
          docsUrl: 'https://github.com/e4syth/ACAPALive'
        },
        {
          id: 'github-wideareacomm',
          name: 'WideAreaComm.com Repo',
          subtitle: 'e4syth/WideAreaComm.com',
          url: 'https://github.com/e4syth/WideAreaComm.com',
          badge: 'Repo',
          description: 'Wide Area Communications enterprise digital presence repository.',
          relatedProjects: ['WideAreaComm.com'],
          docsUrl: 'https://github.com/e4syth/WideAreaComm.com'
        }
      ]
    },
    {
      id: 'hosting',
      provider: 'Hosting & Mobile Build Pipelines',
      icon: 'cloud',
      description: 'Serverless deployment edge networks and automated mobile cloud compilation.',
      color: 'violet',
      tools: [
        {
          id: 'vercel-dashboard',
          name: 'Vercel Dashboard',
          subtitle: 'Serverless Edge Deployments',
          url: 'https://vercel.com/dashboard',
          badge: 'Edge Hosting',
          description: 'Production deployments, custom domains, edge functions, and telemetry for HelpDx, ACAPALive, RegimenScout, and InvoiceCamp.',
          relatedProjects: ['HelpDx', 'ACAPALive', 'RegimenScout', 'InvoiceCamp', 'PantryPlay'],
          docsUrl: 'https://vercel.com/docs'
        },
        {
          id: 'expo-eas-dashboard',
          name: 'Expo EAS Dashboard',
          subtitle: 'Expo Application Services',
          url: 'https://expo.dev',
          badge: 'Mobile CI/CD',
          description: 'Cloud native build server for iOS (.ipa) and Android (.aab/.apk), OTA updates, credentials, and app submission.',
          relatedProjects: ['InvoiceCamp', 'PantryPlay', 'RegimenScout'],
          docsUrl: 'https://docs.expo.dev/eas'
        }
      ]
    },
    {
      id: 'databases',
      provider: 'Databases & Cloud Storage',
      icon: 'database',
      description: 'Serverless PostgreSQL, real-time databases, and vector storage.',
      color: 'teal',
      tools: [
        {
          id: 'neon-console',
          name: 'Neon Serverless PostgreSQL',
          subtitle: 'Branching SQL Database',
          url: 'https://console.neon.tech',
          badge: 'Serverless DB',
          description: 'Instant database branching, serverless connection pooling, compute autoscaling, and metrics for InvoiceCamp and HelpDx.',
          relatedProjects: ['InvoiceCamp', 'HelpDx'],
          docsUrl: 'https://neon.tech/docs'
        },
        {
          id: 'supabase-dashboard',
          name: 'Supabase Dashboard',
          subtitle: 'Postgres, Realtime & Auth',
          url: 'https://supabase.com/dashboard',
          badge: 'Backend Suite',
          description: 'Managed PostgreSQL, Row Level Security (RLS) policies, Realtime websockets, and object storage for InvoiceCamp and PantryPlay.',
          relatedProjects: ['InvoiceCamp', 'PantryPlay'],
          docsUrl: 'https://supabase.com/docs'
        }
      ]
    },
    {
      id: 'identity-microsoft',
      provider: 'Microsoft Identity & Azure Cloud',
      icon: 'microsoft',
      description: 'Enterprise identity, single sign-on (SSO), app registrations, and cloud governance.',
      color: 'sky',
      tools: [
        {
          id: 'microsoft-entra',
          name: 'Microsoft Entra ID Admin Center',
          subtitle: 'Enterprise Identity & Governance',
          url: 'https://entra.microsoft.com',
          badge: 'Enterprise SSO',
          description: 'Manage directory tenants, enterprise app registrations, Conditional Access policies, SSO credentials, and user permissions.',
          relatedProjects: ['ForsythGroup.org', 'HelpDx'],
          docsUrl: 'https://learn.microsoft.com/entra/'
        },
        {
          id: 'azure-portal',
          name: 'Microsoft Azure Portal',
          subtitle: 'Cloud Subscriptions & Services',
          url: 'https://portal.azure.com',
          badge: 'Cloud Platform',
          description: 'Enterprise subscriptions, resource groups, storage accounts, and cloud monitoring across Forsyth Group Microsoft environments.',
          relatedProjects: ['Enterprise Infrastructure'],
          docsUrl: 'https://learn.microsoft.com/azure/'
        }
      ]
    },
    {
      id: 'payments',
      provider: 'Payments & Financial Operations',
      icon: 'credit-card',
      description: 'Credit card processing, recurring subscriptions, invoice links, and financial reconciliation.',
      color: 'indigo',
      tools: [
        {
          id: 'stripe-dashboard',
          name: 'Stripe Dashboard',
          subtitle: 'Billing, Invoices & Webhooks',
          url: 'https://dashboard.stripe.com',
          badge: 'Payments',
          description: 'Manage merchant accounts, live transaction webhooks, payment links, customer billing portals, and API keys for InvoiceCamp and PIMS.',
          relatedProjects: ['InvoiceCamp', 'RegimenScout', 'pims-ai-resolver'],
          docsUrl: 'https://stripe.com/docs'
        }
      ]
    },
    {
      id: 'monitoring',
      provider: 'System Monitoring & Observability',
      icon: 'activity',
      description: 'Real-time uptime checks, SSL monitoring, and public operational status badges.',
      color: 'rose',
      tools: [
        {
          id: 'uptimerobot-dashboard',
          name: 'UptimeRobot Dashboard',
          subtitle: 'Synthetic Monitors & Incidents',
          url: 'https://uptimerobot.com/dashboard',
          badge: 'Telemetry',
          description: 'Monitor synthetic heartbeats, HTTP response codes, SSL certificates, and incident alerts across all enterprise endpoints.',
          relatedProjects: ['ForsythGroup.org', 'status.forsythgroup.org', 'InvoiceCamp'],
          docsUrl: 'https://uptimerobot.com'
        },
        {
          id: 'forsyth-status-page',
          name: 'Forsyth Group System Status',
          subtitle: 'Live Operational Status',
          url: 'https://status.forsythgroup.org',
          badge: 'Public Status',
          description: 'Official enterprise status page reflecting live monitor health and incident history for clients and stakeholders.',
          relatedProjects: ['ForsythGroup.org', 'status.forsythgroup.org'],
          docsUrl: 'https://status.forsythgroup.org'
        }
      ]
    },
    {
      id: 'applications',
      provider: 'Live Forsyth Group Applications & Portals',
      icon: 'globe',
      description: 'Quick-access links to live production and staging web applications.',
      color: 'emerald',
      tools: [
        {
          id: 'app-forsythgroup',
          name: 'The Forsyth Group LLC',
          subtitle: 'Flagship Enterprise Portal',
          url: 'https://forsythgroup.org',
          badge: 'Production',
          description: 'Official website, enterprise software architecture, technology consulting portfolio, and client inquiries.',
          relatedProjects: ['ForsythGroup.org']
        },
        {
          id: 'app-acapalive',
          name: 'A/CAPA Live! Attendee PWA',
          subtitle: 'acapa.forsythgroup.org',
          url: 'https://acapa.forsythgroup.org',
          badge: 'Client Portal',
          description: 'Full-stack cloud conference attendee, session scheduler, and organizer evaluation application.',
          relatedProjects: ['ACAPALive']
        },
        {
          id: 'app-wideareacomm',
          name: 'Wide Area Communications',
          subtitle: 'wideareacomm.com',
          url: 'https://wideareacomm.com',
          badge: 'Partner Site',
          description: 'Telecommunications and digital infrastructure solutions portal.',
          relatedProjects: ['WideAreaComm.com']
        }
      ]
    }
  ]
};
