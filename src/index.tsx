import React from 'react';
import type { PluginComponentProps } from './hs-plugin';
import { frame, ink, Icon, I, useNow, dayKey } from './ui';

export function nextOccurrences(spec: string, todayKey: string): { name: string; date: string; days: number }[] {
  const today = new Date(todayKey + 'T12:00:00');
  return String(spec || '').split('\n').map((l) => l.split('|').map((s) => s.trim())).filter((p) => p[0] && p[1]).map(([name, d]) => {
    let date: string;
    if (/^\d{2}-\d{2}$/.test(d)) { date = `${todayKey.slice(0, 4)}-${d}`; if (date < todayKey) date = `${Number(todayKey.slice(0, 4)) + 1}-${d}`; }
    else date = d;
    const days = Math.round((new Date(date + 'T12:00:00').getTime() - today.getTime()) / 86400000);
    return { name, date, days };
  }).filter((x) => x.days >= 0 && !isNaN(x.days)).sort((a, b) => a.days - b.days);
}

export default function Countdowns({ config, style, timezone: tz }: PluginComponentProps) {
  const now = useNow(300000);
  const accent = String(config.accentColor || '#b45309');
  const list = nextOccurrences(String(config.items ?? ''), dayKey(now, tz)).slice(0, Number(config.max ?? 3));
  if (!list.length) return <div style={frame(style, { alignItems: 'center', justifyContent: 'center', opacity: 0.4 })}><Icon d={I.gift} size="1.6em" stroke={1.5} /><div style={{ fontSize: '0.8em', marginTop: '0.3em' }}>Add countdowns in the module settings</div></div>;
  return (
    <div style={frame(style, { flexDirection: 'row', gap: '0.7em', alignItems: 'stretch' })}>
      {list.map((x, i) => (
        <div key={x.name + x.date} style={{ flex: 1, minWidth: 0, borderRadius: '0.7em', padding: '0.7em 0.9em', background: i === 0 ? `color-mix(in srgb, ${accent} 12%, transparent)` : ink(style, 0.05), display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '3em', fontWeight: 300, lineHeight: 1, color: i === 0 ? accent : 'inherit', letterSpacing: '-0.02em' }}>{x.days === 0 ? 'Today!' : x.days}</div>
          <div style={{ fontSize: '0.7em', opacity: 0.5, marginTop: '0.2em' }}>{x.days === 0 ? '' : x.days === 1 ? 'day until' : 'days until'}</div>
          <div style={{ fontSize: '0.95em', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.name}</div>
          <div style={{ fontSize: '0.62em', opacity: 0.45 }}>{new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(x.date + 'T12:00:00'))}</div>
        </div>
      ))}
    </div>
  );
}
