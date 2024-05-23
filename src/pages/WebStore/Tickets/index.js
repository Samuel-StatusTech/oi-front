import React, { useState, useEffect, useCallback } from "react"
import {
  Grid,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  CircularProgress,
  DialogActions,
  DialogContent,
} from "@material-ui/core"
import { useHistory } from "react-router-dom"

import InputMoney from "../../../components/Input/Money"
import EaseGrid from "../../../components/EaseGrid"
import ButtonRound from "../../../components/ButtonRound"

import Api from "../../../api"
import { format } from "currency-formatter"
import * as txt from "./text"
import * as fn from "./utils"

import productsIcon from "../../../assets/icons/ic_produtos.svg"
import useStyles from "../../../global/styles"

const TicketsPage = () => {
  const styles = useStyles()

  const history = useHistory()
  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const [type] = useState("todos")
  const [group, setGroup] = useState("todos")
  const [status, setStatus] = useState("todos")
  const [groupList, setGroupList] = useState([])
  const [loading, setLoading] = useState(false)
  const [newData, setNewData] = useState(null)
  const [errData, setErrData] = useState([])
  const [confirmDialogShow, setConfirmDialogShow] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [dialogMessage, setDialogMessage] = useState(
    "Deseja realmente cadastrar esses produtos?"
  )
  const [isRegisterMade, setIsRegisterMade] = useState(false)

  const columns = [
    {
      title: "Tipo",
      field: "type",
      lookup: {
        bar: "Bar",
        ingresso: "Ingresso",
        estacionamento: "Estacionamento",
        combo: "Combo",
        complement: "Complemento",
      },
      editable: "never",
      cellStyle: {
        width: "10%",
        maxWidth: "10%",
      },
      headerStyle: {
        width: "10%",
        maxWidth: "10%",
      },
    },
    {
      title: "Grupo",
      field: "group.name",
      editable: "never",
    },
    { title: "Nome", field: "name" },
    {
      title: "Valor",
      field: "price_sell",
      render: ({ price_sell }) => format(price_sell / 100, { code: "BRL" }),
      editComponent: (props) => (
        <InputMoney
          size="small"
          variant="outlined"
          value={props.value}
          onChange={(e) => props.onChange(e.value)}
        />
      ),
    },
    {
      title: "Situação",
      field: "status",
      render: ({ status }) => (status && status !== "0" ? "Ativo" : "Inativo"),
      editComponent: (props) => (
        <Select
          value={props.value}
          label="Situação"
          variant="outlined"
          onChange={(e) => props.onChange(e.target.value)}
          fullWidth
        >
          <MenuItem value="1">Ativo</MenuItem>
          <MenuItem value="0">Inativo</MenuItem>
        </Select>
      ),
    },
  ]

  useEffect(() => {
    Api.get(`/ecommerce/product/getList`).then(async ({ data }) => {

      const { success } = data

      if (success) {
        let groups = []

        data.products.forEach(p => {
          if (groups.every(g => g.id !== p.group.id) && Boolean(p.group.status)) groups.push(p.group)
        })
        setData(data.products
          .sort((a, b) => (a.group.name.toLowerCase().localeCompare(b.group.name.toLowerCase())))
        )
        console.log(groups)

        setGroupList([
          { id: "todos", name: "Todos" },
          ...groups
            .sort((a, b) => {
              if (a.name < b.name) return -1
              if (a.name > b.name) return 1
              return 0
            }),
        ])
      } else {
        alert("Erro ao carregar os grupos")
      }
    })
  }, [])

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

  const disabelAll = async () => {
    if (loading) {
      return false
    }

    if (
      window.confirm("Você tem certeza que deseja inativar todos os produtos?")
    ) {
      setLoading(true)
      await Api.put("/product/disableAll", {
        products: data.map((item) => item.id),
      })
      handleQuery({})
      setLoading(false)
    }
  }

  const handleGroup = (e) => {
    const type = e.target.value
    setGroup(type)
    localStorage.setItem("GROUP_SAVED", e.target.value)
    if (type === "combo") {
      const comboList = data.filter((product) => product.type === "combo")
      setData(comboList)
    } else {
      handleQuery({ group: e.target.value })
    }
  }
  const handleStatus = (e) => {
    setStatus(e.target.value)
    handleQuery({ status: e.target.value })
  }
  const handleSearch = (e) => {
    setSearch(e.target.value)
    handleQuery({ search: e.target.value })
  }

  const onRowUpdate = async (newData, oldData) => {
    const promises = []
    if (oldData.name !== newData.name) {
      promises.push(
        Api.patch(`/product/updateName/${newData.id}`, {
          type: newData.type,
          name: newData.name,
        })
      )
    }
    if (oldData.price_sell !== newData.price_sell) {
      promises.push(
        Api.patch(`/product/updatePrice/${newData.id}`, {
          type: newData.type,
          price: newData.price_sell,
        })
      )
    }
    if (oldData.status !== newData.status) {
      promises.push(
        Api.patch(`/product/updateStatus/${newData.id}`, {
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

  const editType = {
    combo: "/dashboard/product/combo",
    complement: "/dashboard/product/complement",
  }
  const handleEdit = (row) => {
    const url = editType?.[row.type]
      ? `${editType[row.type]}/${row.id}`
      : `/dashboard/webstore/tickets/simple/${row.id}`
    history.push(url)
  }

  const deleteType = {
    combo: "/product/combo",
    complement: "/product/complement",
  }

  const handleDelete = async (row) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      if (loading) {
        return false
      }

      setLoading(true)
      const url = deleteType?.[row.type]
        ? `${deleteType[row.type]}/${row.id}`
        : `/product/simple/${row.id}`
      const { data } = await Api.delete(url)

      if (!data) {
        alert("O produto ja foi vendido em algum evento")
      }

      await handleQuery({})
      setLoading(false)
    }
  }

  const filterData = async (data) => {
    const { arr, err } = await fn.filterData(data, groupList, setGroupList)

    return {
      arr,
      err,
    }
  }

  const getFormData = (item) => {
    const fd = new FormData()

    const itemType = !txt.isEmpty(item.type) ? item.type : "bar"

    fd.append("name", item.name)
    fd.append("group_id", item.group_id)
    fd.append("type", itemType)

    fd.append("image", "")
    fd.append("description1", "")
    fd.append("description2", "")
    fd.append("price_sell", item.price_sell)
    fd.append("price_cost", 0)
    fd.append("has_variable", false)
    fd.append("has_courtesy", false)
    fd.append("status", true)
    fd.append("favorite", false)
    fd.append("warehouse", 0)
    fd.append("warehouse_type", "notControled")
    fd.append("print_qrcode", false)
    fd.append("print_ticket", true)
    fd.append("print_local", true)
    fd.append("print_date", true)
    fd.append("print_value", true)
    fd.append("has_control", false)
    fd.append("start_at", 1)
    fd.append("number_copy", 1)
    fd.append("painel_control", false)
    fd.append("print_group", false)
    fd.append("has_cut", false)
    fd.append("print_plate", false)
    fd.append("print_tolerance", false)
    fd.append("has_tolerance", false)
    fd.append("time_tolerance", 0)
    fd.append("take_tolerance", false)
    fd.append("value_tolerance", 0)

    return fd
  }

  const registerNewProducts = async () => {
    setIsRegisterMade(false)
    setIsRegistering(true)

    const fData = await filterData(newData)

    if (fData.arr.length > 0) {
      await new Promise(async (resolve) => {
        let noAdded = fData.err
        let added = 0

        for (let k = 0; k < fData.arr.length; k++) {
          const i = fData.arr[k]
          const formData = getFormData(i)

          await Api.post(`/product/createProduct`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
            // eslint-disable-next-line no-loop-func
            .then(() => { added = added + 1 })
            .catch(() => { noAdded.push(i) })
        }

        resolve({ added, noAdded })
      }).then((result) => {
        setErrData(result.noAdded)
        setDialogMessage(
          result.added > 0
            ? `${result.added} Produto${result.added > 1 ? "s" : ""
            } adicionado${result.added > 1 ? "s" : ""
            } com sucesso. Você já pode fechar esta janela.`
            : "Nenhum produto foi adicionado. Tente novamente mais tarde."
        )
        setIsRegistering(false)
        setIsRegisterMade(true)
      })
    } else {
      setDialogMessage(
        "Nenhum produto foi adicionado. Confira seus campos e tente novamente."
      )
      setErrData(fData.err)
      setIsRegistering(false)
      setIsRegisterMade(true)
    }
  }

  const handleCloseBtn = () => {
    setConfirmDialogShow(false)
    setNewData(null)
    if (isRegisterMade) window.location.reload()
  }

  const handleCreateTicket = () => {
    history.push("/dashboard/webstore/tickets/simple/new")
  }

  return (
    <>
      <Dialog
        open={confirmDialogShow}
        onClose={handleCloseBtn}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Cadastrar produtos</DialogTitle>
        <DialogContent>
          <span>{dialogMessage}</span>
        </DialogContent>
        <DialogActions>
          {!isRegisterMade && errData.length === 0 && (
            <Button
              type="button"
              onClick={registerNewProducts}
              variant="outlined"
              color="primary"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <span style={{ marginRight: 4 }}>Cadastrando </span>
                  <CircularProgress size={25} />
                </>
              ) : (
                "Sim"
              )}
            </Button>
          )}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCloseBtn}
            style={{ cursor: "pointer" }}
          >
            {isRegisterMade ? "Fechar" : "Não"}
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container direction="column" spacing={2} style={{ flexWrap: "nowrap" }}>
        <Grid item lg md sm xs className={styles.productsHeaderWrp}>
          <div className={styles.productsHeaderContainer}>
            <Grid container direction="row" spacing={2}>
              <Grid item className={styles.registerBtnWrapper}>
                <ButtonRound
                  variant="contained"
                  color="primary"
                  onClick={handleCreateTicket}
                >
                  Cadastrar Ticket
                </ButtonRound>
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item lg md sm xs>
          <Grid container direction="row" spacing={2}>
            <Grid item>
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>Grupo</InputLabel>
                <Select
                  value={group}
                  onChange={handleGroup}
                  label="Grupo"
                  variant="outlined"
                  fullWidth
                >
                  {groupList.map((groupItem) => (
                    <MenuItem key={groupItem.id} value={groupItem.id}>
                      {groupItem.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>Situação</InputLabel>
                <Select
                  value={status}
                  onChange={handleStatus}
                  label="Situação"
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="1">Ativo</MenuItem>
                  <MenuItem value="0">Inativo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
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
            data={data}
            columns={columns}
            hasSearch={false}
            actionsRight={true}
            actions={[
              // (rowData) => ({
              //   icon: () =>
              //     rowData.favorite ? (
              //       <Favorite style={{ color: "#F50057" }} />
              //     ) : (
              //       <FavoriteBorder />
              //     ),
              //   tooltip: "Favoritar",
              //   onClick: async (event, rowData) => {
              //     try {
              //       const favorite = rowData.favorite ? 0 : 1
              //       await Api.patch(`/product/updateFavorite/${rowData.id}`, {
              //         type: rowData.type,
              //         favorite,
              //       })
              //       const newData = [...data]
              //       newData[rowData.tableData.id].favorite = favorite
              //       setData(newData)
              //     } catch (error) {
              //       alert(error?.message ?? "Ocorreu um erro ao favoritar")
              //     }
              //   },
              //   hidden: rowData.type === "complement",
              // }),
              // {
              //   icon: () => <FlashOn />,
              //   tooltip: "Edição rápida",
              //   onClick: (event, rowData) => {
              //     rowData.tableData.editing = "update"
              //     forceUpdate()
              //   },
              // },
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
        </Grid>
      </Grid>
    </>
  )
}

export const Icon = () => {
  return <img src={productsIcon} alt="Ícone produtos" />
}
export default TicketsPage
