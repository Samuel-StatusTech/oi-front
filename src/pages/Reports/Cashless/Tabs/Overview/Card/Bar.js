import React, { memo } from "react";
import { Card, CardContent, Typography, Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modalItens: {
    display: "grid",
    alignItems: "center",
    justifyContent: "center",
  },
  numberRanking: {
    display: "flex",
    borderRadius: "50%",
    width: "1.6em",
    height: "1.6em",
    alignItems: "center",
    justifyContent: "center",
    background: "#0097ff",
    color: "#fff",
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: "30px",
    color: "#747474",
    textAlign: "center",
  },
  productName: {
    marginLeft: "12px",
    fontSize: "14px",
    color: "#747474",
  },
  containerRanking: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    marginRight: "1rem",
  },
}));

export default memo(({ money = 0, credit = 0, debit = 0 }) => {
  const classes = useStyles();

  return (
    <Card style={{ height: "100%" }}>
      <CardContent style={{ height: "100%" }}>
        <Grid item xs={12}>
          <Grid style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            <Grid item style={{ marginTop: "10px" }}>
              <Typography className={classes.title}>Mais Vendidos</Typography>
              <Grid container>
                <Grid item>
                  <div className={classes.containerRanking}>
                    <div className={classes.numberRanking}>1</div>
                    <label className={classes.productName}>Coca-Cola - R$ 5,00</label>
                  </div>
                  <div className={classes.containerRanking}>
                    <div className={classes.numberRanking}>2</div>
                    <label className={classes.productName}>Coxinha - R$ 3,00</label>
                  </div>
                  <div className={classes.containerRanking}>
                    <div className={classes.numberRanking}>3</div>
                    <label className={classes.productName}>Heineken - R$ 7,00</label>
                  </div>
                  <div className={classes.containerRanking}>
                    <div className={classes.numberRanking}>4</div>
                    <label className={classes.productName}>Stella - R$ 3,00</label>
                  </div>
                  <div className={classes.containerRanking}>
                    <div className={classes.numberRanking}>5</div>
                    <label className={classes.productName}>Absolut - R$ 99,00</label>
                  </div>
                </Grid>
                <Grid item>
                  <div className={classes.containerRanking}>
                    <div className={classes.numberRanking}>6</div>
                    <label className={classes.productName}>Absolut - R$ 99,00</label>
                  </div>
                  <div className={classes.containerRanking}>
                    <div className={classes.numberRanking}>7</div>
                    <label className={classes.productName}>Absolut - R$ 99,00</label>
                  </div>
                  <div className={classes.containerRanking}>
                    <div className={classes.numberRanking}>8</div>
                    <label className={classes.productName}>Absolut - R$ 99,00</label>
                  </div>
                  <div className={classes.containerRanking}>
                    <div className={classes.numberRanking}>9</div>
                    <label className={classes.productName}>Absolut - R$ 99,00</label>
                  </div>
                  <div className={classes.containerRanking}>
                    <div className={classes.numberRanking}>10</div>
                    <label className={classes.productName}>Absolut - R$ 99,00</label>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});
