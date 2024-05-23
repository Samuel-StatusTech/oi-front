import Api from "../../../api"
import * as txt from "./text"

export const handleQuery = async (
  props,
  setData,
  group,
  search,
  status,
  type
) => {
  const selectedGroup = props.group ? props.group : group
  const searchText = props.search !== undefined ? props.search : search
  const selectedStatus = props.status ? props.status : status
  const url = `/ecommerce/product/getList?type=${props.type ? props.type : type}${
    selectedGroup !== "todos" ? "&group=" + selectedGroup : ""
  }${searchText && searchText.length > 0 ? `&search=${searchText}` : ""}${
    selectedStatus !== "todos" ? `&status=${selectedStatus}` : ""
  }`

  const { data } = await Api.get(url)

  if (data.success) {
    setData(
      data.products
        .filter(p => p.type === 'ingresso')
        .sort((a, b) =>
        a.status === b.status
          ? a.name.localeCompare(b.name)
          : a.status > b.status
          ? -1
          : 1
      )
    )
  }
}

const matchGroup = (groupList, product) => {
  return groupList.find(
    (g) =>
      String(g.name).trim().toLowerCase() ===
      String(product.Grupo).trim().toLowerCase()
  )
}

const treatGroups = async (data, groupList) => {
  return new Promise((resolve) => {
    let adding = []
    let news = []

    data.forEach(async (p, k) => {
      if (!matchGroup([...adding, ...groupList], p)) {
        adding.push({ name: p.Grupo })

        const { data } = await Api.post("/group/createGroup", {
          name: p.Grupo,
          type: !txt.isEmpty(p.Tipo) ? p.Tipo : "bar",
          status: true,
        })

        const { category: newGroup } = data
        news.push({ name: p.Grupo, id: newGroup.id })
      }
    })

    setTimeout(() => {
      if (news.length !== adding.length) {
        setTimeout(() => {
          resolve([...groupList, ...news])
        }, 1500)
      } else resolve([...groupList, ...news])
    }, 1500)
  })
}

export const filterData = async (data, groupList, setGroupList) => {
  let arr = []
  let err = []
  let groupsArr = [...groupList]

  const groups = await treatGroups(data, groupList)

  for (let id = 0; id < data.length; id++) {
    const p = data[id]

    if (!txt.isEmpty(p.Nome) && !txt.isEmpty(p.Grupo)) {
      let matchedGroup = matchGroup(groups, p)

      if (!matchedGroup || typeof matchedGroup === "undefined") {
        console.log("erro", groups, {
          name: !txt.isEmpty(p.Nome) ? p.Nome : "Não definido",
          type: !txt.isEmpty(p.Tipo) ? p.Tipo : "Não definida",
          group_id: !txt.isEmpty(p.Grupo) ? p.Grupo : "Não definido",
          price_sell: p.Preco ?? "Não definido",
        })
      } else {
        let obj = {
          name: txt.capitalizeWords(p.Nome),
          type: p.Tipo,
          group_id: matchedGroup.id,
          price_sell: p.Preco > 0 ? p.Preco : 100,
        }
        arr.push(obj)
      }
    } else {
      err.push({
        name: p.Nome ?? "Não definido",
        type: p.Tipo ?? "Não definida",
        group_id: p.Grupo ?? "Não definido",
        price_sell: p.Preco ?? "Não definido",
      })
    }

    if (id === data.length - 1) {
      setGroupList(
        groupsArr.sort((a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })
      )
    }
  }

  return {
    arr,
    err,
  }
}

export const createGroup = async (name, type) => {
  const { category: newGroup } = await Api.post("/group/createGroup", {
    name,
    type,
    status: true,
  })

  return newGroup ?? { id: "" }
}

export const getComboGroup = async (
  newCombo,
  groupList,
  hasImportedGroup,
  setHasImportedGroup,
  setGroupList
) => {
  return new Promise(async (resolve) => {
    const combosGroup = groupList.find(
      (g) =>
        (g.name.trim().toLowerCase().includes("combos importados") ||
          g.name.trim().toLowerCase() === newCombo.group_id) &&
        g.id !== "combo"
    )

    if (combosGroup) resolve(combosGroup)
    else {
      if (!hasImportedGroup) {
        const newGroup = await createGroup("Combos importados", newCombo.type)
        setHasImportedGroup(true)
        setGroupList([...groupList, newGroup])
        resolve(newGroup)
      }
    }
  })
}

export const getProductsInName = (data, comboName) => {
  let list = []

  let prodsNames = []

  if (comboName.includes("+")) comboName.split("+").map((p) => p.trim())
  else comboName.split("/").map((p) => p.trim())

  prodsNames.forEach((pn) => {
    const pData = data.find((dItem) =>
      dItem.name.trim().toLowerCase().includes(pn.toLowerCase())
    )
    if (pData) {
      list.push(pData)
    } else {
      // add product
    }
  })

  return list
}

export const getComboFormData = async (newCombo, comboGroup) => {
  const formData = new FormData()

  const group = comboGroup ?? (await getComboGroup(newCombo))
  const prods = getProductsInName(newCombo.name)

  formData.append("status", true)
  formData.append("name", newCombo.name)
  formData.append("image", "")
  formData.append("direction", newCombo.type)
  formData.append("favorite", false)
  formData.append("description1", "")
  formData.append("description2", "")
  formData.append("group_id", group.id ?? "")
  formData.append("product_list", JSON.stringify(prods))
  formData.append("ticket_type", "unica")
  formData.append("price_sell", newCombo.price_sell)
  formData.append("price_cost", 0)
  formData.append("print_qrcode", false)
  formData.append("print_ticket", true)
  formData.append("print_local", true)
  formData.append("print_date", true)
  formData.append("print_value", true)

  return {
    formData,
    registeredComboGroup: group && !comboGroup ? group : null,
  }
}
