import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function baseProps(props: IconProps) {
  const { size = 18, ...rest } = props;
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...rest
  };
}

export function IconHome(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10.5V21h14V10.5" />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

export function IconFolder(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M3.5 6.5h6l2 2H20a1.5 1.5 0 0 1 1.5 1.5v8A2 2 0 0 1 19.5 20h-14A2 2 0 0 1 3.5 18V6.5Z" />
      <path d="M3.5 8.5V6.8A2.3 2.3 0 0 1 5.8 4.5h4.2l2 2" />
    </svg>
  );
}

export function IconInbox(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 4h16v10l-3 6H7l-3-6V4Z" />
      <path d="M4 14h5l1 2h4l1-2h5" />
    </svg>
  );
}

export function IconChart(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 19V5" />
      <path d="M8 19v-8" />
      <path d="M12 19v-4" />
      <path d="M16 19v-10" />
      <path d="M20 19V9" />
    </svg>
  );
}

export function IconArrows(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7 7h10v10" />
      <path d="M17 7 7 17" />
      <path d="M7 17H4v-3" />
      <path d="M17 7h3v3" />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 3 20 7v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4Z" />
      <path d="M9.5 12.5 11 14l3.5-4" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function IconTag(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M20 13 11 22 2 13V2h11l7 7-3 4Z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </svg>
  );
}

