import React from 'react';
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

interface EditFeatureContainerThemeProviderProps {
  children: React.ReactNode;
}

export const EditFeatureContainerThemeProvider: React.FC<EditFeatureContainerThemeProviderProps> = ({ children }) => {
  return <ThemeProvider theme={editFeatureTheme}>{children}</ThemeProvider>;
};
