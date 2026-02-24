'use client';

import GlobalAmbient from './GlobalAmbient';
import ScrollProgress from './ScrollProgress';
import CursorSpotlight from './CursorSpotlight';

/**
 * Premium enhancements — global ambient, scroll progress, cursor spotlight.
 * Wraps all PJAZZA pages for a cohesive alive experience.
 */
export default function PjazzaEnhancements() {
  return (
    <>
      <GlobalAmbient />
      <ScrollProgress />
      <CursorSpotlight />
    </>
  );
}
