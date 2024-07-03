import React, { useState, useEffect, useCallback } from "react"
import {
  Grid,
  Button,
  TextField,
} from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { connect } from 'react-redux';

import EaseGrid from "../../../components/EaseGrid"
import ButtonRound from "../../../components/ButtonRound"

import Api from "../../../api"
import * as fn from "./utils"

import productsIcon from "../../../assets/icons/ic_produtos.svg"
import useStyles from "../../../global/styles"

const BatchesPage = ({ event }) => {
  const styles = useStyles()

  const history = useHistory()
  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const [type] = useState("todos")
  const [group, setGroup] = useState("todos")
  const [status] = useState("todos")
  const [groupList] = useState([])
  const [loading, setLoading] = useState(false)

  const getDateStr = (date) => {
    const d = new Date(date)

    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth()).padStart(2, "0")
    const year = d.getFullYear()

    return `${day}/${month}/${year}`
  }

  const columns = [
    { title: "Nome", field: "batch_name" },
    { title: "Quantidade", field: "quantity" },
    {
      title: "Data expiração",
      field: "data_expiracao",
      render: ({ data_expiracao }) => getDateStr(data_expiracao)
    },
  ]

  useEffect(() => {
    Api.get(`/${event}/batches`)
      .then(async ({ data }) => {
        const list = data.sort((a, b) => new Date(a.created_at).getTime() > new Date(b.created_at).getTime() ? -1 : 1)

        console.log(list)

        setData(list)
      })
  }, [event])

  const handleQuery = useCallback(async (props) => {
    try {
      fn.handleQuery(props, setData, group, search, status, type)
    } catch (error) {
      console.log(error)
    }
  }, [group, search, status, type])

  useEffect(() => {
    if (groupList.length === 0) return

    const group = localStorage.getItem("GROUP_SAVED")

    if (group && group !== "combo") {
      setGroup(group)
      handleQuery({ group })
    } else {
      handleQuery({})
    }
  }, [groupList, handleQuery])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    handleQuery({ search: e.target.value })
  }

  const onRowUpdate = async (newData, oldData) => {
    const promises = []
    if (oldData.name !== newData.name) {
      promises.push(
        Api.patch(`/batch/updateName/${newData.id}`, {
          type: newData.type,
          name: newData.name,
        })
      )
    }
    if (oldData.price_sell !== newData.price_sell) {
      promises.push(
        Api.patch(`/batch/updatePrice/${newData.id}`, {
          type: newData.type,
          price: newData.price_sell,
        })
      )
    }
    if (oldData.status !== newData.status) {
      promises.push(
        Api.patch(`/batch/updateStatus/${newData.id}`, {
          type: newData.type,
          status: newData.status,
        })
      )
    }

    await Promise.all(promises).then(() => newData)

    setData((previous) =>
      previous.map((item) => {
        if (item.id === oldData.id) {
          return newData
        }

        return item
      })
    )
  }

  const handleEdit = (row) => {
    const url = `/dashboard/batches/simple/${row.id}`
    history.push(url)
  }

  const handleDelete = async (row) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      if (loading) return false

      setLoading(true)
      const url = `/batch/simple/${row.id}`
      const { data } = await Api.delete(url)

      if (!data) alert("Houve um erro ao deletar o lote")

      await handleQuery({})
      setLoading(false)
    }
  }

  const handleCreateBatch = () => {
    history.push("/dashboard/batches/simple/new")
  }

  return (
    <>
      <Grid container direction="column" spacing={2} style={{ flexWrap: "nowrap" }}>
        <Grid item lg md sm xs className={styles.productsHeaderWrp}>
          <div className={styles.productsHeaderContainer}>
            <Grid container direction="row" spacing={2}>
              <Grid item className={styles.registerBtnWrapper}>
                <ButtonRound
                  variant="contained"
                  color="primary"
                  onClick={handleCreateBatch}
                >
                  Cadastrar Lote
                </ButtonRound>
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item lg md sm xs>
          <Grid container direction="row" spacing={2}>
            <Grid item>
              <TextField
                value={search}
                onChange={handleSearch}
                variant="outlined"
                label="Pesquisar"
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item lg md sm xs>
          <EaseGrid
            data={data.filter(b => b.batch_name.toLowerCase().includes(search.toLowerCase()))}
            columns={columns}
            hasSearch={false}
            actionsRight={true}
            actions={[
              {
                icon: () => (
                  <Button variant="outlined" color="primary" size="small">
                    Editar
                  </Button>
                ),
                tooltip: "Editar",
                onClick: (event, rowData) => {
                  handleEdit(rowData)
                },
              },
              {
                icon: () => (
                  <Button variant="outlined" color="secondary" size="small">
                    Excluir
                  </Button>
                ),
                tooltip: "Excluir",
                onClick: (event, rowData) => {
                  handleDelete(rowData)
                },
              },
            ]}
            editable={{
              isEditHidden: (rowData) => true,
              onRowUpdate,
            }}
          />
        </Grid>
        {/* 
        <Grid
          item
          style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
        >
          <ButtonRound
            variant="contained"
            style={{ height: 30, color: "white", backgroundColor: "red" }}
            onClick={disabelAll}
          >
            Inativar Produtos
          </ButtonRound>
        </Grid> */}
      </Grid>
    </>
  )
}

export const Icon = () => {
  return <img src={productsIcon} alt="Ícone produtos" />
}

const mapStateToProps = ({ event, events }) => ({ event, events });

export default connect(mapStateToProps)(BatchesPage)
