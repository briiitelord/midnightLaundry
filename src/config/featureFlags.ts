/**
 * Feature Flags Configuration
 * Toggle features on/off for testing and rollback purposes
 */

export const FEATURE_FLAGS = {
  /**
   * Use dedicated VideoPlayer component for direct video files
   * Set to false to revert to previous iframe-based rendering
   */
  USE_VIDEO_PLAYER_COMPONENT: true,

  /**
   * Use dedicated MediaPlayer component for embed URLs (music/video)
   * Set to false to revert to simple iframe rendering
   */
  USE_ENHANCED_EMBED_HANDLING: true,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;
