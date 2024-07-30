import { AppRegistry } from 'react-native';
import name from './app.json';
import App from './App';


/**
 * Order management for WEB is not yet available
 */
AppRegistry.registerComponent(name, () => App);
AppRegistry.runApplication(name, {
  initialProps: {},
  rootTag: document.getElementById('app-root')
});