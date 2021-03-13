import { AppProps } from "next/app";
import '../styles/global.css'
import 'react-widgets/dist/css/react-widgets.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Component {...pageProps} />
  );
};

export default App;
