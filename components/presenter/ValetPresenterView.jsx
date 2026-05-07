import { useState } from "react";

const C = {
  greenDeep: "#1E3A2F", greenPrimary: "#2D4A3E", greenMid: "#3A6152", greenAccent: "#4A7A62",
  gold: "#C4A972", goldLight: "#D4BF92", goldDark: "#B8963E",
  cream: "#F5F0E8", creamDark: "#EBE3D5", warmWhite: "#FAF8F3",
  charcoal: "#2C2C2C", charcoalLight: "#3E3E3E", muted: "#8A8678", red: "#A0453A",
};

const sections = [
  {
    id: "cover",
    num: "00",
    label: "COVER",
    preview: {
      bg: C.greenDeep,
      title: "VALET",
      subtitle: "DRIVE MORE, STRESS LESS",
      details: ["$3.75M RAISING", "25% OFFERED", "Password gate below"],
    },
    track: [
      `Before we jump in I want to frame up the nature of the pitch. This isn't going to be a traditional slide deck — it's an interactive scrolling page. You'll be able to scroll through the entire thing on your own after this call — I'll share the password at the end. For now, I'm going to walk you through it live and give you the narrative around each section.`,
      `Let's get into it.`,
    ],
  },
  {
    id: "founder",
    num: "01",
    label: "THE FOUNDER",
    preview: {
      bg: C.cream,
      title: "WHO'S BEHIND THIS",
      subtitle: "Johnny (CEO) + Jens (CTO)",
      details: ["15yr tech GTM", "Borbone Wavecraft founder", "11 cars, 121% return", "Jens — most senior AI engineer at Supernal"],
    },
    track: [
      `So... who are we and why should you care?`,
      `Well first, I'm Johnny. I'm a serial entrepreneur across tech, SaaS, and AI. I've spent the last 15 years in founding and leadership roles building and scaling teams and go-to-market engines. Right now I'm part of the founding team at Supernal AI, where I've brought us to over $5M ARR in our first year. Before that, I was at Invisible Technologies during the scale from a $10 million run rate to a $120 million run rate — I owned the relationships with OpenAI, Anthropic, and Google that powered most of that growth. Before that, 10 years building teams across AdTech and Robotics.`,
      `Additionally, I've also built and scaled a consumer brand from the ground up. I'm the founder of Borbone Wavecraft — manufacturing handmade surf craft, owning and running two fiberglass factories, and thus becoming one of the highest-volume handshapers in the world, distribution on five continents.`,
      `Lastly and most importantly, I'm a car guy and always have been. Over the last 15 years, I've bought and sold 11 collector cars and I'm sitting at a 121% return on those investments. I currently own two classic European collectors. Every weekend I'm at a Cars & Coffee, a rally, or deep in a forum thread about a car I don't even own yet. The guys at my car storage facility ask me for opinions on what to buy and when to sell — I've kind of become that guy.`,
      `Valet is the culmination of my three worlds converging — tech, consumer brand building, and collector cars. The solution came directly from a problem my community and I have been dealing with every single day for years.`,
      `Jens is our CTO, cofounder and another serial entrepreneur. He's the Founder and CEO at Nettlio, an agentic AI automation agency. Additionally, he's the most senior AI platform engineer at Supernal where he's single-handedly built multiple enterprise-grade platforms in production use today, including the highest-volume market research platform for aviation brokerages in the world. Thus far he's owned the entire technical build of Valet's platform and infrastructure.`,
    ],
  },
  {
    id: "agenda",
    num: "",
    label: "AGENDA",
    preview: {
      bg: C.greenDeep,
      title: "AGENDA",
      subtitle: "",
      details: ["02 — The Moment", "03 — Market Opportunity", "04 — The Problem", "05 — The Solution", "06 — Revenue & Model", "07 — The Ask & Use of Funds"],
    },
    track: [
      `Here's how I'm going to walk you through this. I'm not starting with the problem — I'm starting with the opportunity. This specific market needs context before the gravity of the problem lands.`,
      `In essence, timing is creating an opportunity. That opportunity is massive. That opportunity has a problem. And then I'll show you exactly how we're solving it and how we're making money doing it.`,
    ],
  },
  {
    id: "moment",
    num: "02",
    label: "THE MOMENT + MARKET PROOF",
    preview: {
      bg: C.warmWhite,
      title: "THE TIMING COULDN'T BE BETTER",
      subtitle: "Monterey Car Week chart · Asset comparison chart · Q1 2026 auction records · Nuanced market callout",
      details: ["+52% Q1 YoY auction spend", "+118% auction market since '21", "$441M Mecum Kissimmee", "92–94% sell-through rates", "Collector cars outpacing S&P + real estate"],
    },
    track: [
      `So why is now the time to even be doing this? There's a generational collision happening in this market that nobody predicted. The guys who grew up watching Top Gear and Fast & Furious are now in their peak earning years, and they're buying the cars they dreamed about as teenagers. And Gen Z is filling in behind them even faster than anticipated — they're the first digitally native generation of car enthusiasts, and they're treating collector cars as both lifestyle and content.`,
      `And if you think about the macro landscape — public equities and credit instruments have been rocky for years. There's so much retail investment in stocks right now, not because stocks are all that great, but because there's nowhere else to put money. Our generation is gravitating toward alternative assets — wine, watches, cars — and collector cars are quietly one of the best-performing alternative asset classes out there. An SL Gullwing or 250 GTO bought in the '60s is a 5x better return than gold, dollar for dollar.`,
      `And this isn't a speculative thesis — the growth numbers are pretty staggering. Q1 auction spend is up 52% year-over-year. The total auction market is up 118% since 2021. And over the last five years, the collector car market has roughly doubled in total transaction volume. This is a market that is accelerating, not plateauing.`,
      `Two quick proof points, and these are both industry-understood proxies. Monterey Car Week is the litmus test — biggest collector car event in the world. This chart shows the trajectory with attendance and ticket prices climbing consistently. And the Hagerty Index shows collector cars outpacing both the S&P and US real estate over the last 15 years.`,
      `And 2026 has been an absolutely insane year. Mecum Kissimmee did $441 million, which is the most successful collector car auction in history. Sell-through rates used to be 60 to 75 percent — now they're consistently in the 90s across every major house. Multiple world records broken just in the last couple of months.`,
      `Now here's the really interesting part. Historically, investing in cars was pretty formulaic — you knew the depreciation curves for each brand, and you could forecast your year-over-year return with decent confidence. That's completely out the door now. The emotional purchasing behavior of millennials and Gen Z is forcing the market into much more nuanced micro-sectors. Things that were cool when we were young — like the Carrera GT, because of Paul Walker — are severely outpacing traditional appreciation trends for that engine type and era.`,
      `What that means is that a collector trying to make a buy, hold, or sell decision can no longer rely on the old playbook. They need to understand what's happening with their specific car in their specific segment. And no tool in the market — including LLMs — can track and forecast on that level of niche volatility. That's exactly the gap we're filling.`,
    ],
  },
  {
    id: "market",
    num: "03",
    label: "MARKET OPPORTUNITY",
    preview: {
      bg: C.cream,
      title: "HOW BIG IS THIS MARKET?",
      subtitle: "",
      details: ["~50M+ reachable enthusiast audience", "4.9M active paid subscribers on legacy forums", "$77/yr avg forum price", "VALET: $2/mo ($24/yr)"],
    },
    track: [
      `So how big is this market? To answer it lightly — it's massive.`,
      `The left card is our reachable audience — those are de-duplicated subscriber numbers across the automotive influencer ecosystem. People actively engaging with collector-grade content about what to buy, how to maintain, regional investment strategies. The audience is significantly larger than most people realize.`,
      `The right card is the one that blew my mind. There are millions of people already paying about $77 a year to be on legacy forums — FerrariChat, Rennlist, LotusTalk. These are old-school, Geocities-looking chat forums that are ad-heavy, not localized, and not event-driven. And people are still paying real money to be on them.`,
      `That's the key insight: they already accept "pay to belong." We're just offering a dramatically better version of that at a fraction of the cost.`,
      `Keep these numbers in your head — our Year 1 assumption is 50,000 paid subscribers, which is about 1% of the existing paid community market. Extremely conservative.`,
    ],
  },
  {
    id: "problem",
    num: "04",
    label: "THE PROBLEM",
    preview: {
      bg: C.cream,
      title: "EVERY COLLECTOR HAS THE SAME TWO PRIORITIES",
      subtitle: "Priority 1: Managing Ownership · Priority 2: Enjoying the Car · The Gap",
      details: ["Valuations without context", "Maintenance black box", "No true return visibility", "Fragmented social infrastructure"],
    },
    track: [
      `Now that you have the framing of who's collecting, how big the market is, and why the timing is right — I'll actually articulate the problem. From the perspective of me and my peers as active collectors in the market right now, it's really really really hard and really really really frustrating to actually do this well. The tools are completely fragmented — and I use the term "tools" lightly, because manila folders still count as a tool in this industry.`,
      `Every collector has the same two priorities. Let me give you the real version of what these feel like.`,
      `Priority one is the operational side — managing the ownership. The stress of owning a collector car isn't writing the check, it's the years after the check. Am I up or am I down? When's the next service, and is it going to cost me four grand or eight grand? Is spending that money going to protect my value or is it just a sunk cost? Nobody can answer those questions with confidence right now. Hagerty gives you a directional number that doesn't account for your specific spec. KBB is 30-plus percent off, and most collector VINs don't even return results at all. There's no forward-looking anything — you're Googling service intervals and getting maybe 25% of the information you need.`,
      `I know guys personally who've been talking about buying a vintage Ferrari or a 911 for over a year and still haven't pulled the trigger. Not because they can't afford it, but because they don't have the confidence to know what they're getting into. The uncertainty is the barrier.`,
      `Priority two is the social side — actually enjoying the car. I'm on five different forums and there's still no way for me to know who's going to what Cars & Coffee in Malibu this weekend. And nine times out of ten, I miss it. Every enthusiast has lived this moment: you park next to someone with an incredible build, talk for an hour, totally hit it off — and then leave without exchanging info. There's just no infrastructure to reconnect through the cars you share.`,
      `The callout at the bottom of this section is the key point. Those are two very different problems — one operational, one social — and nobody has connected them. Every tool treats them as separate. We don't think they are.`,
    ],
  },
  {
    id: "solution",
    num: "05",
    label: "THE SOLUTION",
    preview: {
      bg: C.greenDeep,
      title: "VALET — DRIVE MORE, STRESS LESS",
      subtitle: "Side-by-side: Garage (FREE) + Communities ($2/mo) · Critical Insight reframe",
      details: ["VIN-powered platform", "Real-time FMV + 5yr forecast", "Carrying-cost curve + maintenance roadmap", "VIN-driven community placement", "Event-photo tagging + social network"],
    },
    track: [
      `Enter Valet. Drive more, stress less.`,
      `This is a gap that hasn't been filled across any industry or sector, not just automotive. Robinhood doesn't connect you with other investors in your area buying the same stocks. Chrono24 doesn't connect watch collectors who own the same references in the same city — they're just marketplaces, not communities. Nobody has married the ability to invest in something with the ability to enjoy what you invested in alongside people who share that interest. That's what we do.`,
      `The two halves are on screen — Garage on the left, Communities on the right. Everything starts when you enter your VIN.`,
      `Garage is free, and it's our wedge. Your VIN generates a full financial ownership profile within seconds — real-time fair market value, 5-year forward projection, carrying-cost curve, and maintenance roadmap. All specific to your exact car, mileage, location, and condition. It's important to mention that two of these insights we've created now exist for the first time in the industry — specifically the carrying costs and maintenance-to-value alignment.`,
      `Here's a real example. I spent $4,200 in December on a belt service and tires for my 360. It felt like sunk cost — I was not liquid, my dog had just gotten sick, I was bummed about spending the money. But Valet had forecasted that service, and the framing was completely different: that $4,200 protects $12,000 in upcoming appreciation, keeping me on-track for a 20% net return by end of year. Same money spent. Completely different perception of it.`,
      `And that's just one service on one car. Our projections factor in the full cost of ownership across different maintenance scenarios, and show how each scenario impacts the long-term value trajectory. Before you even buy the car, you can see what the next five years look like — what's coming, what it costs, and what your net return is if you stay on top of it versus defer. That turns ownership from a black box into something predictable. And that's what takes those guys from the problem section — the ones who've been talking about buying a Ferrari or 911 for a year — and gives them the confidence to actually do it. The uncertainty was the barrier. We remove it.`,
      `Communities section is $2 a month. Your VIN that you used to populate your garage then auto-places you into these local communities for the marques you own. These communities are organized around real-world events, not just forum threads. You show up to events, meet owners, take photos, tag the cars you see, and those photos flow back into their owners' garages. Your garage becomes a living record of everywhere you've been and everyone you've connected with.`,
      `And here's what excites me most from a growth perspective — that photo tagging is inherently viral. When you tag someone's car, they get a notification. If they're not on Valet, that's an organic invitation to join. Every event creates dozens of these moments, every tag pulls new users in without us spending a dollar. So alongside the influencer engine we'll discuss in a minute, we have a built-in organic growth loop baked into how people use the product.`,
      `And the pricing delta tells the story — $24 a year versus $77 for legacy forums.`,
    ],
  },
  {
    id: "competition",
    num: "06",
    label: "COMPETITIVE BENCHMARK",
    preview: {
      bg: C.cream,
      title: "HOW VALET STACKS UP",
      subtitle: "Interactive filterable table · Feature dots · Coverage score bars",
      details: ["Valet: 97% valuation accuracy", "Hagerty: ~85%", "KBB: 71% · Edmunds: 70%", "100% collector VIN coverage", "Hand-built proprietary knowledge corpus"],
    },
    track: [
      `So, I know that the product sounds differentiated and defensible, but does it actually work and to what degree? Well, this table is every platform in the space, and you can filter it by category. What you'll notice is that the dot pattern is sparse for everybody except us. Each of these platforms does one or two things reasonably well and then completely drops off. The reason collectors are currently using five or six different tools is simply that nobody has unified the full picture.`,
      `But the accuracy numbers are what really matter. We've benchmarked across hundreds of VINs against recent auction results, and we're at 97% valuation accuracy. Hagerty is second. KBB and Edmunds are in the low 70s, and most collector VINs don't even return results on those platforms.`,
      `The reason we're this accurate is important, and it's also why this is defensible. There are really two layers to it. The first is the data layer — we're actively building what we call "markets" by aggregating ongoing market data across live auctions, dealer platforms, and marketplaces. We have five years of historical transaction data in retro that gives us a deep foundation for understanding where values have been and where they're trending. That data layer alone puts us ahead of most platforms in the space.`,
      `But the second layer is what makes us truly unique. On top of that data, I've hand-built a proprietary knowledge corpus for each brand we cover — 50 to 70 page indexes, about 10 hours per brand — that captures market temperature, generational demand, cultural significance, and model-specific appreciation curves. These indexes are continuously maintained as market dynamics shift, because the trends in this market are not static. What was appreciating six months ago might be flat today, and something nobody was watching might be surging because of a cultural moment that traditional data sources haven't caught up to yet. The combination of the historical data layer and the hand-built indexes on top is what gives us exponentially more accurate valuation forecasts than any other platform.`,
      `And this is something an LLM fundamentally cannot replicate. If you prompt Claude or GPT for buying trend data, they'll pull whatever they can scrape online, but that data doesn't capture the real-time cultural component of how our generation is actually purchasing. LLMs are still telling you the Ferrari 360 Challenge Stradale is appreciating at a steady historical rate — they have no idea that Sam Fane's acquisition and the Bachman collection sale have completely reset the ceiling for that model. That kind of signal lives in the culture and in the auction rooms, not in the training data.`,
      `My indexes capture exactly that kind of nuance, and they're updated as these dynamics evolve. It's a living intelligence layer that requires deep domain expertise to create and maintain. No competitor has this, and no amount of compute can replicate it without the human knowledge sitting underneath. That's what powers the 97%.`,
    ],
  },
  {
    id: "demo",
    num: "07",
    label: "PRODUCT DEMO",
    preview: {
      bg: C.greenDeep,
      title: "SEE VALET IN ACTION",
      subtitle: "Live product demo or pre-loaded walkthrough",
      details: ["Real production app — not Figma", "VIN entry → financial profile", "Auto-community placement", "Paywall → $2/mo conversion"],
    },
    track: [
      `I want to show you the actual product, and I'm going to hand it over to Jens to walk you through it. What you're about to see is not a Figma mockup — this is our actual production application. We've spent real money building this over the last several months, which is part of why I'm framing this as seed-plus rather than pre-seed.`,
      `Jens, take it away.`,
      `[JENS DEMO WALKTHROUGH]`,
      `[Garage: vehicle card → FMV → forecast → carrying costs → maintenance roadmap → insights]`,
      `[Communities: auto-placed communities → events feed → photo tagging → member profiles]`,
      `[Paywall: notification flow → $2/mo conversion → immediate access]`,
    ],
  },
  {
    id: "revenue",
    num: "08",
    label: "REVENUE & FINANCIAL MODEL",
    preview: {
      bg: C.greenDeep,
      title: "HOW VALET MAKES MONEY",
      subtitle: "Pricing ladder · Unit economics · 5-year model with toggle",
      details: ["Y1: $2/mo → Y5: $5/mo", "$0.40 per new car added", "Capital Preservation: $25.5M ARR / 89% margin by Y5", "Blitzscaling: $49.5M ARR / 54% margin by Y5"],
    },
    track: [
      `How are we going to make money.`,
      `First, I want to point out the toggle on the model below. We've built two scenarios — Capital Preservation, where we bank profit, gets us to $25.5 million ARR by Year 5 at an 89% operating margin. Blitzscaling, where we redeploy 40% of revenue into distribution, gets us to nearly $50 million ARR at a 54% margin. Both are profitable, and the choice between them is a lever we can pull based on what the early data tells us.`,
      `Communities is $2 a month at launch, and it steps up over the next few years. This is a Netflix subscription model — start low, reach critical mass, then ratchet up as we add features and switching costs compound. The plan at minimum is to reach $7 a month per user by Year 5, but we may end up accelerating that timeline if market conditions permit.`,
      `Why start at $2 and not higher? I learned this the hard way at Supernal. We priced mid-market from day one and now we have a volume problem — revenue concentrated on three or four logos with 30% churn. I'd rather reach critical mass and then increase price from a position of strength. Once someone has entered their vehicles, built their garage, and joined communities, they're not leaving.`,
      `Now remember the market numbers from a few minutes ago. 50 million enthusiasts, 5 million already paying for forums. Our Year 1 assumption is 50,000 paid subscribers, which is 1% of the existing paid market. And that's modeled at a 1 to 2% conversion rate on influencer marketing, which for context is well below the industry average — influencer conversion typically runs 2 to 5%, and enthusiast verticals tend to outperform even that. So our 1% assumption is genuinely the floor.`,
    ],
  },
  {
    id: "captable",
    num: "09",
    label: "CAP TABLE",
    preview: {
      bg: C.cream,
      title: "PROACTIVE DILUTION",
      subtitle: "Post-Close · Fully Diluted = 10M shares",
      details: ["Johnny: 36%", "Jens: 24%", "Option Pool: 15%", "Investors: 25%", "$1.50/share · Delaware C-Corp · Pulley"],
    },
    track: [
      `We're diluting proactively. I've been through this before, and I know that trying to retain too much ownership too early is a mistake. If I don't dilute now, I'll be diluting 12 months from now at way worse terms.`,
      `So, it's a 60/40 founder split between myself and Jens, with a 15% option pool reserved post-money and 25% offered to investors at $1.50 a share once converted.`,
    ],
  },
  {
    id: "ask",
    num: "10",
    label: "THE ASK",
    preview: {
      bg: C.cream,
      title: "WE'RE RAISING $3.75M",
      subtitle: "$15M post-money · 25% investor ownership",
      details: ["Seed round (equity)", "$11.25M pre-money", "Core principle: full cycle without re-raising", "Angel-heavy strategy"],
    },
    track: [
      `We're raising $3.75 million for 25% total investor ownership.`,
      `The core principle is that this raise covers everything from build through launch through proving retention, without us having to go back out and fundraise in six months.`,
      `I want to give you some context on why we're doing this. Jens and I are currently at Supernal, which is a rocketship — we hit $5 million ARR in year one and we're on track to double that in year two. At just over 4 months into year 2, we're already at 6.2M ARR. I'm incredibly proud of what we're building there. But Valet is where our real passion is, and more importantly, it's where the intersection of our unique experiences, skills, and domain knowledge makes us most impactful. Supernal is an incredible business, but we believe Valet is more defensible, more unique, and has significantly more upside — and it sits at the exact center of everything we know and care about. We're both taking meaningful pay cuts to do this because we genuinely believe this is the bigger opportunity. Essentially, we're leaving a potential billion dollar business to build what we know will be a multi-billion dollar business.`,
      `The raise number is confidently conservative — we know it's the bare minimum of what we need. Nothing is inflated, we're being extremely lean with salaries, and every dollar has a clear purpose, which you'll see in the next section.`,
      `Let me show you exactly where it all goes.`,
    ],
  },
  {
    id: "funds",
    num: "11",
    label: "USE OF FUNDS",
    preview: {
      bg: C.greenDeep,
      title: "WHERE EVERY DOLLAR GOES",
      subtitle: "Interactive donut · Y1/Y2 toggle · Click-to-expand categories",
      details: ["Team: 31% — $575K/yr", "Distribution: 33% — $745K (Y1)", "Product + Data: 14% — $225K", "Contractors + G&A: 22% — $350K"],
    },
    track: [
      `Here's where every dollar goes. You can toggle between Year 1 and Year 2, and click into any category for the detailed breakdown.`,
      `Team and salary is 31% — that's me, Jens, and one data infrastructure engineer. Again, we're being what we feel to be extremely lean with salaries.`,
      `Distribution is 33% in Year 1, which is $745K. This is our influencer engine — four flagship partnerships at $125K each, six mid-tier at $25K, six micro-niche at $8K for specific marques and metros, plus event activations. I'm deeply familiar with this process and I already have relationships with a lot of the influencers we'll be working with. So this is really already a 'known known' for us.`,
      `Product and data infra is 14% — staged infrastructure costs, expanding the knowledge corpus, and reliability tooling.`,
      `Contractors and G&A is 22% — UX polish, legal, bookkeeping. Contractors are a deliberate lever to move fast without premature full-time headcount.`,
      `Year 2 shifts toward performance-based influencer terms — lower base, higher conversion kickers — and marketing efficiency improves as the organic flywheel starts contributing.`,
      `Total is $1.90M in Year 1, $1.85M in Year 2. $3.75M.`,
    ],
  },
  {
    id: "milestones",
    num: "12",
    label: "MILESTONES",
    preview: {
      bg: C.greenDeep,
      title: "WHAT THIS MONEY BUYS",
      subtitle: "Visual timeline: 4 phases",
      details: ["0–6 mo: Production Readiness", "6–12 mo: Launch + Retention Proof", "12–24 mo: Scale", "24–36 mo: Durable Platform Optionality"],
    },
    track: [
      `What does this money actually buy us? Four phases.`,
      `First six months is about getting from good to great. The product works, you saw it. We need to harden the infrastructure, upgrade to production-grade data sources, build out enterprise LLM licensing for cost-efficient scaling, and expand brand coverage beyond the initial seven.`,
      `Six to twelve months is launch and retention proof. This is where we flip the switch on the influencer engine and obsess over one question: do people stick? If we can prove retention, everything else follows.`,
      `Twelve to twenty-four months is straightforward scaling — more regions, more brands, smarter notifications, and optimizing unit economics at volume.`,
      `And then twenty-four to thirty-six months is where it gets really interesting — that's when we start building enterprise partnerships with auction houses, insurance companies, and OEMs. We can target specific owners who are buying assets similar to what Mecum or Broad Arrow are selling in upcoming auctions. Jens and I sell enterprise applications all day at Supernal, so that translation is very natural for us.`,
    ],
  },
  {
    id: "closing",
    num: "",
    label: "CLOSING",
    preview: {
      bg: C.greenDeep,
      title: "DRIVE MORE, STRESS LESS",
      subtitle: "$3.75M SEED · LET'S TALK · VALET.APP",
      details: ["50M+ enthusiasts", "5M already paying", "Record-breaking market", "Working product · Proven timing"],
    },
    track: [
      `So to bring it all together — you've seen the timing, you've seen the market, you've seen the problem, you've seen the product, and you've seen the math.`,
      `There are over 50 million people in this ecosystem, nearly 5 million already paying for tools that haven't been updated in 20 years, and a market that just had the biggest quarter in its history. We built something that actually works, and we're raising $3.75 million to take it to production, launch it, and prove that people stay.`,
      `I'd love to open it up for questions.`,
    ],
  },
  {
    id: "qa",
    num: "",
    label: "Q&A PREP",
    preview: {
      bg: C.charcoal,
      title: "ANTICIPATED QUESTIONS",
      subtitle: "Have these answers ready",
      details: ["Why not charge more?", "Plan B if full raise isn't available?", "How is accuracy so much better?", "Adjacent markets?", "Enterprise play?", "Defensibility?"],
    },
    track: [
      `"WHY AREN'T YOU CHARGING MORE?" — Hit critical mass first. Learned from Supernal — we priced mid-market and now have revenue concentration and 30% churn. Netflix model: start at $2, reach critical mass, ratchet up with new features. Switching costs compound once someone has invested time entering their vehicles. It's like leaving Spotify after building all your playlists.`,
      `"PLAN B IF FULL RAISE ISN'T AVAILABLE?" — Honestly, this is only worth doing if we can truly do it. We're leaving what we believe is a billion-dollar business. The number I'm showing is the conservative baseline — bare minimum. That said, if we need to phase it, first tranche covers salaries and the influencer engine to hit launch. Infra and contractor spend are the most flexible levers.`,
      `"HOW IS YOUR ACCURACY SO MUCH BETTER?" — Elbow grease. Hand-built proprietary knowledge corpus — 50 to 70 page indexes per brand, ~10 hours each. Rationalizes trends based on market temperature, generational demand, and model-specific curves. Captures nuance that LLMs can't — like the Carrera GT surpassing the LFA because of the Paul Walker cultural moment.`,
      `"ADJACENT MARKETS — WATCHES, WINE?" — The adjacency is obvious. Serial number-based ownership intelligence for watches is essentially the same architecture. But we're focused on cars first — that's where my domain expertise is deepest. Once the platform and playbook are proven, expansion into watches is a copy-paste with a new knowledge base. I'm a watch guy too, so I've already thought about this.`,
      `"ENTERPRISE PLAY?" — Consumer first, enterprise second. Build reputation and proprietary dataset through consumer platform over 18 months. Then transition into partnerships with auction houses and insurance companies. We have the ability to target specific owners purchasing similar assets to what they're selling in upcoming auctions. Jens and I build enterprise applications all day at Supernal — very natural translation.`,
      `"DEFENSIBILITY?" — Three moats. (1) Proprietary knowledge corpus — hand-built, continuously updated, not replicable by prompting an LLM. (2) VIN-level data from private owners — nobody else captures this at scale; the only way to get it is if they give it to you. (3) Community network effects — once you have density in a local marque community, it becomes self-reinforcing.`,
    ],
  },
];

