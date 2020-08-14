import React, { FC, useState, useEffect, useMemo } from "react";
import { browser, Tabs } from "webextension-polyfill-ts";
import Fuse from "fuse.js";

const Row: FC<Tabs.Tab> = ({ id, title }) => (
  <span
    className="result"
    onClick={() => browser.tabs.update(id, { active: true })}
    key={id}
  >
    {title}
  </span>
);

export const App: FC = () => {
  const [query, setQuery] = useState("");
  const [tabs, setTabs] = useState<Tabs.Tab[]>([]);
  const fuse = useMemo(() => new Fuse(tabs, { keys: ["title"] }), [tabs]);

  useEffect(() => {
    browser.tabs.query({}).then(setTabs);
  }, []);

  const res = query.length ? fuse.search(query).map((res) => res.item) : tabs;

  return (
    <div className="container">
      <input
        autoFocus
        className="search"
        type="text"
        value={query}
        onChange={({ target: { value } }) => setQuery(value)}
      />
      <div className="result-container">
        {res.map((tab) => (
          <Row {...tab} />
        ))}
      </div>
    </div>
  );
};
