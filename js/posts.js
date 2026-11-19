// ============ SITE SETTINGS (edit these two lines) ============
const SITE_URL = "https://mamtamedia.com";            // your final website address, no "/" at the end
const WEB3FORMS_KEY = "325e00d4-5c95-4baf-9ca1-9f47199dbe88";
// ============ CATEGORIES ============
// Want a new category? Add one line here and use its "slug" as `cat` in your posts.
// (Add a matching picture at images/cat-<slug>.svg or .png, or it will show without art.)
const CATEGORIES = [
  { slug: "technology",    name: "Technology",    desc: "Gadgets, software, AI and the ideas shaping the digital world." },
  { slug: "business",      name: "Business",      desc: "Money, markets, startups and smart ways to grow." },
  { slug: "entertainment", name: "Entertainment", desc: "Movies, music, shows and everything worth watching." },
  { slug: "lifestyle",     name: "Lifestyle",     desc: "Habits, home, fashion and everyday inspiration." },
  { slug: "health",        name: "Health",        desc: "Fitness, nutrition and mental wellbeing made simple." },
  { slug: "sports",        name: "Sports",        desc: "Matches, athletes and stories from the world of sport." },
  { slug: "education",     name: "Education",     desc: "Learning tips, careers and skills for the future." },
  { slug: "travel",        name: "Travel",        desc: "Destinations, guides and trip ideas for every budget." }
];

