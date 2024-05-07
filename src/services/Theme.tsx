import { useColorScheme } from 'react-native';

const useTheme = () => useColorScheme() === 'dark';

export default useTheme;