import { useState } from 'react';
import { BRIEF_CHIPS, CONTACT } from '../data';
import { useInView } from '../hooks';
import { Logo } from './Marks';

type Field = 'name' | 'phone' | 'location' | 'size' | 'brief';

function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="chips">
      {options.map((o) => (
        <button type="button" key={o} className={value === o ? 'on' : undefined} onClick={() => onChange(value === o ? '' : o)}>{o}</button>
      ))}
    </div>
  );
}

/** "Let's draw." with the design brief. Name and phone are required; the brief opens in WhatsApp. */
export function Contact() {
  const [v, setV] = useState<Record<Field, string>>({ name: '', phone: '', location: '', size: '', brief: '' });
  const [space, setSpace] = useState('');
  const [timeline, setTimeline] = useState('');
  const [bad, setBad] = useState<Field[]>([]);
  const [msg, setMsg] = useState('Opens WhatsApp with your note.');
  const [headRef, headIn] = useInView<HTMLHeadingElement>(0.4);

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setV((x) => ({ ...x, [k]: e.target.value }));
    setBad((b) => b.filter((f) => f !== k));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing: Field[] = [];
    if (!v.name.trim()) missing.push('name');
    if (v.phone.replace(/\D/g, '').length < 10) missing.push('phone');
    setBad(missing);
    if (missing.length) { setMsg('Please add your name and a phone number we can call.'); return; }
    const note = [
      'Hello AYRA,',
      `I'm ${v.name.trim()}. Phone: ${v.phone.trim()}`,
      space && `To design: ${space}`,
      v.location.trim() && `Where: ${v.location.trim()}`,
      v.size.trim() && `Size / budget: ${v.size.trim()}`,
      timeline && `When: ${timeline}`,
      v.brief.trim(),
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(note)}`, '_blank', 'noopener');
    setMsg(`Your brief is ready in WhatsApp. If it did not open, message ${CONTACT.phoneLabel}.`);
  };

  const cls = (k: Field, wide = false) => `f${wide ? ' wide' : ''}${bad.includes(k) ? ' bad' : ''}`;

  return (
    <section className="cta" id="contact">
      <div className="wrap">
        <p className="lab rv">[ Start a project ]</p>
        <h2 className={`H rv ctah${headIn ? ' in' : ''}`} ref={headRef} style={{ marginTop: 24 }}>
          Let&rsquo;s<br /><span className="b">draw.</span>
          <svg className="uline" viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength={1} d="M6 40 C120 18 240 52 360 30 S560 22 594 34" />
          </svg>
        </h2>
        <div className="row g12 rv">
          <p>Tell us about the room or the house. We&rsquo;ll call you back within one working day, come to see the space and start with a sketch.</p>
          <span className="ph">{CONTACT.phoneLabel}</span>
          <a className="btn fill" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener">WhatsApp us <span className="ar">&rarr;</span></a>
        </div>
        <form className="brief g12 rv" noValidate onSubmit={submit}>
          <p className="lab bl">[ Send a design brief ]</p>
          <label className={cls('name')}><span>Your name <em>*</em></span><input value={v.name} onChange={set('name')} autoComplete="name" /></label>
          <label className={cls('phone')}><span>Phone <em>*</em></span><input value={v.phone} onChange={set('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" /></label>
          <fieldset className="f wide"><legend>What should we design?</legend><Chips options={BRIEF_CHIPS.space} value={space} onChange={setSpace} /></fieldset>
          <label className={cls('location')}><span>Where is it?</span><input value={v.location} onChange={set('location')} placeholder="Area or city" /></label>
          <label className={cls('size')}><span>Size or budget</span><input value={v.size} onChange={set('size')} placeholder="e.g. 3 BHK or ₹25 lakh" /></label>
          <fieldset className="f wide"><legend>When</legend><Chips options={BRIEF_CHIPS.timeline} value={timeline} onChange={setTimeline} /></fieldset>
          <label className={cls('brief', true)}><span>In a sentence</span><textarea value={v.brief} onChange={set('brief')} rows={2} placeholder="Morning light in the kitchen, a quiet reading corner…" /></label>
          <div className="bfoot wide"><button className="btn fill" type="submit">Send brief <span className="ar">&rarr;</span></button><p className="msg" aria-live="polite">{msg}</p></div>
        </form>
        <footer className="ft g12">
          <Logo />
          <nav><a href="#walk">Interiors &amp; exteriors</a><a href="#projects">Projects</a><a href="#materials">Materials</a><a href="/project-49/">Project 49</a></nav>
          <span className="lab">Studio Hyderabad &middot; &copy; {new Date().getFullYear()}</span>
        </footer>
      </div>
    </section>
  );
}
