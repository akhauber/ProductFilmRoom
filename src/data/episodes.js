// Sorted newest-first. id is the canonical episode number.
export const episodes = [
  {
    id: 3,
    episode: "EP. 003",
    title: "Ramp's Strategic Insight",
    spineTitle: "RAMP VS BREX",
    subtitle: "The vision that enabled Ramp to surpass Brex in the startup card market",
    description: "From 2018 to 2021, Brex was the default corporate card for funded startups. Then Ramp launched, hit a $32B valuation, and 4,200 companies switched over. Here's the product insight that made it happen.",
    date: "2026-04-28",
    substackUrl: "https://productfilmroom.substack.com",
    graphicPath: "/graphics/ep003.png",
    charts: {
      CHART1: { src: "/charts/ep003-valuation.html" },
      CHART2: { src: "/charts/ep003-venn.html" },
    },
    content: `From 2018 to 2021, if you were building a tech company, Brex was the go-to corporate card. Its strategy to give credit based on funds in the bank account rather than spending history, combined with rewards tailored toward founders, made it the default for highly funded startups. It became the card recommended by accelerators like Y Combinator and a16z, and its customer list included Robinhood, DoorDash, Zoom, and many of the hottest companies in tech.

However, Ramp launched in 2020 and shook up the corporate card space. It currently sits at a $32 billion valuation, worth over 6x Brex, which just sold to Capital One for $5.15 billion. Over 4,200 companies have switched directly from Brex to Ramp. The reason Ramp was able to take over so much of the market was because they saw beyond what founders needed in the moment and were building for what they were trying to become.
[CHART1]
When building a product, the first fundamental is finding the core problem your user has. Ramp took that a step further and redefined who the user was.

Brex and Ramp were building in a similar space, both aimed at startup companies. Brex found that startups' biggest problem was they had millions in funding but couldn't get approved for a corporate card because they had no spending history. To solve that, they fine-tuned their underwriting to approve companies traditional banks wouldn't, and geared rewards toward what founders spent more money on, such as travel, dining, and software.

However, Ramp had a different insight. As a company developed past that early stage, founders stopped caring about getting approved and cared more about where the money was going. Instead of building for seed round startups, Ramp identified that the most profitable customer was actually a slightly more established startup that had a different pain point, cutting costs as their company grew. So they built software around that problem. It flagged duplicate subscriptions, blocked out-of-policy purchases, and gave finance teams a better view of company spend. Ramp positioning itself as the card for more operationally mature companies gave it an air of prestige. The phrase "graduate to Ramp" spread organically through startup communities, carrying the implication that a Ramp customer had moved out of the pitching and traveling phase and into something more stable and deliberate.

Ramp's product decision to save companies money rather than persuade them to spend more was also monumental. Credit card companies always designed rewards programs that increased spending because more spend means more revenue for the card issuer. Ramp's software audits your spending and helps you cut it. They made the decision to build like a software company where the user's pain point drives the product decision.
[CHART2]
Brex was still the better card for hot, young startups until June 2022, when it sent an email to thousands of small business customers telling them their accounts would be terminated in 30 days. This product decision to focus only on high growth clients backfired. The reputation damage was immediate and the story spread fast. Ramp publicly welcomed every company Brex had cut off, and in the months that followed its revenue roughly doubled. Ramp created an onboarding process that companies who were terminated from Brex could use to seamlessly transition to Ramp. This was the final straw that allowed Ramp to become the most prevalent startup card.

Takeaway: Ramp started to take over the market because they studied what the customer wanted not in the present moment, but what they truly desired in their hearts. Founders may have needed credit approval in the moment, but at their core, all founders dreamed of being the head of a company that made it. By building that brand alongside a product that was world-class at solving a problem that those companies truly had, Ramp has become an increasingly popular choice for startups of all sizes.

Brex still has extremely valuable infrastructure, software, and relationships. As its strategy has shifted to hone in on high-potential startups, it just needs a partner with the scale to support those startups as they grow into something bigger…`,
  },
  {
    id: 2,
    episode: "EP. 002",
    title: "Stripe and Abstraction",
    spineTitle: "STRIPE VS. PAYPAL",
    subtitle: "How abstraction turned Stripe into the go-to payment processor",
    description: "In 2025, Stripe was the default payment gateway for 73% of US eCommerce startups. The reason it dethroned PayPal comes down to one software principle applied in a way nobody had thought to try.",
    date: "2026-04-12",
    substackUrl: "https://productfilmroom.substack.com",
    graphicPath: "/graphics/ep002.png",
    charts: {
      CHART1: { src: "/charts/ep002-paymentflow.html",  height: 400 },
      CHART2: { src: "/charts/ep002-checklist.html",    height: 580 },
      CHART3: { src: "/charts/ep002-7lines.html",       height: 340 },
    },
    content: `In 2010, PayPal was the internet's reigning payment processor, handling over 5 million transactions per day. However, the eCommerce world has since shifted to Stripe, which was the default payment gateway for 73% of US eCommerce startups in 2025 and is used by 92% of Fortune 100 companies.

The main reason that Stripe was able to dethrone PayPal is because of how well it performs abstraction. Anyone worried about payments when building an online business has probably been told to "Just use Stripe." That phrase emphasizes the service's ease of use, which holds true for both developers of an eCommerce platform and their potential customers.

One abstraction that Stripe makes is in the user experience. Similarly to PayPal, it handles communication between banks including card networks and authorization. However, it does this all while staying on the marketplace's webpage and does not require an external account.
[CHART1]
Because PayPal redirected the user to their external site and required the user to have a PayPal account, companies were losing over 30% of conversion. Stripe simplified this by integrating its payment processing directly into the eCommerce store's webpage.

However, the key abstraction that Stripe makes is for developers. To implement PayPal, developers had to complete PCI compliance and install an SSL certificate, all a part of a process that could take days. Instead, Stripe handles everything. During YC Demo Day in 2011, Patrick Collison famously showed how Stripe could accept a credit card payment in just 7 lines of code.
[CHART3]
Abstraction is a traditionally customer-facing concept that makes an application more enjoyable to use by stripping away unnecessary technical details. Google Maps abstracts its entire triangulation network to a blue dot and Vercel turns the website publishing process into a single click. In addition to providing that abstracted experience to online customers, Stripe boomed because it provided the same experience to developers. It reduced payment integration from weeks to hours.
[CHART2]
Takeaway: Stripe's success comes from taking an existing software principle, abstraction, and applying it to a market nobody had thought to cater to: developers. It's like Mike D'Antoni's creation of the pace and space offense. He built on the success of uptempo fastbreak offense and combined it with an underutilized weapon, the three-point line. Seven seconds or less simply combined a successful philosophy with an untapped tool that unlocked entirely new schemes across the whole league. Stripe's seven lines of code did the same thing to the tech world.`,
  },
  {
    id: 1,
    episode: "EP. 001",
    title: "Instagram's Invisible Upload",
    spineTitle: "INSTAGRAM",
    subtitle: "A hidden product decision that made Instagram the stickiest social media app of 2017",
    description: "In 2017, Instagram hit a 62% DAU/MAU ratio — one of the stickiest apps ever built. The secret wasn't technical. It was a UX decision hiding in plain sight.",
    date: "2026-04-05",
    substackUrl: "https://substack.com/home/post/p-192791954",
    graphicPath: "/graphics/ep001.png",
    charts: { CHART1: "/charts/ep001-daumau.html" },
    content: `In 2017, Instagram was one of the stickiest social media apps of all time. It reached an all-time high in daily active user to monthly active user ratio (DAU/MAU), a common metric to measure stickiness.
[CHART1]
2017 Instagram boasted a 62% DAU/MAU, only behind prime WhatsApp and Facebook. Many product decisions contributed to Instagram's position, but the app's creativity with its user experience was the driving force.

To push an average Instagram carousel to their servers, it would take a device with a normal internet connection over 30 seconds. But on Instagram, your uploads seem to post instantly. How is that possible?

The answer is less about Instagram's technical capability and is actually a UX decision. When you select photos to upload, Instagram starts uploading them in the background while you are writing a caption, choosing a location, and tagging friends.

[IMAGE]

Instagram found that over 80% of users who enter the post-creation screen actually end up clicking post, so the bandwidth cost is well-worth the experience of instant uploading.

This idea of perceived speed is a well-known design principle that has many applications.

For example, in 2012, Houston Airport received complaints about excessive baggage claim wait times. Rather than hiring more employees, they moved the arrival gates farther from the baggage claim so passengers had to walk for a longer period of time. This eliminated idle standing time entirely, and complaints disappeared despite the total wait time being the exact same.

Perceived speed is the same reason that ChatGPT slowed its responses to a character by character stream. Even if a message was already computed, users being able to see the process of the LLM "thinking" increased both trust and satisfaction scores.

Instagram used this same principle to keep its users on the app for longer.


Takeaway: Perceived performance is key. The feeling of speed matters more than actual speed. Even without a technological advantage, Instagram kept users engaged with their app by simply making it feel faster.`,
  },
]