// ============ POSTS ============
// To publish: paste a new block at the TOP of this list, then push to GitHub.
// The newest post (by date) automatically appears first on the home page.
//
//  slug     unique id, lowercase, words joined by dashes (e.g. "best-budget-phones")
//  cat      one of the category slugs above
//  date     "YYYY-MM-DD"  (use "YYYY-MM-DDTHH:MM" if you publish twice in a day)
//  image    OPTIONAL. e.g. "/images/my-photo.jpg". Without it, the category picture is used.
//  body     list of paragraphs. A line starting with "## " becomes a sub-heading.
//
// IMPORTANT: the posts below are SAMPLES. Delete them and publish your own original articles.
const POSTS = [
  {
    slug: "ai-tools-that-save-you-an-hour-a-day",
    title: "5 AI tools that can save you an hour every day",
    cat: "technology", date: "2026-11-19", author: "Mamta Media Team",
    summary: "From drafting emails to summarising long documents, here is how simple AI tools can clear your to-do list.",
    body: [
      "Most of us lose time on small, repetitive tasks: writing the same kind of email, sorting notes after a meeting, or searching for a file. Modern AI tools are good at exactly this kind of work, and you do not need to be technical to use them.",
      "## Start with the tasks you repeat daily",
      "Pick one task you do every day and try a tool on it for a week. Measure how long it takes with and without help. If you save even ten minutes, the habit is worth keeping.",
      "## Writing and summaries",
      "Writing assistants can turn rough notes into a clean draft, while summary tools can condense a long report into a few key points. Always read the result carefully and add your own judgement before you share it.",
      "## Keep a human in the loop",
      "Tools are fast, but you are still responsible for the final result. Check facts, protect private data and never paste sensitive information into a tool you do not trust."
    ]
  },
  {
    slug: "start-a-side-business-with-little-money",
    title: "How to start a small side business with very little money",
    cat: "business", date: "2026-11-18", author: "Mamta Media Team",
    summary: "You do not need a big budget to test an idea. Start small, sell to your first ten customers and learn from them.",
    body: [
      "A side business is one of the safest ways to test an idea because you keep your regular income while you learn. The goal in the first months is not profit, it is proof that someone will pay for what you offer.",
      "## Validate before you build",
      "Talk to ten potential customers before spending money. Ask what problem they face today and what they already pay to solve it. If nobody is willing to pay, change the idea, not the logo.",
      "## Keep costs close to zero",
      "Use free or low-cost tools, sell on existing platforms and offer a simple version of your product first. You can improve it once real customers give feedback.",
      "## Reinvest early profits",
      "Put your first earnings back into the part of the business that is already working, whether that is better photos, a small ad budget or a faster delivery option."
    ]
  },
  {
    slug: "cosy-weekend-watchlist",
    title: "A cosy weekend watchlist: five stories worth your time",
    cat: "entertainment", date: "2026-11-17", author: "Mamta Media Team",
    summary: "Short on time? These picks are easy to start, hard to put down and perfect for a lazy Sunday.",
    body: [
      "The best weekend watchlist is not the longest one. It is a short list of stories that match your mood, so you spend your time watching instead of scrolling.",
      "## Choose by mood, not by ratings",
      "Decide whether you want something light, thrilling or thoughtful before you open any app. Starting with a mood saves you from the endless-browsing trap.",
      "## Mix formats",
      "Pair a feature film with a short series or a documentary. Variety keeps the weekend interesting and gives you something to talk about on Monday."
    ]
  },
  {
    slug: "20-minute-morning-routine",
    title: "A 20-minute morning routine that actually sticks",
    cat: "lifestyle", date: "2026-11-15", author: "Mamta Media Team",
    summary: "Forget the two-hour routines. Three small habits are enough to make your mornings calmer and more focused.",
    body: [
      "Long morning routines look great online but rarely survive a busy week. A short routine that you can repeat on your worst day is far more valuable.",
      "## Keep it tiny",
      "Habits stick when they are easy. Drink a glass of water, stretch for five minutes and write down one priority for the day. That is already a strong start.",
      "## Prepare the night before",
      "Lay out your clothes, pack your bag and decide your first task before bed. Fewer morning decisions means more energy for the things that matter."
    ]
  },
  {
    slug: "sleep-better-tonight",
    title: "Sleep better tonight: simple habits that make a real difference",
    cat: "health", date: "2026-11-13", author: "Mamta Media Team",
    summary: "A regular bedtime, a dark room and less late-night scrolling can change how you feel in the morning.",
    body: [
      "Good sleep is not luck, it is mostly routine. Small changes to your evening can help your body know when it is time to rest.",
      "## Keep a regular schedule",
      "Going to bed and waking up at similar times, even on weekends, helps your body clock settle.",
      "## Make your room sleep-friendly",
      "Keep the room cool, dark and quiet. Try to put screens away at least thirty minutes before bed.",
      "This article is general information only. If you have ongoing sleep problems, please speak to a qualified doctor."
    ]
  },
  {
    slug: "how-to-follow-a-new-sport",
    title: "How to follow a new sport: a beginner's guide",
    cat: "sports", date: "2026-11-11", author: "Mamta Media Team",
    summary: "New to a sport? Learn the basic rules, pick a team and follow one player to get hooked quickly.",
    body: [
      "Every sport looks confusing at first. The trick is to learn just enough to enjoy the next match and let the details come naturally.",
      "## Learn the basics",
      "Watch a short rules explainer and focus on how points are scored. You do not need to master every rule on day one.",
      "## Pick a team and a player",
      "Having someone to cheer for makes every match more exciting. Follow one player closely and you will start to notice the tactics around them."
    ]
  },
  {
    slug: "study-smarter-not-longer",
    title: "Study smarter, not longer: techniques that really work",
    cat: "education", date: "2026-11-09", author: "Mamta Media Team",
    summary: "Active recall and spaced repetition beat re-reading every time. Here is how to use them in your own study plan.",
    body: [
      "Many students spend hours re-reading notes and still forget everything by the exam. Research on learning keeps pointing to the same two methods that work better.",
      "## Test yourself",
      "Close the book and try to explain the topic in your own words. The effort of remembering is what builds memory.",
      "## Space it out",
      "Review a topic after one day, then three days, then a week. Short, repeated sessions beat one long cram session."
    ]
  },
  {
    slug: "budget-weekend-getaway",
    title: "Plan a budget weekend getaway in under 30 minutes",
    cat: "travel", date: "2026-11-06", author: "Mamta Media Team",
    summary: "Pick a destination within a few hours' travel, book early and keep your plan flexible for the best value.",
    body: [
      "A short trip does not need weeks of planning. With a clear budget and a nearby destination, you can organise a refreshing weekend in half an hour.",
      "## Choose a close destination",
      "Travel time is the biggest hidden cost. A place within three or four hours means more time enjoying and less time in transit.",
      "## Book early, plan loosely",
      "Reserve your stay and transport in advance for better prices, then leave room in the schedule for spontaneous discoveries."
    ]
  }
];
