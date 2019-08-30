import {AppRegistry} from 'react-native';
import App from './App';
import ReduxTest from './ReduxTest'
import ReduxExample from './ReduxExample'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => ReduxExample, false);
