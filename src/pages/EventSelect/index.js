import React, { useState, useEffect, useCallback, useContext } from "react"
import { connect } from "react-redux"
import {
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
} from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles"

import Api from "../../api"
import { selectEvent, loadEvents, loadUserData } from "../../action"

import Card from "./Card"
import CardNew from "./CardNew"
import UserButton from "../../components/UserButton"
import logo from "../../assets/images/logo-teste.svg"
import CardSkeleton from "./CardSkeleton"
import SearchIcon from "@material-ui/icons/Search"
import { Between } from "../../components/Input/Date"
import { formatDateToDB } from "../../utils/date"
import Context from "../../context"

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#f5f7fa",
    height: "100%",
    padding: 100,
    [theme.breakpoints.down("sm")]: {
      padding: "100px 10px",
    },
  },
  nav: {
    [theme.breakpoints.up("md")]: {
      padding: "0 50px",
    },
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: "4px",
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        border: 0,
      },
      "&.Mui-focused fieldset": {
        border: 0,
      },
    },
  },
}))

const EventSelect = ({ event, loadUserData, selectEvent, loadEvents }) => {
  const history = useHistory()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("ativo")
  const [loading, setLoading] = useState(true)
  const [events, setEvent] = useState([])
  const styles = useStyles()
  const [userData, setUserData] = useState({})
  const [iniValue, setIniValue] = useState(new Date())
  const [endValue, setEndValue] = useState(new Date())
  const [selectType, setSelectType] = useState(1)
  const { setExpireAt } = useContext(Context)
  const onLogout = useCallback(() => {
    history.push("/login")
  }, [history])

  useEffect(() => {
    Api.get("/getProfileData")
      .then(({ data }) => {
        if (!localStorage.getItem("hideExpire")) {
          setExpireAt({ show: true, date: data.expireAt })
        }
        const d = { ...userData, ...data }
        loadUserData(data)
        console.log(data)
        setUserData(data)
      })
      .catch(onLogout)
  }, [onLogout])

  useEffect(() => {
    let dateURL = ""
    if (selectType !== 1) {
      const dateIni = formatDateToDB(iniValue)
      const dateEnd = formatDateToDB(endValue)
      dateURL = `&date_ini=${dateIni}&date_end=${dateEnd}`
    }

    const searchURL = search ? `${`&search=${search}`}` : ""
    const url = `/event/getSelect?status=${status}${searchURL}${dateURL}`
    Api.get(url)
      .then(({ data }) => {
        if (data.success) {
          setEvent(data.events)
          loadEvents(data.events)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [loadEvents, status, search, selectType, iniValue, endValue])

  const handleSelect = (id) => () => {
    selectEvent(id)
    history.push("/dashboard/home")
  }

  const handleCreate = () => {
    history.push("/dashboard/event/new")
  }

  return (
    <div className={styles.container}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 300,
          width: "100%",
          backgroundColor: "#0097FF",
          zIndex: 1,
        }}
      >
        <Grid container justify="space-between" className={styles.nav}>
          <Grid item>
            <img src={logo} alt="logo" height="60" />
          </Grid>
          <Grid item>
            <Button
              onClick={onLogout}
              style={{
                marginTop: "1rem",
                backgroundColor: "#00000000",
                color: "white",
              }}
            >
              Sair
            </Button>
          </Grid>
        </Grid>
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid
              container
              spacing={2}
              style={{
                backgroundColor: "#fff",
                borderRadius: "1.5rem",
                padding: "0.5rem",
              }}
            >
              <Grid item lg={2} md={3} sm={8} xs={8}>
                <TextField
                  placeholder="Pesquisar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  variant="outlined"
                  className={styles.input}
                  size="small"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon style={{ color: "#999" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item lg={2} md={3} sm={4} xs={4}>
                <TextField
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  backgroundcolor="#fff"
                  className={styles.input}
                  select
                >
                  <MenuItem value="ativo">Somente Ativos</MenuItem>
                  <MenuItem value="inativo">Somente Inativos</MenuItem>
                  <MenuItem value="todos">Todos</MenuItem>
                </TextField>
              </Grid>
              <Grid item lg={8} md={8} sm={12} xs={12}>
                <Between
                  showToday={false}
                  iniValue={iniValue}
                  endValue={endValue}
                  onChangeIni={setIniValue}
                  onChangeEnd={setEndValue}
                  onSelectType={setSelectType}
                  selected={1}
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={2}>
              {loading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : (
                <>
                  <CardNew onClick={handleCreate} />
                  {events.map((evt) => (
                    <Card
                      key={evt.id}
                      title={evt.name}
                      date={evt.date_ini}
                      date_end={evt.date_end}
                      {...evt}
                      handleSelect={handleSelect(evt.id)}
                    />
                  ))}
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

const mapStateToProps = ({ event }) => ({ event })

export default connect(mapStateToProps, {
  loadUserData,
  selectEvent,
  loadEvents,
})(EventSelect)
