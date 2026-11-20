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
const POSTS = [];