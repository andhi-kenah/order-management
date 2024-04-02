import '@react-navigation/native'

declare module '@react-navigation/native' {
    export type Theme = {
        colors: {
            background: string;
            text: string;
            primary: string;
            secondary: string;
            componentColor: string;
          };
        dark: boolean;
    };
    export function useTheme(): Theme;
}