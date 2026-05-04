# Navigation Diagnosis

## Symptoms reproduced
- **Hydration Stutter**: Navbar "flickers" or jumps slightly on initial load due to style mismatches.
- **Scroll Jank**: Noticeable stuttering when scrolling, especially on fast moves, likely caused by CSS/JS scroll conflicts.
- **Layout Shift**: Elements shifting slightly when the navbar scales, potentially fighting with the smooth scroll container.
- **Console Noise**: Constant warnings about scroll container positioning and duplicate React keys.

## Console errors found
- `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.` (src/components/ui/Navbar.tsx)
- `Please ensure that the container has a non-static position... to ensure scroll offset is calculated correctly.` (Multiple files, likely triggered by Lenis/Framer Motion)
- `Encountered two children with the same key, Python.` (src/components/sections/Stack.tsx or similar)
- `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` (Three.js/Fiber internal)

## Root causes identified
1. **CSS/JS Scroll Conflict** (`src/app/globals.css:126`): The presence of `scroll-behavior: smooth` on the `html` element directly conflicts with Lenis smooth scrolling, leading to "fighting" between the browser's native smooth scroll and the JS-driven one.
2. **Hydration Mismatch** (`src/components/ui/Navbar.tsx:88`): Framer Motion `useTransform` values are being applied on the client but are missing or different on the server-side render, causing a flash of unstyled/incorrectly styled content.
3. **Heavy MutationObserver** (`src/components/ui/CustomCursor.tsx:38`): A `MutationObserver` is scanning the entire DOM tree on every change to attach hover listeners, which is extremely expensive and causes main-thread jank during scroll and interactions.
4. **Missing Scroll Container Sync**: Lenis is initialized in `SmoothScroll.tsx` but its scroll position isn't explicitly synced with Framer Motion's `useScroll` global hook, which can lead to "one-frame-behind" visual lag in scroll-dependent animations.
5. **Duplicate Keys** (`src/components/sections/Stack.tsx`): Using non-unique keys (like language names "Python") in loops, which confuses React's reconciliation and can cause erratic UI behavior.

## Why these cause the symptoms
- The **CSS conflict** causes the browser to try and animate to a position while Lenis is also trying to interpolate it, resulting in "stuttering" or "jitter" on scroll.
- **Hydration mismatches** cause the browser to re-paint the navbar immediately after mounting, appearing as a flicker or jump.
- The **MutationObserver** in the cursor component blocks the main thread during DOM updates (common when sections come into view), causing frame drops during scroll.

## Recommended fix order
1. **Remove `scroll-behavior: smooth`** from `globals.css` to stop the conflict with Lenis.
2. **Fix Hydration** in `Navbar.tsx` by using a `mounted` state before applying scroll-dependent styles or ensuring server-side defaults match.
3. **Optimize CustomCursor**: Replace the global `MutationObserver` with a more efficient event delegation strategy or scoped observers.
4. **Sync Lenis with useScroll**: Update `SmoothScroll.tsx` to notify Framer Motion of scroll updates.
5. **Fix Section IDs and Keys**: Ensure all section IDs used in `Navbar` exist and all list items have unique keys.

## Risk assessment
- **Breaking Nav**: Changing the scroll behavior might temporarily affect anchor link "jumping" if Lenis isn't handling them perfectly.
- **Layout shifts**: Fixing the fixed positioning warnings might require adding `relative` or `fixed` to wrapper divs, which could affect child stacking contexts.
- **Test Plan**: After fixes, test anchor link accuracy, mobile menu transitions, and scroll performance using Chrome DevTools Performance tab.
