import { useContext } from "react"
import dbConnection from "../Connection"
import { AppStore } from "../../Context/AppContext"


export function loginStore() {
    const {
        userId,
        agentName,
        bankName,
        branchName,
        totalCollection,
    } = useContext(AppStore)

    const createLoginTable = async () => {
        const db = dbConnection()

        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    "CREATE TABLE IF NOT EXISTS "
                    + "Login "
                    + "(AgentCode TEXT, AgentName TEXT, Bank TEXT, Branch TEXT, Date TEXT, Time TEXT, TotalCollection INTEGER);"
                )
                console.log("<====== Login Table Created ======>")
            })
        } catch (err) {
            console.log("<====== Error during table creation ======>")
        }
    }

    const insertIntoLoginStore = async () => {

        const db = dbConnection()

        try {
            await db.transaction(async tx => {
                await tx.executeSql(
                    "INSERT INTO Login (AgentCode, AgentName, Bank, Branch, Date, Time, TotalCollection) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [userId, agentName, bankName, branchName, new Date().toLocaleDateString("en-GB"), new Date().toLocaleTimeString("en-GB"), totalCollection]
                )
                console.log("<====== Insert into Table Done ======>")
            })
        } catch (err) {
            console.log("<===== Insert DB ERRR =====>", err)
        }


    }

    return { createLoginTable, insertIntoLoginStore }
}
