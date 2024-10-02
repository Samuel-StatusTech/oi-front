export const generateTicketID = (
    isComboObj,
    type,
    prodOId,
    eventOid,
    clientDatabase,
) => {
    try {
        let qrCodeNums = ""

        if (isComboObj) {
            if (type === "bar") {
                qrCodeNums += "2"
            } else if (type === "estacionamento") {
                qrCodeNums += "3"
            } else {
                qrCodeNums += "4"
            }
        } else {
            if (type === "bar") {
                qrCodeNums += "a"
            } else if (type === "estacionamento") {
                qrCodeNums += "b"
            } else {
                qrCodeNums += "c"
            }
        }

        qrCodeNums += parseInt(String(eventOid))
            .toString(36)
            .padStart(3, "0")
            .slice(0, 3)
        qrCodeNums += clientDatabase.slice(2, 5)
        qrCodeNums += parseInt(String(prodOId))
            .toString(36)
            .padStart(3, "0")
            .slice(0, 3)
        qrCodeNums += uuidv5()

        return qrCodeNums.toUpperCase()
    } catch (error) {
        console.log("Erro", error)
        return ""
    }
}

const uuidv5 = () => {
    let uid = ""
    const world = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
    ]
    for (let i = 0; i < 6; i++) {
        const item = world[Math.floor(Math.random() * world.length)]
        uid += item
    }
    return uid
}
