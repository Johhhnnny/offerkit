import { useState } from "react";
import type { ContentKind, GenerateRequest, Tone } from "./types";

const kinds: ContentKind[] = ["Social caption", "WhatsApp advert", "Content calendar", "Flyer copy", "Video idea"];
const tones: Tone[] = ["Friendly", "Bold", "Premium", "Funny", "Professional"];

export default function App() {
  const [form, setForm] = useState<GenerateRequest>({
    businessName: "", businessType: "Fashion & beauty", offer: "", audience: "People nearby",
    phone: "", whatsapp: "", location: "", platform: "Instagram", tone: "Friendly", kind: "Social caption"
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof GenerateRequest>(key: K, value: GenerateRequest[K]) {
    setForm(current => ({ ...current, [key]: value }));
  }

  async function generate() {
    setLoading(true); setError(""); setResult("");
    try {
      const endpoint = import.meta.env.VITE_API_URL || "https://offerkit-ai.josephmedeadzone.workers.dev";
      const response = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("The generator is not connected yet. Please try the sample output below or configure the API endpoint.");
      const data = await response.json() as { text?: string; error?: string };
      if (!data.text) throw new Error(data.error || "No content was returned.");
      setResult(data.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setResult(makeSample(form));
    } finally { setLoading(false); }
  }

  return <main className="app-shell">
    <nav className="topbar"><a className="brand" href="#"><span className="brand-mark">O</span> offerkit<span className="brand-ai">AI</span></a><span className="top-note">Your tiny marketing team</span><a className="top-link" href="#how-it-works">How it works ↗</a></nav>
    <section className="hero">
      <div className="eyebrow"><span className="pulse" /> MADE FOR SMALL BUSINESSES</div>
      <h1>Good ideas deserve<br /><em>great marketing.</em></h1>
      <p className="hero-copy">Create scroll-stopping promotions, WhatsApp adverts and content ideas in minutes. You bring the business. We’ll help with the words.</p>
      <div className="hero-tags"><span>✦ Captions</span><span>↗ WhatsApp adverts</span><span>▦ Content plans</span></div>
    </section>
    <section className="workspace">
      <div className="form-panel">
        <div className="panel-heading"><div><span className="step">01 / YOUR BUSINESS</span><h2>Let’s make something.</h2></div><span className="sparkle">✳</span></div>
        <label>Business name<input value={form.businessName} onChange={e => update("businessName", e.target.value)} placeholder="e.g. Tanu’s Grill" /></label>
        <label>What kind of business?<select value={form.businessType} onChange={e => update("businessType", e.target.value)}>{["Fashion & beauty","Food & restaurant","Retail shop","Real estate","Fitness & wellness","Professional services","Events & entertainment","Other"].map(x => <option key={x}>{x}</option>)}</select></label>
        <label>What are you promoting?<textarea value={form.offer} onChange={e => update("offer", e.target.value)} placeholder="e.g. Friday barbecue, 10% off new arrivals, weekend special..." rows={3} /></label>
        <label>Who do you want to reach?<input value={form.audience} onChange={e => update("audience", e.target.value)} placeholder="e.g. students, parents, local customers" /></label>
        <div className="contact-heading"><span className="step">OPTIONAL / CONTACT DETAILS</span><p>Add only the details you want customers to see in your advert.</p></div>
        <div className="two-cols"><label>Business phone number<input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="e.g. +234 800 000 0000" /></label><label>WhatsApp number<input type="tel" value={form.whatsapp} onChange={e => update("whatsapp", e.target.value)} placeholder="If different from phone" /></label></div>
        <label>Business location or address<input value={form.location} onChange={e => update("location", e.target.value)} placeholder="e.g. Otuoke, Bayelsa State" /></label>
        <div className="two-cols"><label>Content type<select value={form.kind} onChange={e => update("kind", e.target.value as ContentKind)}>{kinds.map(x => <option key={x}>{x}</option>)}</select></label><label>Where will you post?<select value={form.platform} onChange={e => update("platform", e.target.value)}>{["Instagram","WhatsApp","Facebook","TikTok","X","Any platform"].map(x => <option key={x}>{x}</option>)}</select></label></div>
        <label>Choose a vibe<div className="tone-options">{tones.map(t => <button type="button" key={t} className={form.tone === t ? "tone active" : "tone"} onClick={() => update("tone", t)}>{t}</button>)}</div></label>
        <button className="generate" onClick={generate} disabled={loading}>{loading ? "Creating your content…" : "✦  Create my content"} <span>→</span></button>
        <p className="fine-print">A useful first draft, ready for your personal touch.</p>
      </div>
      <div className="result-panel">
        <div className="result-top"><div><span className="step">02 / YOUR CONTENT</span><h2>The good stuff.</h2></div><span className="live-pill"><span /> READY WHEN YOU ARE</span></div>
        {result ? <div className="result-content">{form.kind === "Content calendar" ? <><div className="result-label">YOUR 7-DAY CONTENT PLAN</div><div className="result-text calendar-result">{result}</div><button className="copy-btn" onClick={() => navigator.clipboard.writeText(result).catch(() => {})}>Copy 7-day plan ↗</button></> : <><div className="result-label">YOUR {form.kind.toUpperCase()} · 3 OPTIONS</div>{result.split(/\n---VERSION---\n/i).map((version, index) => <article className="version-card" key={index}><div className="version-heading"><span className="result-label">{["01 / CATCHY", "02 / FRIENDLY", "03 / PREMIUM"][index] || `OPTION ${index + 1}`}</span><button className="copy-btn" onClick={() => navigator.clipboard.writeText(version.trim()).catch(() => {})}>Copy this ↗</button></div><div className="result-text">{version.replace(/^VERSION\s*\d+\s*:\s*/i, "").trim()}</div></article>)}</>}{error && <p className="notice">{error} Showing a sample draft.</p>}</div> : <div className="empty-result"><div className="paper-art"><div className="paper-line long" /><div className="paper-line" /><div className="paper-line short" /><div className="paper-star">✳</div></div><h3>Your next great post<br />starts right here.</h3><p>Fill in a few details and let OfferKit turn your idea into content your customers will notice.</p><span className="result-hint">YOUR CONTENT WILL APPEAR HERE ↗</span></div>}
        <div className="result-footer"><span>✦ Made for the people building something.</span><span>OfferKit AI · Preview</span></div>
      </div>
    </section>
    <section className="how" id="how-it-works"><span className="step">NO MARKETING DEGREE REQUIRED</span><h2>Simple as 1, 2, <em>done.</em></h2><div className="how-grid"><article><b>01</b><h3>Tell us the plan</h3><p>What you sell, what’s special, and who you want to reach.</p></article><article><b>02</b><h3>Pick your vibe</h3><p>Make it friendly, premium, bold, funny or professional.</p></article><article><b>03</b><h3>Make it yours</h3><p>Get a draft you can tweak, copy and share with customers.</p></article></div></section>
    <footer><a className="brand" href="#"><span className="brand-mark">O</span> offerkit<span className="brand-ai">AI</span></a><span>Less blank-page panic. More business.</span><span>© 2026 OfferKit AI</span></footer>
  </main>;
}

function makeSample(f: GenerateRequest) {
  const name = f.businessName.trim() || "our business";
  const offer = f.offer.trim() || "something special just for you";
  const audience = f.audience.trim() || "you";
  const contact = [f.phone.trim() ? `Call: ${f.phone.trim()}` : "", f.whatsapp.trim() ? `WhatsApp: ${f.whatsapp.trim()}` : "", f.location.trim() ? `Location: ${f.location.trim()}` : ""].filter(Boolean).join("\\n");
  const contactLine = contact ? `\\n\\n${contact}` : "";
  if (f.kind === "Content calendar") return `7-DAY CONTENT PLAN — ${name.toUpperCase()}\n\nDAY 1 — INTRODUCE THE BUSINESS\nPost: Introduce what you do and who you serve.\nCaption idea: Meet ${name}. We help ${audience} with ${offer}. Send us a message to learn more.\nFormat: Photo or short video.\n\nDAY 2 — SHOW THE OFFER\nPost: Show the product or service clearly.\nCaption idea: Here is what we are featuring: ${offer}. What would you like to know?\nFormat: Product photo or short demo.\n\nDAY 3 — ANSWER A QUESTION\nPost: Answer one common customer question about the offer.\nCaption idea: Curious about ${offer}? Send us your questions and we will help you understand the details.\nFormat: Text graphic or talking video.\n\nDAY 4 — BEHIND THE SCENES\nPost: Show the real people, process or preparation behind the business.\nCaption idea: A little behind-the-scenes look at ${name}.\nFormat: Short video or photo carousel.\n\nDAY 5 — CUSTOMER BENEFIT\nPost: Explain one genuine benefit of the offer without making unsupported promises.\nCaption idea: If you are looking for ${offer}, get in touch and we can share the details.\nFormat: Photo with a short caption.\n\nDAY 6 — COMMUNITY / INTERACTION\nPost: Ask your audience a simple question related to the offer.\nCaption idea: We would love to hear from you, ${audience}. What would you like us to feature next?\nFormat: Story, poll or question post.\n\nDAY 7 — CLEAR CALL TO ACTION\nPost: Remind people how to enquire or order.\nCaption idea: Ready to find out more about ${offer}? Send us a message.${f.phone.trim() ? ` Call: ${f.phone.trim()}.` : ""}${f.whatsapp.trim() ? ` WhatsApp: ${f.whatsapp.trim()}.` : ""}${f.location.trim() ? ` Visit us at ${f.location.trim()}.` : ""}\nFormat: Best product photo or short recap.\n\nTip: Use real photos and only publish contact details you have confirmed.`;
  if (f.kind === "Video idea") return `SHORT VIDEO IDEA — ${name.toUpperCase()}\n\nHook (first 2 seconds): “Wait—have you seen this?”\n\nScene 1: Show the product, service or experience up close.\nScene 2: Put the offer on screen: ${offer}.\nScene 3: Show how a customer can get it.\n\nCaption: A little something for ${audience}. Send us a message to find out more!\n\nKeep it vertical, use clear lighting, and add captions.`;
  if (f.kind === "Flyer copy") return `${name.toUpperCase()}\n\n${offer.toUpperCase()}\n\nMade with ${audience} in mind.\n\nGet in touch today for details, bookings or orders.\n\nYour next favourite is closer than you think.`;
  if (f.kind === "WhatsApp advert") return `✨ HELLO FROM ${name.toUpperCase()}! ✨\n\nWe have ${offer} and we thought you should know.\n\nIf you or someone you know might love this, send us a message to get the details. We’d be happy to help!\n\n📩 Reply to this message to enquire or place an order.\n\nPlease share with someone who might be interested 💛`;
  return `✨ A LITTLE SOMETHING FROM ${name.toUpperCase()} ✨\n\nHere’s your reminder that ${offer.toLowerCase()}.\n\nWhether you’re new here or already part of our community, we’re glad you’re here. We made this with ${audience} in mind.\n\n💬 Send us a message to learn more or get started.\n\n#SmallBusiness #ShopLocal #${name.replace(/[^a-z0-9]/gi, "")}`;
}