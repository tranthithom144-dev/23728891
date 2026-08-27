import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Typography } from './Typography';

interface ShopButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  variant?: 'primary' | 'outline' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ShopButton: React.FC<ShopButtonProps> = ({
  title,
  onPress,
  isLoading,
  variant = 'primary',
  disabled,
  style,
  textStyle,
}) => {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      style={({ pressed }) => [
        styles.button,
        isPrimary && styles.primary,
        isDanger && styles.danger,
        variant === 'outline' && styles.outline,
        (disabled || isLoading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#0F766E'} />
      ) : (
        <Typography
          variant="medium"
          color={isPrimary || isDanger ? '#FFFFFF' : '#0F766E'}
          style={textStyle}
        >
          {title}
        </Typography>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  primary: { backgroundColor: '#0F766E' },
  danger: { backgroundColor: '#DC2626' },
  outline: { borderWidth: 1, borderColor: '#0F766E', backgroundColor: 'transparent' },
  disabled: { opacity: 0.6 },
  pressed: { opacity: 0.8 },
});
