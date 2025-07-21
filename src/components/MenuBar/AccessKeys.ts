import React from 'react';

// & defines access keys (contextual hotkeys) in menus and buttons and form labels, which get underlined in the UI.
// & can be escaped by doubling it, e.g. "&Taskbar && Start Menu" for "Taskbar & Start Menu" with T as the access key.

export function escape(label: string): string {
  return label.replace(/&/g, '&&');
}

export function unescape(label: string): string {
  return label.replace(/&&/g, '&');
}

export function indexOf(label: string): number {
  // The space here handles beginning-of-string matching and counteracts the offset for the [^&] so it acts like a negative lookbehind
  return ` ${label}`.search(/[^&]&[^&\s]/);
}

export function has(label: string): boolean {
  return indexOf(label) >= 0;
}

export function get(label: string): string | null {
  const index = indexOf(label);
  if (index >= 0) {
    return label.charAt(index + 1).toUpperCase();
  }
  return null;
}

export function toText(label: string): string {
  const index = indexOf(label);
  if (index >= 0) {
    return unescape(label.substring(0, index)) + unescape(label.substring(index + 1));
  }
  return unescape(label);
}

export function toReact(label: string): React.ReactNode {
  const index = indexOf(label);
  if (index >= 0) {
    return (
      <>
        {unescape(label.substring(0, index))}
        <u>{label.charAt(index + 1)}</u>
        {unescape(label.substring(index + 2))}
      </>
    );
  }
  return unescape(label);
}