function Badge({ size = 32 }) {
  return <svg width={size} height={size * 0.75} viewBox="0 0 64 48" fill="none"><text x="0" y="38" fontFamily="'Saira Extra Condensed', sans-serif" fontWeight="800" fontStyle="italic" fontSize="44" fill={C.gold}>V</text><text x="28" y="38" fontFamily="'Saira Extra Condensed', sans-serif" fontWeight="800" fontStyle="italic" fontSize="44" fill={C.gold} opacity="0.55">/</text><text x="36" y="38" fontFamily="'Saira Extra Condensed', sans-serif" fontWeight="800" fontStyle="italic" fontSize="44" fill={C.gold} opacity="0.3">/</text><text x="44" y="38" fontFamily="'Saira Extra Condensed', sans-serif" fontWeight="800" fontStyle="italic" fontSize="44" fill={C.gold} opacity="0.12">/</text></svg>;
}

function SectionCard({ section, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "14px 18px",
        background: isActive ? C.greenPrimary : C.warmWhite,
        borderRadius: 8,
        cursor: "pointer",
        border: `1px solid ${isActive ? C.gold + "66" : C.creamDark}`,
        borderLeft: isActive ? `3px solid ${C.gold}` : `3px solid transparent`,
        transition: "all 0.2s ease",
        marginBottom: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {section.num && (
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isActive ? C.gold : C.muted, letterSpacing: 1, flexShrink: 0 }}>{section.num}</span>
        )}
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: isActive ? C.cream : C.charcoal, fontWeight: isActive ? 500 : 400 }}>{section.label}</span>
      </div>
    </div>
  );
}

