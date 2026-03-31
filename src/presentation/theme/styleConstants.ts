import { Platform, ViewStyle } from 'react-native';

// --- Border Radius ---

/** Used for inputs, small buttons, and item containers */
export const BORDER_RADIUS_SM = 8;

/** Used for modal cards, chips, and bottom sheet corners */
export const BORDER_RADIUS_MD = 16;

// --- Opacity ---

/** Standard opacity for disabled interactive elements */
export const DISABLED_OPACITY = 0.5;

// --- Overlay ---

/** Semi-transparent black backdrop for modals and bottom sheets */
export const OVERLAY_BACKGROUND_COLOR = 'rgba(0, 0, 0, 0.5)';

// --- Shadow / Elevation ---

/** Shadow applied to modal cards (AddSectionFAB, ConfirmationModal) */
export const CARD_SHADOW: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  android: {
    elevation: 5,
  },
}) as ViewStyle;
