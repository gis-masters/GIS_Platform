import React, { type FC, type ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Создаем тему с кастомными настройками для тултипов
const editFeatureTheme = createTheme({
  components: {
    MuiTooltip: {
      defaultProps: {
        enterDelay: 500 // Задержка 500ms для всех тултипов
      }
    }
  }
});

interface EditFeatureThemeProviderProps {
  children: ReactNode;
}

export const EditFeatureThemeProvider: FC<EditFeatureThemeProviderProps> = ({ children }) => {
  return <ThemeProvider theme={editFeatureTheme}>{children}</ThemeProvider>;
};
