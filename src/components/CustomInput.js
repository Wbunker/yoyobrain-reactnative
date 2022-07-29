import React from 'react';
import {Controller} from 'react-hook-form';
import {View, StyleSheet, TextInput, Text} from 'react-native';
import { theme } from '../styles/theme';

const CustomInput = ({
  control,
  name,
  rules = {},
  placeholder,
  secureTextEntry,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => {
        return (
          <>
            <View style={[styles.container, error ? styles.error : {}]}>
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                style={styles.input}
                secureTextEntry={secureTextEntry}
              />
            </View>
            {error && (
              <Text style={styles.errorText}>{error.message || 'Error'}</Text>
            )}
          </>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  error: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    alignSelf: 'stretch',
  },

  input: {
    fontSize: theme.textVariants.body.fontSize
  },
});

export default CustomInput;
