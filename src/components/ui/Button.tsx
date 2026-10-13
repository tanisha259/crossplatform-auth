import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          btn: styles.btnSecondary,
          txt: styles.txtSecondary,
          spinner: '#0F172A',
        };
      case 'outline':
        return {
          btn: styles.btnOutline,
          txt: styles.txtOutline,
          spinner: '#0284C7',
        };
      case 'danger':
        return {
          btn: styles.btnDanger,
          txt: styles.txtDanger,
          spinner: '#FFFFFF',
        };
      case 'ghost':
        return {
          btn: styles.btnGhost,
          txt: styles.txtGhost,
          spinner: '#0284C7',
        };
      case 'primary':
      default:
        return {
          btn: styles.btnPrimary,
          txt: styles.txtPrimary,
          spinner: '#FFFFFF',
        };
    }
  };

  const v = getVariantStyles();

  const sizeStyle =
    size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;
  const textSizeStyle =
    size === 'sm'
      ? styles.txtSizeSm
      : size === 'lg'
      ? styles.txtSizeLg
      : styles.txtSizeMd;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        v.btn,
        sizeStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator color={v.spinner} style={styles.iconMargin} />
        ) : icon ? (
          <View style={styles.iconMargin}>{icon}</View>
        ) : null}
        <Text style={[styles.txtBase, v.txt, textSizeStyle, textStyle]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconMargin: {
    marginRight: 8,
  },
  txtBase: {
    fontWeight: '600',
    textAlign: 'center',
  },
  // Sizes
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sizeMd: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sizeLg: {
    paddingVertical: 15,
    paddingHorizontal: 24,
  },
  txtSizeSm: {
    fontSize: 13,
  },
  txtSizeMd: {
    fontSize: 14,
  },
  txtSizeLg: {
    fontSize: 16,
  },
  // Variants
  btnPrimary: {
    backgroundColor: '#0284C7',
  },
  txtPrimary: {
    color: '#FFFFFF',
  },
  btnSecondary: {
    backgroundColor: '#F1F5F9',
  },
  txtSecondary: {
    color: '#0F172A',
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#0284C7',
  },
  txtOutline: {
    color: '#0284C7',
  },
  btnDanger: {
    backgroundColor: '#EF4444',
  },
  txtDanger: {
    color: '#FFFFFF',
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  txtGhost: {
    color: '#0284C7',
  },
  disabled: {
    opacity: 0.5,
  },
});
