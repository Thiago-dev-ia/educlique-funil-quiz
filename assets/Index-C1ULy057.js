import { r as s, j as i } from "./vendor-ByF_IhCL.js";
import { bO as o } from "./index-BSGRT7H-.js";
import m from "./LP1-BqROIe8S.js";
import "./vendor-supabase-DhPJbYZq.js";
import "./logo-footer-B-zID-yv.js";
import "./landingExperiment-CJ-2oOZ6.js";
const a = () => {
  const { theme: e, setTheme: t } = o(),
    r = s.useRef(e);
  return (
    s.useEffect(
      () => (
        (r.current = e),
        e !== "light" && t("light"),
        () => {
          r.current !== "light" && t(r.current);
        }
      ),
      []
    ),
    i.jsx("div", {
      className: "min-h-screen",
      children: i.jsx(m, { showVideo: !1, experiment: !0 }),
    })
  );
};
export { a as default };
