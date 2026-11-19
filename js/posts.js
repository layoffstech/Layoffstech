// ============ CATEGORIES ============
// Want a new category? Add one line here, then use its "slug" as `cat` in your posts.
const CATEGORIES = [
  { slug: "technology",    name: "Technology",    icon: "💻", c1: "#2a4bff", c2: "#12206b", desc: "Gadgets, software, AI and the ideas shaping the digital world." },
  { slug: "business",      name: "Business",      icon: "📈", c1: "#12a150", c2: "#0a5a2d", desc: "Money, markets, startups and smart ways to grow." },
  { slug: "entertainment", name: "Entertainment", icon: "🎬", c1: "#ff5a36", c2: "#a52a10", desc: "Movies, music, shows and everything worth watching." },
  { slug: "lifestyle",     name: "Lifestyle",     icon: "✨", c1: "#ff7eb0", c2: "#b02d68", desc: "Habits, home, fashion and everyday inspiration." },
  { slug: "health",        name: "Health",        icon: "🩺", c1: "#00b3a4", c2: "#006a62", desc: "Fitness, nutrition and mental wellbeing made simple." },
  { slug: "sports",        name: "Sports",        icon: "⚽", c1: "#ffc83d", c2: "#c98a00", desc: "Matches, athletes and stories from the world of sport." },
  { slug: "education",     name: "Education",     icon: "🎓", c1: "#8a4dff", c2: "#4a1fa8", desc: "Learning tips, careers and skills for the future." },
  { slug: "travel",        name: "Travel",        icon: "🧭", c1: "#ff9f1c", c2: "#b35f00", desc: "Destinations, guides and trip ideas for every budget." }
];

// ============ POSTS ============
// To publish: paste a new block at the TOP of this list. The newest post (by date)
// automatically appears first on the home page in the "Latest Posts" section.
//
//  slug     unique id, lowercase, no spaces (e.g. "best-budget-phones")
//  cat      one of the category slugs above
//  date     "YYYY-MM-DD"  (use "YYYY-MM-DDTHH:MM" if you post twice in a day)
//  image    optional link to a cover image. Leave it out for an automatic colourful cover.
//  body     list of paragraphs. A line starting with "## " becomes a sub-heading.
//
// NOTE: the posts below are SAMPLES. Delete them and add your own.
const POSTS = [
  {
    slug: "sample-ai-tools-for-everyday-work",
    title: "5 AI tools that can save you an hour every day",
    cat: "technology", date: "2026-11-19", author: "Mamta Media Team",
    summary: "From writing emails to summarising long documents, here is how simple AI tools can clear your to-do list.",
    body: [
      "This is a sample post. Replace it with your own article.",
      "## Start with the boring tasks",
      "The best use of any new tool is the task you repeat every day. Pick one, test it for a week and measure how much time you really save.",
      "## Keep a human in the loop",
      "Always read and edit what a tool produces before you share it. Tools are fast, but you are still the one responsible for the result."
    ]
  },
  {
    slug: "sample-start-a-side-business",
    title: "How to start a small side business with almost no money",
    cat: "business", date: "2026-11-18", author: "Mamta Media Team",
    summary: "You do not need a big budget to test an idea. Start small, sell to ten people and learn from them.",
    body: [
      "This is a sample post. Replace it with your own article.",
      "## Validate before you build",
      "Talk to ten potential customers before spending anything. If they will not pay for the idea today, a fancy website will not change that.",
      "## Reinvest your first profits",
      "Put your first earnings back into the part of the business that is already working."
    ]
  },
  {
    slug: "sample-weekend-watchlist",
    title: "A cosy weekend watchlist: five stories worth your time",
    cat: "entertainment", date: "2026-11-17", author: "Mamta Media Team",
    summary: "Short on time? These picks are easy to start, hard to put down and perfect for a lazy Sunday.",
    body: [
      "This is a sample post. Replace it with your own article.",
      "Write about the shows, films or albums you actually enjoyed and tell readers why they should care."
    ]
  },
  {
    slug: "sample-morning-routine",
    title: "A 20-minute morning routine that actually sticks",
    cat: "lifestyle", date: "2026-11-15", author: "Mamta Media Team",
    summary: "Forget the two-hour routines. Three small habits are enough to make your mornings calmer.",
    body: [
      "This is a sample post. Replace it with your own article.",
      "## Keep it tiny",
      "Habits stick when they are easy. Drink a glass of water, stretch for five minutes and write down one priority for the day."
    ]
  },
  {
    slug: "sample-sleep-better",
    title: "Sleep better tonight: simple habits backed by common sense",
    cat: "health", date: "2026-11-13", author: "Mamta Media Team",
    summary: "A regular bedtime, a dark room and less late-night scrolling can make a real difference.",
    body: [
      "This is a sample post. Replace it with your own article.",
      "General information only. For medical concerns, please speak to a qualified doctor."
    ]
  },
  {
    slug: "sample-how-to-watch-a-match",
    title: "How to follow a new sport: a beginner's guide",
    cat: "sports", date: "2026-11-11", author: "Mamta Media Team",
    summary: "New to a sport? Learn the basic rules, pick a team and follow one player to get hooked quickly.",
    body: ["This is a sample post. Replace it with your own article.", "Write match reports, player stories or explainers here."]
  },
  {
    slug: "sample-study-smarter",
    title: "Study smarter, not longer: techniques that work",
    cat: "education", date: "2026-11-09", author: "Mamta Media Team",
    summary: "Active recall and spaced repetition beat re-reading every time. Here is how to use them.",
    body: [
      "This is a sample post. Replace it with your own article.",
      "## Test yourself",
      "Close the book and try to explain the topic in your own words. The effort of remembering is what builds memory."
    ]
  },
  {
    slug: "sample-weekend-getaway",
    title: "Plan a budget weekend getaway in under 30 minutes",
    cat: "travel", date: "2026-11-06", author: "Mamta Media Team",
    summary: "Pick a destination within a few hours' travel, book early and keep your plan flexible.",
    body: ["This is a sample post. Replace it with your own article.", "Share your own itineraries, tips and photos here."]
  }
];
