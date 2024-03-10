import { Grid } from "@mui/material";

import kanbex from "../../assets/images/kanbex.png";

const Loading = () => {
  return (
    <Grid container>
      <Grid item lg={12} md={12} sm={12} style={{ display: "flex" }} xs={12}>
        <Grid container alignItems="center" justifyContent="center">
          <div className="app">
            <header className="app-header">
              <img alt="logo" className="app-logo" src={kanbex} />
            </header>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Loading;
