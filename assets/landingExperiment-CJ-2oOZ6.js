import { s as f, bI as h } from "./index-BSGRT7H-.js";
const p = "lp_home_price_990_v1",
  c = ["a", "b"],
  o = "educly_lp_exp5",
  d = 180,
  i = (n) => c.includes(n),
  l = (n) => {
    if (typeof document > "u") return null;
    const e = n + "=",
      t = document.cookie.split("; ").find((a) => a.startsWith(e));
    return t ? decodeURIComponent(t.slice(e.length)) : null;
  },
  u = (n, e, t) => {
    if (typeof document > "u") return;
    const a = Math.floor(t * 24 * 60 * 60);
    document.cookie = `${n}=${encodeURIComponent(
      e
    )}; path=/; max-age=${a}; SameSite=Lax`;
  },
  m = () => {
    try {
      if (typeof crypto < "u" && typeof crypto.randomUUID == "function")
        return crypto.randomUUID();
    } catch {}
    return `anon-${Math.random().toString(36).slice(2)}-${Date.now().toString(
      36
    )}`;
  },
  y = () => {
    const n = Math.floor(Math.random() * c.length);
    return c[n] ?? "a";
  },
  v = () => {
    if (typeof window > "u") return null;
    try {
      const n = new URLSearchParams(window.location.search),
        e = (n.get("lp_variant") || n.get("variant") || "")
          .trim()
          .toLowerCase();
      return i(e) ? e : null;
    } catch {
      return null;
    }
  },
  x = () => {
    const n = v(),
      e = l(o);
    if (e)
      try {
        const r = JSON.parse(e);
        if (r.id && r.v && i(r.v))
          return n && n !== r.v
            ? (u(o, JSON.stringify({ v: n, id: r.id }), d),
              { anonymousId: r.id, variant: n, isNew: !1 })
            : { anonymousId: r.id, variant: r.v, isNew: !1 };
      } catch {}
    const t = m(),
      a = n ?? y();
    return (
      u(o, JSON.stringify({ v: a, id: t }), d),
      { anonymousId: t, variant: a, isNew: !0 }
    );
  },
  I = () => {
    const n = v(),
      e = l(o);
    if (e)
      try {
        const t = JSON.parse(e);
        if (t.id && t.v && i(t.v))
          return { variant: n ?? t.v, provisional: !1 };
      } catch {}
    return { variant: n ?? y(), provisional: !0 };
  },
  S = () => !1,
  E = (n) => {
    const e = l(o);
    if (e)
      try {
        const a = JSON.parse(e);
        if (a.id && a.v && i(a.v))
          return { anonymousId: a.id, variant: a.v, isNew: !1 };
      } catch {}
    const t = m();
    return (
      u(o, JSON.stringify({ v: n, id: t }), d),
      { anonymousId: t, variant: n, isNew: !0 }
    );
  },
  w = () => {
    if (typeof window > "u" || typeof window.matchMedia != "function")
      return null;
    try {
      return window.matchMedia("(max-width: 767px)").matches
        ? "mobile"
        : "desktop";
    } catch {
      return null;
    }
  },
  L = async ({
    anonymousId: n,
    variant: e,
    eventType: t,
    lang: a,
    metadata: r,
  }) => {
    if (h() === "sandbox") return;
    const s = w(),
      g = r || s ? { ...(r ?? {}), ...(s ? { device: s } : {}) } : null;
    try {
      await f
        .from("landing_experiment_events")
        .insert({
          experiment_key: p,
          anonymous_id: n,
          variant: e,
          event_type: t,
          lang: a ?? null,
          metadata: g,
        });
    } catch {}
  },
  O = async () => {
    try {
      const n = f,
        { data: e, error: t } = await n
          .from("landing_experiment_config")
          .select("enabled")
          .eq("experiment_key", p)
          .maybeSingle();
      return t ? !1 : !!e?.enabled;
    } catch {
      return !1;
    }
  };
export { p as L, c as a, E as b, O as f, x as g, S as h, I as p, L as t };
