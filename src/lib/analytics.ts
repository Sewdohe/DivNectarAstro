/**
 * Umami Analytics Helper Functions
 * Provides easy-to-use functions for tracking custom events
 */

// Check if umami is available (window.umami gets injected by the script)
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
}

/**
 * Track a custom event with Umami
 * @param eventName - Name of the event (e.g., "button-click", "external-link")
 * @param eventData - Optional data to attach to the event
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, eventData);
  }
}

/**
 * Track navigation clicks
 */
export function trackNavigation(linkName: string, destination: string) {
  trackEvent('navigation-click', {
    link: linkName,
    destination: destination,
  });
}

/**
 * Track external link clicks
 */
export function trackExternalLink(linkName: string, url: string) {
  trackEvent('external-link', {
    link: linkName,
    url: url,
  });
}

/**
 * Track blog post interactions
 */
export function trackBlogRead(postTitle: string, category?: string) {
  trackEvent('blog-read', {
    title: postTitle,
    category: category || 'uncategorized',
  });
}

export function trackBlogScrollDepth(postTitle: string, depthPercent: number) {
  trackEvent('blog-scroll', {
    title: postTitle,
    depth: depthPercent,
  });
}

export function trackBlogReadTime(postTitle: string, timeSeconds: number) {
  trackEvent('blog-time-spent', {
    title: postTitle,
    seconds: timeSeconds,
  });
}

/**
 * Track user authentication events
 */
export function trackLogin(provider: string) {
  trackEvent('user-login', {
    provider: provider,
  });
}

export function trackLogout() {
  trackEvent('user-logout');
}

/**
 * Track theme changes
 */
export function trackThemeChange(theme: 'light' | 'dark') {
  trackEvent('theme-change', {
    theme: theme,
  });
}

/**
 * Track button/CTA clicks
 */
export function trackCTA(buttonName: string, location: string) {
  trackEvent('cta-click', {
    button: buttonName,
    location: location,
  });
}

/**
 * Track search/filter actions
 */
export function trackSearch(query: string, resultCount: number) {
  trackEvent('search', {
    query: query,
    results: resultCount,
  });
}

/**
 * Track social media clicks
 */
export function trackSocial(platform: string, action: string) {
  trackEvent('social-interaction', {
    platform: platform,
    action: action,
  });
}

/**
 * Track errors or issues
 */
export function trackError(errorType: string, message?: string) {
  trackEvent('error', {
    type: errorType,
    message: message || 'Unknown error',
  });
}

/**
 * Track form submissions
 */
export function trackFormSubmit(formName: string, success: boolean) {
  trackEvent('form-submit', {
    form: formName,
    success: success,
  });
}
