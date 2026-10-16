# Marketing 4U — weekly Facebook post playbook

You are preparing next week's Facebook image posts for the **Marketing 4U** Page
(Burmese-language marketing tips for small Myanmar business owners and online shops).
Images are rendered here, hosted in this public repo, and handed to **Metricool**, which
publishes them to the Facebook Page. Reels are **not** part of this workflow for now.

## Settings (the owner may edit these)

- MODE: `draft` — create Metricool posts with `draft: true`, so the owner presses
  "Schedule" in Metricool. Change to `schedule` to publish automatically.
- POSTS_PER_MONTH: 20 (Metricool free plan limit — never exceed it)
- Metricool brand: "Marketing 4U", blogId `7456020`, brand timezone `Asia/Tokyo`.
  Always confirm with `getBrandSettings` before scheduling.
- Audience time zone: Myanmar (`Asia/Yangon`, UTC+6:30). Metricool `publicationDate`
  must be written in `Asia/Tokyo` (UTC+9) → add 2h30m to the Myanmar time.

## 0. Setup (every run starts in a fresh container)

1. Attach and clone this repo with push access (`add_repo` Kyeemyat-01 / marketing4u-media,
   access `push`), then `git config user.name Claude` and
   `git config user.email noreply@anthropic.com` inside it.
2. `cd tools && npm install` (Chromium is preinstalled; do not run `playwright install`).
3. Read `posts/log.json` — every post ever scheduled, newest last.

## 1. Which dates get a post

Cover **next Monday → Sunday** (Myanmar dates). A day `d` of a month with `N` days gets
a post when `floor(d*20/N) > floor((d-1)*20/N)`. That spreads exactly 20 posts across
every month (roughly every other day, sometimes two days in a row). Then cap: count
posts already in `posts/log.json` for that calendar month (plus anything in Metricool's
`getScheduledPosts` for the month that the log does not know about); never go above 20
in any month. Skip dates that already have a post in the log.

Times (Myanmar): alternate between a lunch slot 11:40–13:10 and an evening slot
19:00–21:15. Use uneven minutes (e.g. 12:20, 19:45, 20:35) and do not reuse the exact
same time two posts in a row. If `getBestTimeToPostByNetwork` (facebook) returns useful
data for the week, prefer its top hours inside those slots.

## 2. Plan the posts — variety is the whole point

The owner wants the Page to feel like a real person sharing useful things, **not an ad
account**. Before writing, list the last 12 entries of the log and plan so that:

**Formats** (pick a different one each post; ≤2 of the same per week; never the same
format or template twice in a row):

| format | template(s) | what it is |
|---|---|---|
| single tip, explained fully | `tip`, `note` | one idea + why + exactly how |
| before → after | `beforeafter` | a weak caption/reply/photo habit rewritten |
| myth vs fact | `mythfact` | a common belief corrected with reasoning |
| self-check | `checklist` | "how many do you already do?" — invites a comment |
| this or that | `versus` | A/B question — invites a comment |
| reply script | `chat` | how to answer a customer message (price haggling, late reply, complaints…) |
| how-to steps | `steps` | 2–5 concrete steps for one small task |
| one-line truth | `statement`, `quote` | a short memorable sentence + explanation in caption |
| mini story | `note`, `chat`, `beforeafter` | a short illustrative situation (clearly an example, see rules) |
| blog pointer | any | shares one existing blog article — max 1 per week |

**Design**: never the same `theme` two posts in a row; use all four themes across a
week; mix `portrait` (most) and `square` (1–2 per week). Highlight only 1–2 phrases
with `*…*`.

**Topics** — rotate across these areas and never repeat a topic/angle used in the last
60 log entries (check `topic`): writing captions & hooks · product photos with a phone ·
pricing & showing prices · replying to messages, haggling, complaints · getting first
followers / reach without paying · Boost basics & mistakes · building trust & reviews ·
delivery, COD, payment clarity · repeat customers · content ideas when you run out ·
consistency & time management for solo owners · seasonal selling (look up the actual
dates of upcoming Myanmar holidays/festivals with web search before mentioning them) ·
simple numbers to watch (messages → orders, not likes) · mindset for small sellers.

## 3. Write each post

Each post teaches **one thing, clearly and completely** — the owner prefers depth over
lists of many shallow points. The image carries the core idea; the caption explains it
(why it matters, how to do it, a concrete Myanmar-shop example).

