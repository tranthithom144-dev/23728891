import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import { Typography } from './Typography';

interface ShopInputProps extends TextInputProps {
  label?: string;
  error?: boolean;
}

export const ShopInput: React.FC<ShopInputProps> = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Typography variant="medium" style={styles.label}>{label}</Typography>}
      <TextInput
        style={[styles.input, error && styles.errorInput, style]}
        placeholderTextColor="#5F7A77"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', marginVertical: 6 },
  label: { marginBottom: 4 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    color: '#134E4A',
  },
  errorInput: { borderColor: '#DC2626' },
});