function DeckPreview({ preview }) {
  const isDark = preview.bg === C.greenDeep || preview.bg === C.charcoal;
  return (
    <div style={{
      background: preview.bg,
      borderRadius: 10,
      padding: "28px 24px",
      border: `1px solid ${isDark ? C.greenMid + "44" : C.creamDark}`,
      minHeight: 180,
      position: "relative",
      overflow: "hidden",
    }}>
      {isDark && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 40%, ${C.greenMid}33 0%, transparent 60%)` }} />}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Badge size={24} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: isDark ? C.goldLight : C.muted, letterSpacing: 1 }}>DECK PREVIEW</span>
        </div>
        <div style={{
          fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic",
          fontSize: "clamp(20px, 3vw, 28px)", color: isDark ? C.cream : C.greenDeep,
          lineHeight: 1.1, textTransform: "uppercase", marginBottom: 6,
        }}>{preview.title}</div>
        {preview.subtitle && (
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12.5, color: isDark ? C.creamDark : C.charcoalLight, lineHeight: 1.5, marginBottom: 12 }}>{preview.subtitle}</div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {preview.details.map((d, i) => (
            <span key={i} style={{
              padding: "4px 10px", borderRadius: 20, fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              background: isDark ? C.greenPrimary : C.cream,
              color: isDark ? C.goldLight : C.charcoalLight,
              border: `1px solid ${isDark ? C.greenMid + "44" : C.creamDark}`,
            }}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TalkTrack({ paragraphs }) {
  return (
    <div>
      {paragraphs.map((p, i) => {
        const isStage = p.startsWith("[");
        return (
          <div key={i} style={{
            padding: isStage ? "8px 14px" : "0 0 14px",
            fontFamily: isStage ? "'DM Mono', monospace" : "'Outfit', sans-serif",
            fontSize: isStage ? 12 : 14.5,
            color: isStage ? C.gold : C.charcoalLight,
            lineHeight: 1.7,
            background: isStage ? C.greenDeep + "08" : "transparent",
            borderRadius: isStage ? 6 : 0,
            borderLeft: isStage ? `2px solid ${C.gold}44` : "none",
            marginBottom: isStage ? 8 : 0,
            fontStyle: isStage ? "italic" : "normal",
          }}>
            {p.startsWith('"') ? (
              <span><span style={{ fontWeight: 600, color: C.greenDeep }}>{p.split('—')[0]}—</span>{p.split('—').slice(1).join('—')}</span>
            ) : p}
          </div>
        );
      })}
    </div>
  );
}

export default function PresenterView() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = sections[activeIdx];

  return (
    <div style={{ background: C.cream, minHeight: "100vh", fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Saira+Extra+Condensed:ital,wght@0,100;0,800;1,100;1,800&family=Saira:ital,wght@0,100;0,400;1,100&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{
        background: C.greenDeep, padding: "14px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: `1px solid ${C.greenMid}33`,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Badge size={28} />
          <span style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 18, color: C.cream, letterSpacing: 1 }}>PRESENTER VIEW</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
            disabled={activeIdx === 0}
            style={{
              padding: "6px 14px", borderRadius: 6, border: `1px solid ${C.greenMid}`,
              background: "transparent", color: activeIdx === 0 ? C.greenMid : C.cream,
              fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: activeIdx === 0 ? "default" : "pointer",
            }}
          >← PREV</button>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.goldLight, minWidth: 50, textAlign: "center" }}>
            {activeIdx + 1} / {sections.length}
          </span>
          <button
            onClick={() => setActiveIdx(Math.min(sections.length - 1, activeIdx + 1))}
            disabled={activeIdx === sections.length - 1}
            style={{
              padding: "6px 14px", borderRadius: 6, border: `1px solid ${C.greenMid}`,
              background: "transparent", color: activeIdx === sections.length - 1 ? C.greenMid : C.cream,
              fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: activeIdx === sections.length - 1 ? "default" : "pointer",
            }}
          >NEXT →</button>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 52px)" }}>
        {/* SIDEBAR NAV */}
        <div style={{
          width: 220, flexShrink: 0, padding: "16px 12px",
          background: C.warmWhite, borderRight: `1px solid ${C.creamDark}`,
          overflowY: "auto", maxHeight: "calc(100vh - 52px)", position: "sticky", top: 52,
        }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.muted, letterSpacing: 2, marginBottom: 12, padding: "0 6px" }}>SECTIONS</div>
          {sections.map((s, i) => (
            <SectionCard key={s.id} section={s} isActive={i === activeIdx} onClick={() => setActiveIdx(i)} />
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, padding: "28px 32px", maxWidth: 900, overflowY: "auto", maxHeight: "calc(100vh - 52px)" }}>
          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            {active.num && (
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: C.gold, letterSpacing: 2 }}>{active.num}</span>
            )}
            {active.num && <div style={{ height: 1, width: 32, background: C.gold + "66" }} />}
            <span style={{ fontFamily: "'Saira Extra Condensed', sans-serif", fontWeight: 800, fontStyle: "italic", fontSize: 24, color: C.greenDeep, textTransform: "uppercase" }}>{active.label}</span>
          </div>

          {/* Deck preview */}
          <DeckPreview preview={active.preview} />

          {/* Talk track */}
          <div style={{
            marginTop: 24, padding: "24px 28px",
            background: C.warmWhite, borderRadius: 10,
            border: `1px solid ${C.creamDark}`,
            borderLeft: `3px solid ${C.goldDark}`,
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.gold,
              letterSpacing: 2, marginBottom: 16, textTransform: "uppercase",
            }}>TALK TRACK</div>
            <TalkTrack paragraphs={active.track} />
          </div>

          {/* Nav buttons bottom */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingBottom: 40 }}>
            <button
              onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
              disabled={activeIdx === 0}
              style={{
                padding: "10px 20px", borderRadius: 8,
                border: `1px solid ${activeIdx === 0 ? C.creamDark : C.greenMid}`,
                background: activeIdx === 0 ? C.cream : C.greenDeep,
                color: activeIdx === 0 ? C.muted : C.cream,
                fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: activeIdx === 0 ? "default" : "pointer",
              }}
            >← {activeIdx > 0 ? sections[activeIdx - 1].label : ""}</button>
            <button
              onClick={() => setActiveIdx(Math.min(sections.length - 1, activeIdx + 1))}
              disabled={activeIdx === sections.length - 1}
              style={{
                padding: "10px 20px", borderRadius: 8,
                border: `1px solid ${activeIdx === sections.length - 1 ? C.creamDark : C.gold + "44"}`,
                background: activeIdx === sections.length - 1 ? C.cream : C.greenDeep,
                color: activeIdx === sections.length - 1 ? C.muted : C.gold,
                fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: activeIdx === sections.length - 1 ? "default" : "pointer",
              }}
            >{activeIdx < sections.length - 1 ? sections[activeIdx + 1].label : ""} →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