Caption style:
- Natural, warm, conversational Burmese, like a person talking to shop owners. English
  only for words Myanmar sellers already use (Post, Page, Customer, Order, Boost,
  Message, Inbox, Comment, Delivery, COD, Size).
- Vary length: some short (3–5 lines), most medium, the odd long one. Vary the first
  line — not always a question, not always an emoji, never the same opener as the
  previous post.
- Emoji: 0–3 per caption. Hashtags: only on about half the posts, 1–3, e.g.
  `#Marketing4U` `#OnlineShop` `#FacebookMarketing`.
- Calls to action: most posts end with a genuine question or simply end. Mention
  "Follow Marketing 4U" in **at most one post per week**. A blog link in **at most one
  post per week**, only to an article listed below, only when it really matches.
- Honesty rules: no invented statistics, studies, customer quotes or reviews, no
  "our client got 300% more sales". A mini story must read as an example
  ("ဥပမာ ဆိုင်တစ်ဆိုင်…"), never as a real customer. No promises of guaranteed results.
  No politics, religion, or medical/financial advice.

Existing blog articles (for the weekly blog pointer):
- https://marketing4u-mm.blogspot.com/2026/10/marketing.html — Marketing မှာ မမေ့ရမယ့် ၅ ချက်
- https://marketing4u-mm.blogspot.com/2026/10/facebook-page.html — ရောင်းအားကျစေတဲ့ Page အမှား ၅ ခု
- https://marketing4u-mm.blogspot.com/2026/10/facebook-boost.html — Boost လုပ်နည်း ၆ ဆင့်
- https://marketing4u-mm.blogspot.com/2026/10/facebook-post-hook.html — Post အစ (Hook) ရေးနည်း
- https://marketing4u-mm.blogspot.com/2026/10/customer-boost.html — ပိုက်ဆံမကုန်ဘဲ Customer ရှာနည်း
- https://marketing4u-mm.blogspot.com/2026/10/online.html — ဖုန်းနဲ့ ပစ္စည်းပုံ ရိုက်နည်း
- https://marketing4u-mm.blogspot.com/2026/10/follower-facebook-page-page.html — Follower ၀ ကနေ Page ကြီးထွားအောင်
- https://marketing4u-mm.blogspot.com/2026/10/customer-message-order.html — Message ကို Order ဖြစ်အောင် ပြန်ဖြေနည်း
- https://marketing4u-mm.blogspot.com/2026/10/promotion.html — ပွဲတော်ရာသီ Promotion လုပ်နည်း
(Newer articles: check https://marketing4u-mm.blogspot.com/feeds/posts/summary?alt=json)

## 4. Render and check

1. Write all specs into one JSON array (`name` = `YYYY-MM-DD-short-slug`) and run
   `node tools/render.js specs.json YYYY-MM/` from the repo root (folder = month of the
   post date).
2. **Open every image with the Read tool and look at it.** Fix and re-render if any
   text is cut off, overlaps, breaks mid-word, the renderer printed a WARNING, or the
   image says something different from the plan. Keep image text short — the caption
   carries the detail.

## 5. Publish to Metricool

1. Commit the images and push (`git push origin HEAD:main`). Each image is then at
   `https://raw.githubusercontent.com/Kyeemyat-01/marketing4u-media/main/YYYY-MM/<name>.jpg`
   — confirm with `curl -sI` that it returns 200 before using it.
2. For each post call `createScheduledPost` with blogId `7456020`, `providers`
   `[{"network":"facebook"}]`, `facebookData {"type":"POST"}`, `media` [raw URL],
   `text` = caption, `autoPublish: true`, `draft: true` if MODE is `draft`,
   `publicationDate {dateTime, timezone:"Asia/Tokyo"}` and the matching `date`.
3. If Metricool refuses (e.g. monthly limit), stop scheduling, keep what succeeded,
   and report it.

## 6. Log and report

1. Append one entry per scheduled post to `posts/log.json`:
   `{"date":"YYYY-MM-DD","timeMMT":"HH:MM","format":"…","template":"…","theme":"…","size":"…",
   "topic":"short English topic","firstLine":"caption first line","blogLink":true|false,
   "followCta":true|false,"image":"YYYY-MM/<name>.jpg","metricoolUuid":"…","status":"draft"|"scheduled"}`
   Commit and push.
2. Finish with a short Burmese summary for the owner: a table of date, time (Myanmar),
   format and topic, the Metricool planner link for each post, and — in draft mode — a
   reminder to open each draft in Metricool and press Schedule. Mention anything that
   failed.
