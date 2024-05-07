import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import "chartjs-plugin-datalabels";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/pt-br";
import ContextValues from "./context/context-values"
import Context from './context'
import Router from "./router";
import { store, persistor } from "./store";
import "./global/global.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

moment.locale("pt-br");

const theme = createMuiTheme({
  typography: {
    fontFamily:
      "'Open Sans', Roboto, 'Helvetica Neue', Arial, Helvetica, sans-serif",
  },
});

function App() {
  return (
    // <MuiPickersUtilsProvider utils={DateFNSUtils}>
    <ThemeProvider theme={theme}>
      <Context.Provider value={ContextValues()}>,
        <MuiPickersUtilsProvider
          libInstance={moment}
          utils={MomentUtils}
          locale={"pt-br"}
        >
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Router />
            </PersistGate>
          </Provider>
        </MuiPickersUtilsProvider>
      </Context.Provider>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
