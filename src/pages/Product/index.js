import React, { useState, useEffect, useRef } from "react"
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
import GridIcon from "@material-ui/icons/Apps"
import ListIcon from "@material-ui/icons/List"
import { useHistory } from "react-router-dom"
import csvtojson from "csvtojson"

import CardProduct from "../../components/Card/product"
import InputMoney from "../../components/Input/Money"
import EaseGrid from "../../components/EaseGrid"

import Api from "../../api"
import { format } from "currency-formatter"
import ButtonRound from "../../components/ButtonRound"
import productsIcon from "../../assets/icons/ic_produtos.svg"

import { Favorite, FavoriteBorder, FlashOn } from "@material-ui/icons/"
import useStyles from "../../global/styles"

const Product = () => {
  const styles = useStyles()

  const history = useHistory()
  const tableRef = useRef(null)
  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const [type, setType] = useState("todos")
  const [group, setGroup] = useState("todos")
  const [status, setStatus] = useState("todos")
  const [groupList, setGroupList] = useState([])
  const [isGrid, setGrid] = useState(true)
  const [placeholder, setPlaceholder] = useState(0)
  const [loading, setLoading] = useState(false)
  const [newData, setNewData] = useState(null)
  const [errData, setErrData] = useState([])
  const [confirmDialogShow, setConfirmDialogShow] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const fileinput = useRef(null)
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
    Api.get(`/group/getList`).then(async ({ data }) => {
      const { success, groups } = data

      if (success) {
        setGroupList([
          { id: "todos", name: "Todos" },
          { id: "combo", name: "Combos" },
          ...groups,
        ])
      } else {
        alert("Erro ao carregar os grupos")
      }
    })
  }, [])

  useEffect(() => {
    if (groupList.length == 0) return

    const group = localStorage.getItem("GROUP_SAVED")

    if (group && group !== "combo") {
      setGroup(group)
      handleQuery({ group })
    } else {
      handleQuery({})
    }
  }, [groupList])

  const handleCreateSimple = () => {
    history.push("/dashboard/product/simple/new")
  }

  const handleCreateCombo = () => {
    history.push("/dashboard/product/combo/new")
  }

  const handleCreateComplement = () => {
    history.push("/dashboard/product/complement/new")
  }

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

  const handleQuery = async (props) => {
    try {
      const selectedGroup = props.group ? props.group : group
      const searchText = props.search !== undefined ? props.search : search
      const selectedStatus = props.status ? props.status : status
      const url = `/product/getList?type=${props.type ? props.type : type}${
        selectedGroup !== "todos" ? "&group=" + selectedGroup : ""
      }&search=${searchText}${
        selectedStatus !== "todos" ? `&status=${selectedStatus}` : ""
      }`

      const { data } = await Api.get(url)

      if (data.success) {
        setData(
          data.products.sort((a, b) =>
            a.status == b.status
              ? a.name.localeCompare(b.name)
              : a.status > b.status
              ? -1
              : 1
          )
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  var time

  const handleType = (e) => {
    setType(e.target.value)
    setGroup("todos")
    localStorage.setItem("GROUP_SAVED", "todos")

    if (time) {
      clearTimeout(time)
      time = null
    }

    time = setTimeout(() => {
      handleQuery({ type: e.target.value, group: "todos" })
    }, 100)
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
  const forceUpdate = () => {
    setPlaceholder((o) => o + 1)
  }
  const editType = {
    combo: "/dashboard/product/combo",
    complement: "/dashboard/product/complement",
  }
  const handleEdit = (row) => {
    const url = editType?.[row.type]
      ? `${editType[row.type]}/${row.id}`
      : `/dashboard/product/simple/${row.id}`
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

  const capFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const capitalizeWords = (string) => {
    let str = ""

    string.split(" ").forEach((word) => {
      str += `${capFirstLetter(word)} `
    })

    return str.trim()
  }

  const filterData = async (data) => {
    let arr = [],
      err = []

    await data.forEach(async (p) => {
      if (p.Nome && p.Preco && p.Descricao && p.Grupo) {
        let matchedGroup = groupList.find(
          (g) => String(g.name).toLowerCase() === String(p.Grupo).toLowerCase()
        )
        if (typeof matchedGroup === "undefined") {
          const { category: newGroup } = await Api.post("/group/createGroup", {
            name: p.Grupo,
            type: "bar",
            status: true,
          })
          matchedGroup = newGroup
        }

        arr.push({
          name: capitalizeWords(p.Nome),
          price_sell: p.Preco,
          description: p.Descricao,
          group_id: matchedGroup.id,
        })
      } else {
        err.push({
          name: p.Nome ?? "Não definido",
          price_sell: p.Preco ?? "Não definido",
          description: p.Descricao ?? "Não definida",
          group_id: p.Grupo ?? "Não definido",
        })
      }
    })

    return {
      arr,
      err,
    }
  }

  const getFormData = (item) => {
    const fd = new FormData()

    fd.append("name", item.name)
    fd.append("price_sell", item.price_sell)
    fd.append("description1", item.description)

    fd.append("group_id", item.group_id)
    fd.append("image", "")
    fd.append("type", "bar")
    fd.append("description2", "")
    fd.append("price_cost", item.price_sell)
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
        fData.arr.forEach(async (i, k) => {
          const formData = getFormData(i)

          await Api.post("/product/createProduct", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
            .then(() => {
              if (k === fData.arr.length - 1) {
                resolve({
                  added: added + 1,
                  noAdded,
                })
              } else added = added + 1
            })
            .catch(() => {
              if (k === fData.arr.length - 1) {
                resolve({
                  added,
                  noAdded: [...noAdded, i],
                })
              } else noAdded.push(i)
            })
        })
      }).then((result) => {
        setErrData(result.noAdded)
        setDialogMessage(
          result.added > 0
            ? `${result.added} Produto${
                result.added > 1 ? "s" : ""
              } adicionado${
                result.added > 1 ? "s" : ""
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

  const loadNewData = async (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = async (f) => {
      const text = f.target.result
      const data = await csvtojson({
        delimiter: [";", ","],
        encoding: "ascii",
      }).fromString(text)
      setNewData(data)
      setConfirmDialogShow(true)
    }

    reader.readAsText(file, "ascii")
  }

  const triggerInputClick = () => {
    if (fileinput.current) fileinput.current.click()
  }

  return (
    <>
      <Dialog
        open={confirmDialogShow}
        onClose={() => setConfirmDialogShow(false)}
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
            onClick={() => setConfirmDialogShow(false)}
            style={{
              cursor: "pointer",
            }}
          >
            {isRegisterMade ? "Fechar" : "Não"}
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container direction="column" spacing={2}>
        <Grid item lg md sm xs className={styles.productsHeaderWrp}>
          <div className={styles.productsHeaderContainer}>
            <Grid container direction="row" spacing={2}>
              <Grid item>
                <ButtonRound
                  variant="contained"
                  color="primary"
                  onClick={handleCreateSimple}
                >
                  Cadastrar Produto
                </ButtonRound>
              </Grid>
              <Grid item>
                <ButtonRound
                  variant="contained"
                  color="primary"
                  onClick={handleCreateCombo}
                >
                  Cadastrar Combo
                </ButtonRound>
              </Grid>
              <Grid item>
                <ButtonRound
                  variant="contained"
                  color="primary"
                  onClick={handleCreateComplement}
                >
                  Cadastrar Complemento
                </ButtonRound>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              spacing={2}
              className={styles.exportDataArea}
            >
              <input
                type="file"
                accept=".csv"
                ref={fileinput}
                onChange={loadNewData}
                hidden
              />
              <Button
                className={styles.exportDataBtn}
                onClick={triggerInputClick}
              >
                Importar dados
              </Button>
            </Grid>
          </div>
        </Grid>

        <Grid item lg md sm xs>
          <Grid container direction="row" spacing={2}>
            <Grid item>
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={type}
                  onChange={handleType}
                  label="Tipo"
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="bar">Bar</MenuItem>
                  <MenuItem value="ingresso">Ingresso</MenuItem>
                  <MenuItem value="estacionamento">Estacionamento</MenuItem>
                  <MenuItem value="complemento">Complemento</MenuItem>
                </Select>
              </FormControl>
            </Grid>
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
            <Grid item>
              <Button
                onClick={() => setGrid(!isGrid)}
                style={{ textTransform: "none" }}
              >
                Modo de Visualização
                {isGrid ? <ListIcon /> : <GridIcon />}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} hidden={!isGrid}>
          <Grid container spacing={2}>
            {data.map((product) => (
              <CardProduct
                key={product.id}
                {...product}
                handleDelete={() => handleDelete(product)}
              />
            ))}
          </Grid>
        </Grid>

        <Grid item lg md sm xs hidden={isGrid}>
          <EaseGrid
            data={data}
            columns={columns}
            hasSearch={false}
            actionsRight={true}
            actions={[
              (rowData) => ({
                icon: () =>
                  rowData.favorite ? (
                    <Favorite style={{ color: "#F50057" }} />
                  ) : (
                    <FavoriteBorder />
                  ),
                tooltip: "Favoritar",
                onClick: async (event, rowData) => {
                  try {
                    const favorite = rowData.favorite ? 0 : 1
                    await Api.patch(`/product/updateFavorite/${rowData.id}`, {
                      type: rowData.type,
                      favorite,
                    })
                    const newData = [...data]
                    newData[rowData.tableData.id].favorite = favorite
                    setData(newData)
                  } catch (error) {
                    alert(error?.message ?? "Ocorreu um erro ao favoritar")
                  }
                },
                hidden: rowData.type === "complement",
              }),
              {
                icon: () => <FlashOn />,
                tooltip: "Edição rápida",
                onClick: (event, rowData) => {
                  rowData.tableData.editing = "update"
                  forceUpdate()
                },
              },
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
        {!isGrid && (
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
        )}
      </Grid>
    </>
  )
}

export const Icon = () => {
  return <img src={productsIcon} alt="Ícone produtos" />
}
export default Product
