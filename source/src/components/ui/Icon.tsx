import type { CSSProperties } from 'react';
import plus from '../../assets/figma-icons/plus.svg?url';
import arrowRight from '../../assets/figma-icons/arrow-right.svg?url';
import back from '../../assets/figma-icons/back.svg?url';
import navHome from '../../assets/figma-icons/nav-home.svg?url';
import navSessions from '../../assets/figma-icons/nav-sessions.svg?url';
import navExplore from '../../assets/figma-icons/nav-explore.svg?url';
import navCalm from '../../assets/figma-icons/nav-calm.svg?url';
import navProfile from '../../assets/figma-icons/nav-profile.svg?url';
import step from '../../assets/figma-icons/step.svg?url';
import tagSleep from '../../assets/figma-icons/tag-sleep.svg?url';
import tagMeditation from '../../assets/figma-icons/tag-meditation.svg?url';
import tagWork from '../../assets/figma-icons/tag-work.svg?url';
import tagFamily from '../../assets/figma-icons/tag-family.svg?url';
import tagHealth from '../../assets/figma-icons/tag-health.svg?url';
import tagSocial from '../../assets/figma-icons/tag-social.svg?url';
import tagFinances from '../../assets/figma-icons/tag-finances.svg?url';
import tagNature from '../../assets/figma-icons/tag-nature.svg?url';
import calendar from '../../assets/figma-icons/calendar.svg?url';
import bell from '../../assets/figma-icons/bell.svg?url';
import chevronRight from '../../assets/figma-icons/chevron-right.svg?url';
import energy from '../../assets/figma-icons/energy.svg?url';
import stress from '../../assets/figma-icons/stress.svg?url';
import trendUp from '../../assets/figma-icons/trend-up.svg?url';
import trendDown from '../../assets/figma-icons/trend-down.svg?url';
import check from '../../assets/figma-icons/check.svg?url';
import play from '../../assets/figma-icons/play.svg?url';
import close from '../../assets/figma-icons/close.svg?url';
import rewind15 from '../../assets/figma-icons/rewind-15.svg?url';
import forward15 from '../../assets/figma-icons/forward-15.svg?url';
import pause from '../../assets/figma-icons/pause.svg?url';
import moon from '../../assets/figma-icons/moon.svg?url';
import verified from '../../assets/figma-icons/verified.svg?url';
import backSmall from '../../assets/figma-icons/back-small.svg?url';
import help from '../../assets/figma-icons/help.svg?url';
import shieldCheck from '../../assets/figma-icons/shield-check.svg?url';
import lock from '../../assets/figma-icons/lock.svg?url';
import discountTag from '../../assets/figma-icons/discount-tag.svg?url';
import bag from '../../assets/figma-icons/bag.svg?url';
import bubbleIcon from '../../assets/figma-icons/bubble-icon.svg?url';
import sparkleSmall from '../../assets/figma-icons/sparkle-small.svg?url';
import search from '../../assets/figma-icons/search.svg?url';
import settings from '../../assets/figma-icons/settings.svg?url';
import star from '../../assets/figma-icons/star.svg?url';
import more from '../../assets/figma-icons/more.svg?url';
import clock from '../../assets/figma-icons/clock.svg?url';
import users from '../../assets/figma-icons/users.svg?url';
import therapist from '../../assets/figma-icons/therapist.svg?url';
import verifiedBadge from '../../assets/figma-icons/verified-badge.svg?url';

export const ICONS = {
  plus,
  arrowRight,
  back,
  navHome,
  navSessions,
  navExplore,
  navCalm,
  navProfile,
  step,
  tagSleep,
  tagMeditation,
  tagWork,
  tagFamily,
  tagHealth,
  tagSocial,
  tagFinances,
  tagNature,
  calendar,
  bell,
  chevronRight,
  energy,
  stress,
  trendUp,
  trendDown,
  check,
  play,
  close,
  rewind15,
  forward15,
  pause,
  moon,
  verified,
  backSmall,
  help,
  shieldCheck,
  lock,
  discountTag,
  bag,
  bubbleIcon,
  sparkleSmall,
  search,
  settings,
  star,
  more,
  clock,
  users,
  therapist,
  verifiedBadge,
} as const;
export type IconName = keyof typeof ICONS;
export function Icon({
  name,
  size = 20,
  className,
  style,
}: {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const url = ICONS[name];
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        flex: '0 0 auto',
        lineHeight: 0,
        verticalAlign: 'middle',
        backgroundColor: 'currentColor',
        mask: `url("${url}") center / contain no-repeat`,
        WebkitMask: `url("${url}") center / contain no-repeat`,
        ...style,
      }}
    />
  );
}
