import React, { useContext } from 'react';
import {Controller} from 'react-hook-form';
import {View, StyleSheet, TextInput, Text} from 'react-native';
import { ThemeContext } from '../styles/theme-context';

const CustomInput = ({
  control,
  name,
  rules = {},
  placeholder,
  secureTextEntry,
}) => {

  const themeFromContext = useContext(ThemeContext)

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      width: '100%',
      borderColor: themeFromContext.colors.grey,
      borderWidth: themeFromContext.spacing.xxxs,
      borderRadius: themeFromContext.spacing.xs,
      paddingHorizontal: themeFromContext.spacing.s,
      marginVertical: themeFromContext.spacing.xs,
    },
    error: {
      borderColor: themeFromContext.colors.failure,
    },
    errorText: {
      color: themeFromContext.colors.failure,
      alignSelf: 'stretch',
    },
  
    input: {
      fontSize: themeFromContext.textVariants.body.fontSize
    },
  });
  

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


export default CustomInput;
