import { useWindowDimensions, Platform, DimensionValue } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isWeb = Platform.OS === 'web';

  const contentMaxWidth: DimensionValue = isDesktop ? 1040 : isTablet ? 720 : '100%';

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isWeb,
    contentMaxWidth,
  };
}
