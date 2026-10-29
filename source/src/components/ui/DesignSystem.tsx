import type { ReactNode, ButtonHTMLAttributes } from 'react';
export type ButtonVariant =
  | 'primary-pill'
  | 'secondary-pill'
  | 'icon-circle-44'
  | 'icon-circle-40'
  | 'icon-circle-36'
  | 'icon-circle-32'
  | 'text-link';
export function Button({
  children,
  variant = 'primary-pill',
  ...props
}: { children: ReactNode; variant?: ButtonVariant } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls =
    variant === 'primary-pill'
      ? 'primary-button'
      : variant === 'secondary-pill'
        ? 'secondary-button'
        : variant === 'text-link'
          ? 'text-link'
          : `icon-circle ${variant}`;
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
export type PillVariant = 'eyebrow' | 'status' | 'filter' | 'toggle' | 'influence';
export function Pill({
  children,
  variant = 'filter',
  selected = false,
}: {
  children: ReactNode;
  variant?: PillVariant;
  selected?: boolean;
}) {
  return <span className={`pill pill-${variant}${selected ? ' selected' : ''}`}>{children}</span>;
}
export type CardVariant = 'feature-gradient' | 'white-32' | 'blush' | 'checkout-16';
export function Card({
  children,
  variant = 'white-32',
}: {
  children: ReactNode;
  variant?: CardVariant;
}) {
  return <div className={`card card-${variant}`}>{children}</div>;
}
export function ProgressBar({ value = 60 }: { value?: number }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  );
}
export function StepSegments({ step = 1 }: { step?: 1 | 2 }) {
  return (
    <div className="step-segments" aria-label={`Step ${step} of 2`}>
      {[1, 2].map((n) => (
        <i className={n <= step ? 'on' : ''} key={n} />
      ))}
    </div>
  );
}
export function BottomSheet({ children }: { children: ReactNode }) {
  return (
    <div className="sheet-demo" role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
export function Toast({ children }: { children: ReactNode }) {
  return (
    <div className="toast-demo" role="status">
      {children}
    </div>
  );
}
export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="empty-demo">{children}</div>;
}
export function Skeleton() {
  return <div className="skeleton" aria-hidden="true" />;
}
