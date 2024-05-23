import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Api from "../../api"
import { withStyles, Switch, FormControlLabel } from "@material-ui/core"
import Tooltip from "../Tooltip"
import CustomList from "../CustomList"

const GreenSwitch = withStyles({
  switchBase: {
    "&$checked": {
      color: "#9ACD32",
    },
    "&$checked + $track": {
      backgroundColor: "#9ACD32",
    },
  },
  checked: {},
  track: {},
})(Switch)

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 24,
  },
  button: {
    margin: theme.spacing(1, 0),
    borderWidth: 1,
    borderColor: "#000",
  },
}))

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1)
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1)
}

export default function TransferList({
  hasProduct,
  onSelect,
  info,
  rawList = [],
  label = "Quero escolher",
  url = "/product/getFilterList",
  onCostChange = () => { },
  onOpenedHandle = () => { },
  visible = false,
  hasQuantity = false,
  selectAll = false
}) {
  const classes = useStyles()
  const [checked, setChecked] = useState([])
  const [left, setLeft] = useState([])
  const [right, setRight] = useState([])
  const [groupList, setGroupList] = useState([])
  const [show, setShow] = useState(hasProduct > 0)

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const excludeWaiterProduct = (list) => {
    return list.filter((i) => !i.name.toLowerCase().includes("garçom"))
  }

  const excludeWaiterGroup = (list) => {
    return list.filter((i) => !i.name.toLowerCase().includes("garçom"))
  }

  const filterUniqueList = (list) => {

    let uniqueList = []

    list.forEach((p) => {
      if (uniqueList.every(up => up.id !== p.id)) uniqueList.push(p)
    })

    return uniqueList
  }

  useEffect(() => {
    Api.get(url).then(({ data }) => {
      if (data.success) {
        const prods = []
        const selecteds = []
        data.products.map((product) => {
          const prod = rawList.find((prod) => prod.id === product.id)
          const item = {
            ...product,
            qtd: prod ? prod.qtd : 1,
          }
          if (prod) {
            selecteds.push(item)
          } else {
            prods.push(item)
          }
          return item
        })

        setLeft(filterUniqueList(excludeWaiterProduct(prods)))
        setRight(filterUniqueList(excludeWaiterProduct(selecteds)))
      } else {
        alert("Erro ao carregar os produtos")
      }
    })

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    Api.get("/group/getList").then(({ data }) => {
      setGroupList(excludeWaiterGroup(data.groups))
    })
  }, [])

  useEffect(() => {
    let costTotal = 0
    right.map((prod) => {
      costTotal += Number(prod.price_cost * prod.qtd)
      return prod
    })
    onCostChange(costTotal)
    onSelect(right)
  }, [onCostChange, onSelect, right])

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
    onSelect(right.concat(leftChecked))
  }

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked))
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
    onSelect(not(right, rightChecked))
  }

  return (
    <Grid container spacing={2} alignItems="center" className={classes.root}>
      {!visible && (
        <Grid item xs={12}>
          <Grid container spacing={2} direction="row" alignItems="center">
            <Grid item>
              <FormControlLabel
                control={
                  <GreenSwitch
                    checked={show}
                    onChange={(e) => {
                      setShow(e.target.checked)
                      onOpenedHandle(e.target.checked)
                    }}
                  />
                }
                label={label}
              />
            </Grid>
            <Grid item>
              {info && <Tooltip title={info} placement="right" />}
            </Grid>
          </Grid>
        </Grid>
      )}
      {show && (
        <>
          <Grid item md={6} xs={12}>
            <CustomList
              key={1}
              title="Produtos"
              items={left}
              setItems={setLeft}
              hasQuantity={hasQuantity}
              checked={checked}
              setChecked={setChecked}
              selectAll={selectAll}
              isSearch
              groupList={groupList}
              isGroupFilter={true}
            />
          </Grid>
          <Grid item md={1} xs={12}>
            <Grid container direction="column" alignItems="center">
              <Button
                variant="outlined"
                size="small"
                className={classes.button}
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                variant="outlined"
                size="small"
                className={classes.button}
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
            </Grid>
          </Grid>
          <Grid item md={5} xs={12}>
            <CustomList
              key={2}
              title="Selecionados"
              items={right}
              setItems={setRight}
              hasQuantity={hasQuantity}
              checked={checked}
              setChecked={setChecked}
              selectAll={selectAll}
              isSearch
              groupList={groupList}
              isGroupFilter={true}
            />
          </Grid>
        </>
      )}
    </Grid>
  )
}
