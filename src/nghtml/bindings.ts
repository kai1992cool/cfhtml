import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { resolveScopeValue } from './expressions';
import {
  enterAnimation,
  leaveAnimation,
  getAnimationCallback,
} from './animations';

export interface BindingResult {
  text: string;
  directives: Map<string, unknown>;
}

export function transformAngularOpeningTag(
  tag: string,
  scope: Map<string, unknown>,
  values: unknown[],
): BindingResult {
  const directives = new Map<string, unknown>();
  const attrBindingsForAnimation: Array<{ name: string; marker: string }> = [];
  let transformed = tag;
  const classes: Record<string, boolean> = {};
  const styles: Record<string, string | number | null | undefined> = {};
  let hasClassBinding = false;
  let hasStyleBinding = false;

  transformed = transformed.replace(
    /\s*\[animate\.(enter|leave)\]\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,
    (_full, mode: 'enter' | 'leave', _quote: string, quoted: string, unquoted: string) => {
      const raw = quoted ?? unquoted;
      const value = resolveBindingValue(raw, scope, values);
      const callback = getAnimationCallback(value);
      const marker = `__NGHTML_BINDING_${directives.size}__`;
      directives.set(
        String(directives.size),
        mode === 'enter'
          ? enterAnimation(callback ? undefined : value, callback)
          : leaveAnimation(callback ? undefined : value, callback),
      );
      attrBindingsForAnimation.push({ name: `data-cf-${mode}`, marker });
      return '';
    },
  );

  transformed = transformed.replace(
    /\s*animate\.(enter|leave)\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,
    (_full, mode: 'enter' | 'leave', _quote: string, quoted: string, unquoted: string) => {
      const value = resolveBindingValue(quoted ?? unquoted, scope, values);
      const marker = `__NGHTML_BINDING_${directives.size}__`;
      directives.set(
        String(directives.size),
        mode === 'enter'
          ? enterAnimation(value)
          : leaveAnimation(value),
      );
      attrBindingsForAnimation.push({ name: `data-cf-${mode}`, marker });
      return '';
    },
  );

  transformed = transformed.replace(
    /\s*\(animate\.(enter|leave)\)\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,
    (_full, mode: 'enter' | 'leave', _quote: string, quoted: string, unquoted: string) => {
      const raw = quoted ?? unquoted;
      const callback = getAnimationCallback(resolveBindingValue(raw, scope, values));
      const marker = `__NGHTML_BINDING_${directives.size}__`;
      directives.set(
        String(directives.size),
        mode === 'enter'
          ? enterAnimation(undefined, callback)
          : leaveAnimation(undefined, callback),
      );
      attrBindingsForAnimation.push({ name: `data-cf-${mode}-callback`, marker });
      return '';
    },
  );

  transformed = transformed.replace(
    /\s*\[(class(?:\.[A-Za-z_$][\w$-]*)?)\]\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,
    (_full, binding: string, _quote: string, quoted: string, unquoted: string) => {
      hasClassBinding = true;
      const value = resolveBindingValue(quoted ?? unquoted, scope, values);
      if (binding === 'class') normalizeClasses(value, classes);
      else classes[binding.slice('class.'.length)] = Boolean(value);
      return '';
    },
  );

  transformed = transformed.replace(
    /\s*\[(style(?:\.[A-Za-z_$][\w$.-]*)?)\]\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,
    (_full, binding: string, _quote: string, quoted: string, unquoted: string) => {
      hasStyleBinding = true;
      const value = resolveBindingValue(quoted ?? unquoted, scope, values);
      if (binding === 'style') {
        normalizeStyles(value, styles);
      } else {
        const parts = binding.slice('style.'.length).split('.');
        const unit = parts.length > 1 ? parts.pop() : undefined;
        const property = parts.join('-');
        styles[property] =
          value == null || value === false
            ? ''
            : typeof value === 'number' && unit
              ? `${value}${unit}`
              : value as string | number;
      }
      return '';
    },
  );

  const attrBindings: Array<{ name: string; marker: string }> = [];
  transformed = transformed.replace(
    /\s*\[attr\.([A-Za-z_:][A-Za-z0-9_.:-]*)\]\s*=\s*(?:(["'])([\s\S]*?)\2|([^\s>]+))/g,
    (_full, name: string, _quote: string, quoted: string, unquoted: string) => {
      let value = resolveBindingValue(quoted ?? unquoted, scope, values);
      if (value === true) value = '';
      else if (value == null || value === false) value = null;
      const marker = `__NGHTML_BINDING_${directives.size}__`;
      directives.set(String(directives.size), value);
      attrBindings.push({ name, marker });
      return '';
    },
  );

  for (const binding of attrBindings) {
    transformed = transformed.replace(/>$/, ` ${binding.name}=${binding.marker}>`);
  }
  for (const binding of attrBindingsForAnimation) {
    transformed = transformed.replace(/>$/, ` ${binding.name}=${binding.marker}>`);
  }
  if (hasClassBinding) {
    const marker = `__NGHTML_BINDING_${directives.size}__`;
    directives.set(String(directives.size), classMap(classes));
    transformed = transformed.replace(/>$/, ` class=${marker}>`);
  }
  if (hasStyleBinding) {
    const marker = `__NGHTML_BINDING_${directives.size}__`;
    directives.set(String(directives.size), styleMap(styles));
    transformed = transformed.replace(/>$/, ` style=${marker}>`);
  }
  return { text: transformed, directives };
}

function resolveBindingValue(
  raw: string,
  scope: Map<string, unknown>,
  values: unknown[],
): unknown {
  const exactMarker = raw.match(/^__NGHTML_VALUE_(\d+)__$/);
  if (exactMarker) return values[Number(exactMarker[1])];

  if (/__NGHTML_VALUE_\d+__/.test(raw)) {
    raw = raw.replace(/__NGHTML_VALUE_(\d+)__/g, (_match, index: string) =>
      String(values[Number(index)] ?? ''),
    );
  }

  raw = raw.replace(
    /\{\{\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\}\}/g,
    (_match, path: string) => String(resolveScopeValue(scope, path) ?? ''),
  );
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (raw === 'null') return null;
  if (/^-?(?:\d+|\d*\.\d+)$/.test(raw)) return Number(raw);
  return raw;
}

function normalizeClasses(value: unknown, classes: Record<string, boolean>): void {
  if (typeof value === 'string') {
    value.split(/\s+/).filter(Boolean).forEach((name) => { classes[name] = true; });
  } else if (Array.isArray(value)) {
    value.forEach((name) => {
      if (typeof name === 'string') classes[name] = true;
    });
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([name, enabled]) => {
      classes[name] = Boolean(enabled);
    });
  }
}

function normalizeStyles(
  value: unknown,
  styles: Record<string, string | number | null | undefined>,
): void {
  if (typeof value === 'string') {
    value.split(';').forEach((declaration) => {
      const separator = declaration.indexOf(':');
      if (separator === -1) return;
      const property = declaration.slice(0, separator).trim();
      const setting = declaration.slice(separator + 1).trim();
      if (property) styles[property] = setting;
    });
  } else if (value && typeof value === 'object') {
    Object.assign(styles, value);
  }
}
